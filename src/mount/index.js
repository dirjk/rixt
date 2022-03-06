
const inputs = "0123456789abcdefghijklmnopqrstuvwxyz"

function getSeed(){
    const seedLength = 6
    let seed = ""
    for (let i=0; i < seedLength; i++) {
        let index = Math.floor(Math.random() * inputs.length)
        seed = seed + inputs[index]
    }
    return seed + '_'
}

const seed = getSeed()
let nodeCount = 0

function getNextKey() {
    let nextKey = seed
    nodeCount = nodeCount + 1
    const leadingZeroCount = Math.floor(nodeCount / inputs.length)
    for (let i = 0; i < leadingZeroCount; i++) {
        nextKey = nextKey + '0'
    }
    nextKey = nextKey + inputs[nodeCount % inputs.length ].toString()
    return nextKey
}
function getNode(key, node) {
    // for now, an ignorant search
    if (node.key === key) {
        return node
    }
    let returnThis = undefined
    node.jsxChildren.forEach(childNode => {
        returnThis = getNode(key, childNode)
        if (returnThis) {
            // we found the node recursively, so break and return early
            return returnThis
            console.log('ERROR: did not return early!')
        }
    })
    return returnThis
}
function newNode () {
    return {
        key: getNextKey(),
        type: undefined,
        tagType: undefined,
        props: undefined,
        parentKey: undefined,
        jsxChildren: []
    }
}

const nodeTree = newNode()
export {
    nodeTree,
    newNode,
    getNode
}
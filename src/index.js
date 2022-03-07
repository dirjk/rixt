import { 
    getDomElement
} from './utils.js'
import {
    getCompState,
    setCompState,
    getScopedState,
    setScopedState
} from './state/index.js'
import {
    nodeTree,
    newNode,
    getNode
} from './mount/index.js'

let root = undefined
let shadows = {}
let keyToPos = {}
let posToKey = {}
const testKey = "abcdef_"
let testCount = 0
function rixt(tag, props, ...children){
    // is it possible to tag each function with a key?
    // no, not directly. however could do a wrapper function with saved meta data.
    // .... except the wrapper function doesn't save context between calls to rixt(). fuck.
    // hold on! it does save context if the count is set outside of the x arrow function! success! we can set a component key! fuck yeah!
    // ... hold on, again... it always seems to be the value of the last key generated, not of a unique key.. hmmmmmmmm...
    let newTag = undefined
    if (typeof tag === 'function') {
        testCount = testCount + 1
        newTag = function(x) {
            // const metaKey = String(testKey + testCount.toString())
            // console.log('rixt() |', metaKey, tag)
            return {
                metaKey: String(testKey + testCount.toString()),
                tag
            }
        }
    }
    // we remove all empty strings and none/undefined children, but keep 0s.
    children = children.filter(n => {
        if (typeof n === 'number' && n === 0) {
            return true
        }
        return n
    })
    return { tag: newTag || tag, props, children}
}
let currentPosition = '0'
function recursiveMount(elementObj, pos, currentNode) {
    // our goal is to return an element so we can mount it somewhere.
    let element
    // first, are we getting something we can build an element out of, or do we need to do some evaluation first?
    if (elementObj.tag && typeof elementObj.tag === 'string') {
        // if its a string, we can build an element out of it.
        element = document.createElement(elementObj.tag)
        element.setAttribute('data-meta', currentNode.metaKey)
        // next we iterate through the props and attach them to the DOM of this element.
        if (elementObj.props && typeof elementObj.props === 'object') {
            Object.keys(elementObj.props).forEach(key => {
                const attr = elementObj.props[key]
                if (typeof attr === 'function') {
                    element[key] = attr
                } else {
                    element.setAttribute(key, elementObj.props[key])
                }
            })
        }
        // finally we do the children. This is where the recursion comes in.
        elementObj.children && elementObj.children.forEach((child, i) => {
            // 1. set the current position of this child in the overall DOM structure.
            currentPosition = `${pos}.${i}`
            if (( child || child === 0) && (typeof child === 'string' || typeof child === 'number') ) {
                element.appendChild(document.createTextNode(child))
            } else if (child && typeof child.tag === 'function') {
                // this is probably another component.
                // these nodes get new nodes because they are new jsx components. However, they get created the next level down so for now we just don't do anything with them.
                console.log('child function |', elementObj.tag, child.tag )
                const domElement = recursiveMount(child, currentPosition, currentNode)
                element.appendChild(domElement)
            } else if (child !== null) {
                // i don't know what this is. maybe something else?
                // update: these are just regular DOM nodes, not jsx components. it is entirely possible that jsx components exist as children of these nodes.
                // these nodes should be the same as the parent, because they are not new jsx functions.
                console.log('other child |', elementObj.tag, child.tag, child.props, child.children )
                const domElement = recursiveMount(child, currentPosition, currentNode)
                element.appendChild(domElement)
            }
        })
    } else if (elementObj.tag && typeof elementObj.tag === 'function') {
        console.log('a function got passed to recursiveMount()... ? time for a new node!')
        let newChildNode = newNode()
        // if its a function, we need to evaluate it before we can build it.
        let metaObject = elementObj.tag()
        console.log('recursive | ', evaluatedObj)
        newChildNode.parentKey = currentNode.key
        newChildNode.metaKey = metaObject.metaKey
        newChildNode.type = elementObj.tag.name
        newChildNode.tagType = metaObject.tag.name
        newChildNode.props = elementObj.props
        // here we actually evaluate the function without the meta data
        let evaluatedObj = metaObject.tag(elementObj.props)
        // lets also save it so we can access it later, if needed
        currentNode.jsxChildren.push(newChildNode)
        shadows[pos] = elementObj
        posToKey[pos] = newChildNode.key
        keyToPos[newChildNode.key] = pos
        return recursiveMount(evaluatedObj, pos, newChildNode)

    }
    // finally, we return the built element for this level of the tree
    return element
}

export function mount(mountPoint, element) {
    root = mountPoint

    // apparently its not evaluated until right now
    const topLevelJSXobject = element()
    nodeTree.type = element.name
    nodeTree.props = topLevelJSXobject.props
    nodeTree.tagType = topLevelJSXobject.tag
    console.log('topLevel', topLevelJSXobject, element.name, Object.keys(element), element)
    currentPosition = "0"
    posToKey[currentPosition] = nodeTree.key
    keyToPos[nodeTree.key] = currentPosition
    shadows[currentPosition] = topLevelJSXobject

    const rootElement = recursiveMount(topLevelJSXobject, currentPosition, nodeTree)
    document.getElementById(mountPoint).appendChild(rootElement)
    console.log('nodeTree', nodeTree)
    console.log('posToKey', posToKey)
    console.log('keyToPos', keyToPos)
}

export function update(...everything) {
    if (everything.length === 0) {
        console.log('update()')
        return currentPosition
    } else {
        console.log('update(x)', everything)
        let elementKey = everything[0]
        currentPosition = elementKey
        let currentDomElement = getDomElement(document.getElementById(root), elementKey)
        let currentElement = shadows[elementKey]
        if (!currentElement) {
            console.log('rixt: no element to mount', elementKey, shadows)
        } else {
            // we need to delete all the children elements that will be updated from the shadow
            // temp: skip deleting keyed objects from the keyToPos and posToKey, but eventually will need to remove these as memory management. it should be fine for now because each mounted component is given a new unique key.
            // also we will leave the node branches unmanaged, although i think that they are deleted automatically if there are no pointers to them.
            const keys = Object.keys(shadows)
            keys.forEach(key => {
                if (key.indexOf(elementKey) === 0 && key !== elementKey ) {
                    delete shadows[key]
                }
            })
            console.log("wtf", elementKey, nodeTree, keyToPos)
            // get this element from the node tree.
            let currentNode = getNode(posToKey[elementKey], nodeTree)
            console.log('currentNode', currentNode)
            let newElement = recursiveMount(currentElement, elementKey, currentNode)
            currentDomElement.replaceWith(newElement)
        }
        console.log('update() testCount |', testCount)
    }
}
export function updateCompState(key, value){
    const activeComponent = "?"
    setCompState(activeComponent, key, value)
}
export function compState() {
    const activeComponent = "?"
    console.log('compState()', activeComponent)
    return getCompState(activeComponent)
}
export function scopedState(scope) {
    return getScopedState(scope, currentPosition)
}
export function updateScopedState(scope, key, value, render) {
    if (render === undefined) {
        render = true
    }
    let subscribedComponents = setScopedState(scope, key, value)
    let filteredSubscriptions = []
    // first we sort the subscribed components keys
    subscribedComponents.sort((a,b) => {
        const acount = a.split('.').length
        const bcount = b.split('.').length
        return a - b
    })
    let test = subscribedComponents[0]
    let temp = subscribedComponents.slice(1)
    while(temp.length > 0) {
        filteredSubscriptions.push(test)
        temp.forEach((key,i) => {
            if (key.indexOf(test) === 0) {
                // get rid of it.
                temp[i] = null
            }
        })
        temp = temp.filter(n => n)
        test = temp[0]
        temp = temp.slice(1)
    }
    // make sure we keep the last one
    if (test) { filteredSubscriptions.push(test) }
    // now we update for each unique tree that is subscribed to this scope
    if(render) {
        filteredSubscriptions.forEach(sub => {
            update(sub)
        })
    }
}
export default rixt
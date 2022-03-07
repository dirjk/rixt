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

// rendering engine data structures:
let rootMountPoint
let metaKeyToNode = {}
let metaKeyToPos = {}
let posToMetaKey = {}

// jsx component generation variables:
const metaKey_seed = "abcdef_"
let metaKey_count = 0
function rixt(tag, props, ...children){
    let metaTag = undefined
    if (typeof tag === 'function') {
        console.log('rixt() |', tag, props, [children])
        metaKey_count = metaKey_count + 1
        const metaKey = metaKey_seed + metaKey_count
        metaTag = function() {
            return {
                metaKey,
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
    return { tag: metaTag || tag, props, children}
}
// the actual rendering function that does most of the work
function recursiveMount(elementObj, pos, currentNode) {
    // our goal is to return an element so we can mount it somewhere.
    let element
    // first, are we getting something we can build an element out of, or do we need to do some evaluation first?
    if (elementObj.tag && typeof elementObj.tag === 'string') {
        // if its a string, we can build an element out of it.
        element = document.createElement(elementObj.tag)
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
            } else if (child !== null) {
                // i don't know what this is. maybe something else?
                // update: these are just regular DOM nodes, or unrendered jsx components. simply do a pass through as it will be handled in the next iteration of the recursion.
                const domElement = recursiveMount(child, currentPosition, currentNode)
                element.appendChild(domElement)
            }
        })
    } else if (elementObj.tag && typeof elementObj.tag === 'function') {
        console.log('a function got passed to recursiveMount()... ? time for a new node!')
        // first thing we do for these is to create a new node so we can look at it.
        let newChildNode = newNode()
        // if its a function, we need to evaluate it before we can build it.
        console.log('recursiveRender() about to eval |', elementObj)
        let metaObject = elementObj.tag()
        const metaKey = metaObject.metaKey
        newChildNode.metaJsxObj = metaObject
        newChildNode.parentKey = currentNode.metaKey
        newChildNode.metaKey = metaKey
        newChildNode.type = metaObject.tag.name
        newChildNode.props = elementObj.props

        // here we actually evaluate the function without the meta data
        let evaluatedObj = metaObject.tag(elementObj.props)
        newChildNode.tagType = evaluatedObj.tag
        // lets also save it so we can access it later, if needed
        currentNode.nodeChildren.push(newChildNode)
        metaKeyToNode[metaKey] = newChildNode
        metaKeyToPos[metaKey] = currentPosition
        posToMetaKey[currentPosition] = metaKey
        // and finally, we do the actual recursion
        return recursiveMount(evaluatedObj, pos, newChildNode)

    }
    // finally, we return the built element for this level of the tree
    return element
}


// global component mounting variables
let currentPosition
export function mount(mountPoint, element) {
    // save the ID where the whole thing is mounted.
    rootMountPoint = mountPoint
    // the metaKey isn't defined for the root element, so we set it to 'root' and its position on the DOM tree
    nodeTree.metaKey = 'root'
    currentPosition = "0"
    // set up the maps
    metaKeyToNode['root'] = nodeTree
    metaKeyToPos['root'] = currentPosition
    posToMetaKey[currentPosition] = 'root'
    // apparently its not evaluated until right now. Note this call isn't made until after the maps are set up.
    // this is so that this element is registered and up to date when update() or other rixt functions are called.
    const topLevelJSXobject = element()
    // next we set this component as the root of the nodeTree
    nodeTree.type = element.name
    nodeTree.props = topLevelJSXobject.props
    nodeTree.tagType = topLevelJSXobject.tag
    nodeTree.metaJsxObj = {
        metaKey: 'root',
        tag: element
    }
    // lets see if we set this up correctly:
    console.log('mount - metaKeyToNode |', metaKeyToNode)
    console.log('mount - metaKeyToPos  |', metaKeyToPos)
    console.log('mount - posToMetaKey  |', posToMetaKey)
    console.log('mount - nodeTree      |', nodeTree)

    const rootElement = recursiveMount(topLevelJSXobject, currentPosition, nodeTree)
    document.getElementById(mountPoint).appendChild(rootElement)
}

export function update(...everything) {
    if (everything.length === 0) {
        return posToMetaKey[currentPosition]
    } else {
        console.log('\n\n-----------\n\n')
        let elementMetaKey = everything[0]
        currentPosition = metaKeyToPos[elementMetaKey]
        let currentDomElement = getDomElement(document.getElementById(rootMountPoint), currentPosition)
        console.log('currentDomElement |', currentDomElement)
        // let's rerender this component.
        // whats the original node look like?
        const originalNode = metaKeyToNode[elementMetaKey]
        console.log('originalNode  |', originalNode)
        const JsxObject = originalNode.metaJsxObj.tag()
        console.log('JsxObject |', JsxObject)
        let newRenderedElement = recursiveMount(JsxObject, currentPosition, originalNode)
        currentDomElement.replaceWith(newRenderedElement)
        console.log('\n\n-----------\n\n')
        console.log('nodeTree after update() | ', nodeTree)
        console.log('metaKeyToPos  |', metaKeyToPos)
        console.log('metaKeyToNode |', metaKeyToNode)
        console.log('posToMetaKey  |', posToMetaKey)
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
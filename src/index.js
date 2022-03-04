import { 
    getDomElement
} from './utils.js'
import {
    getScopedState,
    setScopedState
} from './state/index.js'

let root = undefined
let shadows = {}
function rixt(tag, props, ...children){
    // we remove all empty strings and none/undefined children, but keep 0s.
    children = children.filter(n => {
        if (typeof n === 'number' && n === 0) {
            return true
        }
        return n
    })
    return { tag, props, children}
}
let currentPosition = '0'
function recursiveMount(elementObj, pos) {
    // our goal is to return an element so we can mount it somewhere.
    let element
    // first, are we getting something we can build an element out of, or do we need to do some evaluation first?
    if (elementObj.tag && typeof elementObj.tag === 'string') {
        // if its a string, we can build an element out of it.
        element = document.createElement(elementObj.tag)
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
        elementObj.children && elementObj.children.forEach((child, i) => {
            currentPosition = `${pos}.${i}`
            if (( child || child === 0) && (typeof child === 'string' || typeof child === 'number') ) {
                element.appendChild(document.createTextNode(child))
            } else if (child && typeof child.tag === 'function') {
                const domElement = recursiveMount(child, currentPosition)
                element.appendChild(domElement)
            } else if (child !== null) {
                const domElement = recursiveMount(child, currentPosition)
                element.appendChild(domElement)
            }
        })
    } else if (elementObj.tag && typeof elementObj.tag === 'function') {
        // if its a function, we need to evaluate it before we can build it.
        let evaluatedObj = elementObj.tag(elementObj.props)
        // lets also save it so we can access it later, if needed
        shadows[pos] = elementObj
        return recursiveMount(evaluatedObj, pos)

    }
    // finally, we return the built element for this level of the tree
    return element
}

export function mount(mountPoint, element) {
    root = mountPoint

    // apparently its not evaluated until right now
    currentPosition = "0"
    shadows[currentPosition] = element()

    const rootElement = recursiveMount(element(), currentPosition)
    document.getElementById(mountPoint).appendChild(rootElement)
}

export function update(...everything) {
    if (everything.length === 0) {
        return currentPosition
    } else {
        let elementKey = everything[0]
        currentPosition = elementKey
        let currentDomElement = getDomElement(document.getElementById(root), elementKey)
        let currentElement = shadows[elementKey]
        if (!currentElement) {
            console.log('rixt: no element to mount', elementKey, shadows)
        } else {
            // we need to delete all the children elements that will be updated from the shadow
            const keys = Object.keys(shadows)
            keys.forEach(key => {
                if (key.indexOf(elementKey) === 0 && key !== elementKey ) {
                    delete shadows[key]
                }
            })
            let newElement = recursiveMount(currentElement, elementKey)
            currentDomElement.replaceWith(newElement)
        }
    }
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
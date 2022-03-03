import { 
    getDomElement
} from './utils.js'

let root = undefined
let shadows = {}
function rixt(tag, props, ...children){
    // we remove all empty strings and none/undefined children
    children = children.filter(n => n)
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
            if (child && (typeof child === 'string' || typeof child === 'number')) {
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
            console.log('no element to mount', elementKey, shadows)
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

export default rixt
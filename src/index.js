import { 
    addBranch,
    newBranch,
    attachElement,
    attachElementObject,
    getElement,
    getDomElement
} from './utils.js'

let root = undefined
let tree

function rixt(tag, props, ...children){
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
        return recursiveMount(evaluatedObj, pos)

    }
    // finally, we return the built element for this level of the tree
    return element
}

export function mount(mountPoint, element) {
    root = mountPoint

    // apparently its not evaluated until right now
    currentPosition = '0'
    tree = newBranch()
    tree.element = 'root'
    tree.obj = element

    const rootElement = recursiveMount(element(), currentPosition)
    document.getElementById(mountPoint).appendChild(rootElement)

    console.log('tree', tree)
}

export function update(...everything) {
    if (everything.length === 0) {
        return currentPosition
    } else {
        let elementKey = everything[0]
        currentPosition = elementKey
        console.log('elementKey', elementKey )
        let currentDomElement = getDomElement(document.getElementById(root), elementKey)
        // let currentElement = getElement(tree, elementKey)
        // let newElement = recursiveMount(currentElement.obj.tag(currentElement.obj.props), elementKey)
        // currentDomElement.replaceWith(newElement)
    }
}

export default rixt
let root = undefined

function rixt(tag, props, ...children){
    return { tag, props, children}
}

function recursiveMount(elementObj) {
    const element = document.createElement(elementObj.tag)
    if (elementObj.props !== null) {
        Object.keys(elementObj.props).forEach(key => {
            const attr = elementObj.props[key]
            if (typeof attr === 'function') {
                element[key] = attr
            } else {
                element.setAttribute(key, elementObj.props[key])
            }
        })
    }
    elementObj.children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child))
        } else if (typeof child.tag === 'function') {
            const newElement = child.tag()
            element.appendChild(recursiveMount(newElement))
        } else {
            element.appendChild(recursiveMount(child))
        }
    })
    return element
}

export function mount(mountPoint, element) {
    root = mountPoint

    // apparently its not evaluated until right now
    const rootElement = recursiveMount(element())

    document.getElementById(mountPoint).appendChild(rootElement)
}

export default rixt
export function newBranch() {
    return {
        obj: null,
        element: null,
        branches: []
    }
}
export function getDomElement(root, index) {
    const steps = index.split('.')
    let currentElement = root
    steps.forEach(step => {
        currentElement = currentElement.childNodes[step]
    })
    return currentElement
}
export function getElement(tree, index) {
    // tree is an array of objects of arbitrary depth.
    // index is a dot delimited string that represents the index of where we want to attach the element.
    const steps = index.split('.')
    let currentBranch = tree
    steps.forEach(step => {
        currentBranch = currentBranch.branches[step]
    })
    return currentBranch
}
export function attachElementObject(tree, obj, index) {
    // tree is an array of objects of arbitrary depth.
    // index is a dot delimited string that represents the index of where we want to attach the element.
    const steps = index.split('.')
    let currentBranch = tree
    steps.forEach(step => {
        currentBranch = currentBranch.branches[step]
    })
    currentBranch.obj = obj   
}
export function attachElement(tree, element, index) {
    // tree is an array of objects of arbitrary depth.
    // index is a dot delimited string that represents the index of where we want to attach the element.
    const steps = index.split('.')
    let currentBranch = tree
    steps.forEach(step => {
        currentBranch = currentBranch.branches[step]
    })
    currentBranch.element = element   
}


export function addBranch(tree, index) {
    // tree is an array of objects of arbitrary depth.
    // index is a dot delimited string that represents the index of where we want to add a branch to.
    const steps = index.split('.')
    let currentBranch = tree
    steps.forEach(step => {
        if (!currentBranch.branches[step]) {
            currentBranch.branches.push(newBranch())
        }
        currentBranch = currentBranch.branches[step]
    })
}
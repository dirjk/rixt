const states = {}
const stateKeys = {}
export function getScopedState(scope, key) {
    // register the component key to the scope
    let components = stateKeys[scope]
    if (!components) {
        stateKeys[scope] = []
    }
    if (stateKeys[scope].indexOf(key) === -1) {
        stateKeys[scope].push(key)
    }
    let returnThis = states[scope]
    if (!returnThis) {
        returnThis = {}
        states[scope] = returnThis
    }
    return returnThis
}

export function setScopedState(scope, key, value) {
    if (!states[scope]) {
        states[scope] = {}
    }
    states[scope][key] = value
    return stateKeys[scope] || []
}

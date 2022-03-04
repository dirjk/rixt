/** @jsx rixt */
import rixt, { update, scopedState, updateScopedState} from '../src/index.js'

export const BasicComponent = props => {
    return (
        <div class="basic-component container">
            <p>This is a very basic component, it is essentially just static content. The color of this text should be red.</p>
        </div>
    )
}

export const PropComponent = props => {
    return (
        <div
            class="prop-component container"
            data-test={props.datatest}    
        >
            <p>{props.ptext}</p>
        </div>
    )
}

export const OnClickComponent = props => {
    return (
        <div class="onclick-component container">
            <button
                onclick={() => { alert('surprise!')}}
            >click me for a surprise</button>
        </div>
    )
}

let sharedClickCount = 0
export const ComponentScopedSharedStateComponent = props => {
    sharedClickCount = sharedClickCount
    const key = update()
    return (
        <div class="shared-state-component">
            <p>Click Count: {sharedClickCount}</p>
            <button onclick={() => { 
                sharedClickCount = sharedClickCount + 1
                update(key)
            }}>click me</button>
        </div>
    )
}

updateScopedState('click','count',0)
export const ScopedStateComponent = props => {
    const sharedState = scopedState('click')
    return (
        <div class="shared-state-component">
            <p>Click Count: {sharedState.count}</p>
            <button onclick={() => {
                updateScopedState('click', 'count', sharedState.count + 1)
            }}>click me</button>
        </div>
    )
}
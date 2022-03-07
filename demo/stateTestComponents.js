/** @jsx rixt */
import rixt, { 
    update,
    compState,
    updateCompState
} from '../src/index.js'

const TestPropComponent = props => {
    return (
        <div>{props.x}{" <- x"}</div>
    )
}

let renderCountOne = 0
const RenderCountElement = () => {
    const state = compState()
    state.count = 0
    updateCompState("count", state.count + 1)
    renderCountOne = renderCountOne + 1
    return (
        <div>
            <p>Render count of the child element: {renderCountOne}</p>
            <p>Render count of the state: {state.count}</p>
        </div>
    )
}

let renderCountTwo = 0
export const RootElement = () => {
    renderCountTwo = renderCountTwo + 1
    const key = update()
    return (
        <div data-info="layer-1" class="container">
            <p>render count of the root element: {renderCountTwo}</p>
            <div data-info="layer-2">
                <div data-info="layer-3" class="sub-container">
                    this is the content of the top element.
                    <TestPropComponent x={renderCountTwo}/>
                </div>
                <div data-info="layer-3" class="sub-container">
                    <RenderCountElement/>
                </div>
                <div data-info="layer-3" class="sub-container">
                    <button onclick={() => { update(key) }}>update()</button>
                </div>
            </div>
        </div>
    )
}

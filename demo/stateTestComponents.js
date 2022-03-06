/** @jsx rixt */
import rixt, { update } from '../src/index.js'

let renderCountOne = 0
const RenderCountElement = () => {
    renderCountOne = renderCountOne + 1
    return (
        <p>Render count of the child element: {renderCountOne}</p>
    )
}

let renderCountTwo = 0
export const RootElement = () => {
    console.log('rendering', renderCountTwo)
    renderCountTwo = renderCountTwo + 1
    const key = update()
    return (
        <div data-info="layer-1" class="container">
            <p>render count of the root element: {renderCountTwo}</p>
            <div data-info="layer-2">
                <div data-info="layer-3" class="sub-container">
                    this is the content of the top element.
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

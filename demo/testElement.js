
/** @jsx rixt */
import rixt, { update, scopedState, updateScopedState} from '../src/index.js'
import StateExample from './scopedStateDemo.js'

const Goodbye = props => {
    return (
        <div>            
            { props === false ? '' : null }
            <p>hello render count: {props.renderCount}</p>
            <StateExample/>
        </div>
    )
}

let helloRenderCount = 0
const Hello = props => {
    helloRenderCount = helloRenderCount + 1
    const key = update()
    return (
        <div>
            <p>hello{props.x}</p>
            <button onclick={() => {
                update(key)
            }}>hello button</button>
            <Goodbye renderCount={helloRenderCount}/>
        </div>
)}


let showP = false
const testElement = () => {
    const testState = scopedState('test')
    const key = update()
    return (
    <div data={'test'} id="myID">
        testElement
        <p fuck={'you'}>ptest</p>
        2ndtestElement
        <Hello x={'y'}/>
        <button onclick={() => {
            updateScopedState('test', 'example', 'yes, please')
        }}>test button</button>
    </div>
)}

export default testElement
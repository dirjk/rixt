
/** @jsx rixt */
import rixt, { update } from '../src/index.js'

const Goodbye = props => {
    return (
        <p>hello render count: {props.renderCount}</p>
    )
}

let helloRenderCount = 0
const Hello = props => {
    helloRenderCount = helloRenderCount + 1
    console.log('helloRenderCount', helloRenderCount)
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
const testElement = () => {
    const key = update()
    return (
    <div data={'test'} id="myID">
        testElement
        <p fuck={'you'}>ptest</p>
        2ndtestElement
        <Hello x={'y'}/>
        <button onclick={() => {
            update(key)
        }}>test button</button>
    </div>
)}

export default testElement
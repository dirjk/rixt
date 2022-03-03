
/** @jsx rixt */
import rixt from '../src/index.js'

const Hello = () => (
    <p>hello</p>
)
const testElement = () => {
    return (
    <div data={'test'} id="myID">
        testElement
        <p fuck={'you'}>ptest</p>
        2ndtestElement
        <Hello/>
        <button onclick={() => {
            alert('ok')
        }}>test button</button>
    </div>
)}

export default testElement
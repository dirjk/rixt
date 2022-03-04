/** @jsx rixt */
import rixt, { scopedState } from '../src/index.js'

const StateExample = props => {
    return(
        <div>scopedState; {scopedState('test').example}</div>
    )
}
export default StateExample
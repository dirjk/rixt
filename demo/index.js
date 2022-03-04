/** @jsx rixt */
import rixt from '../src/index.js'

import { mount } from '../src/index.js'
import testElement from './testElement'
import { 
    BasicComponent,
    PropComponent,
    OnClickComponent,
    ComponentScopedSharedStateComponent,
    ScopedStateComponent
} from './demo.js'

import './demo.css'

const mainApp = () => (
    <div class="container">
        <BasicComponent/>
        <PropComponent
            ptext={"this text is set through a prop. the `data-test` attribute is set through a prop as well."}
            datatest={'this is the data-test attribute'}
        />
        <OnClickComponent/>
        <div class="container">
            <h3>shared component-type states</h3>
            <p>
                These components all share a click count state because they are the same type. lazy rerenders only occur when a component instance calls update()
            </p>
            <ComponentScopedSharedStateComponent/>
            <ComponentScopedSharedStateComponent/>
            <ComponentScopedSharedStateComponent/>
            <ComponentScopedSharedStateComponent/>
        </div>
        <div class="container">
            <h3>shared scoped states</h3>
            <p>
                These components all share a click count state because they all use scopedState(). rerenders occur every time the scopedState is updated.
            </p>
            <ScopedStateComponent/>
            <ScopedStateComponent/>
            <ScopedStateComponent/>
            <ScopedStateComponent/>
        </div>
    </div>
)

mount('index-entry-mount', mainApp)
// mount('index-entry-mount', testElement)
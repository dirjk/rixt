import { mount } from '../src/index.js'
import testElement from './testElement'

console.log('fuck', testElement())
mount('index-entry-mount', testElement)
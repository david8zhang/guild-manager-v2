import { createStore } from 'redux'
import BaseReducer from './baseReducer'

const store = createStore(BaseReducer)

export { store }

import { combineReducers } from 'redux'
import GuildReducer from './guildWidget'

export default combineReducers({
  guild: GuildReducer,
})

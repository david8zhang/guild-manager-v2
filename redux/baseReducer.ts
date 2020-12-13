import { combineReducers } from 'redux'
import GuildReducer from './guildWidget'
import SeasonReducer from './seasonWidget'

export default combineReducers({
  guild: GuildReducer,
  season: SeasonReducer,
})

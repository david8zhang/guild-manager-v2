import { combineReducers } from 'redux'
import GuildReducer from './guildWidget'
import SeasonReducer from './seasonWidget'
import FrontOfficeReducer from './frontOfficeWidget'

export default combineReducers({
  guild: GuildReducer,
  season: SeasonReducer,
  frontOffice: FrontOfficeReducer,
})

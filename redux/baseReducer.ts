import { combineReducers } from 'redux'
import GuildReducer from './guildWidget'
import SeasonReducer from './seasonWidget'
import FrontOfficeReducer from './frontOfficeWidget'
import LeagueReducer from './leagueWidget'
import SaveReducer from './saveReducer'

export default combineReducers({
  guild: GuildReducer,
  season: SeasonReducer,
  frontOffice: FrontOfficeReducer,
  league: LeagueReducer,
  save: SaveReducer,
})

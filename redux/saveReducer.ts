import { SAVE_FRONT_OFFICE } from './frontOfficeWidget'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SAVE_GUILD } from './guildWidget'
import { SAVE_LEAGUE } from './leagueWidget'
import { SAVE_SEASON } from './seasonWidget'

export default (state: any = null, action: any) => {
  switch (action.type) {
    case SAVE_FRONT_OFFICE: {
      const newSaveState = { ...state, frontOffice: action.payload }
      AsyncStorage.setItem('@save', JSON.stringify(newSaveState))
      return newSaveState
    }

    case SAVE_GUILD: {
      const newSaveState = { ...state, guild: action.payload }
      AsyncStorage.setItem('@save', JSON.stringify(newSaveState))
      return newSaveState
    }

    case SAVE_LEAGUE: {
      const newSaveState = { ...state, league: action.payload }
      AsyncStorage.setItem('@save', JSON.stringify(newSaveState))
      return newSaveState
    }

    case SAVE_SEASON: {
      const newSaveState = { ...state, season: action.payload }
      AsyncStorage.setItem('@save', JSON.stringify(newSaveState))
      return newSaveState
    }

    default:
      return state
  }
}

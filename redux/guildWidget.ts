export const CREATE_GUILD = 'CREATE_GUILD'
export const ADD_STARTER_HEROES = 'ADD_STARTER_HEROES'
export const ADD_RESERVE_HEROES = 'ADD_RESERVE_HEROES'
export const SET_OTHER_TEAMS = 'SET_OTHER_TEAMS'
export const SET_SCHEDULE = 'SET_SCHEDULE'
export const SAVE_GUILD = 'SAVE_GUILD'

export const createGuild = (payload: any) => ({
  type: CREATE_GUILD,
  payload,
})

export const addStarterHeroes = (payload: any) => ({
  type: ADD_STARTER_HEROES,
  payload,
})

export const addReserveHeroes = (payload: any) => ({
  type: ADD_RESERVE_HEROES,
  payload,
})

export const setOtherTeams = (payload: any) => ({
  type: SET_OTHER_TEAMS,
  payload,
})

export const setSchedule = (payload: any) => ({
  type: SET_SCHEDULE,
  payload,
})

export const saveGuild = (payload: any) => ({
  type: SAVE_GUILD,
  payload,
})

const initialState: any = null

export default (state = initialState, action: any) => {
  switch (action.type) {
    case CREATE_GUILD: {
      return action.payload
    }
    case ADD_STARTER_HEROES: {
      return {
        ...state,
        roster: state.roster
          ? state.roster.concat(action.payload)
          : action.payload,
        starterIds: action.payload.map((h: any) => h.heroId),
      }
    }
    case ADD_RESERVE_HEROES: {
      return {
        ...state,
        roster: state.roster
          ? state.roster.concat(action.payload)
          : action.payload,
      }
    }
    case SET_OTHER_TEAMS: {
      return {
        ...state,
        league: action.payload,
      }
    }
    case SET_SCHEDULE: {
      return {
        ...state,
        schedule: action.payload,
      }
    }
    case SAVE_GUILD: {
      return action.payload
    }
    default:
      return state
  }
}

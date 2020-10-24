export const CREATE_GUILD = 'CREATE_GUILD'
export const ADD_STARTER_HEROES = 'ADD_STARTER_HEROES'
export const ADD_RESERVE_HEROES = 'ADD_RESERVE_HEROES'

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

const initialState: any = null

export default (state = initialState, action: any) => {
  switch (action.type) {
    case CREATE_GUILD: {
      return action.payload
    }
    case ADD_STARTER_HEROES: {
      return {
        ...state,
        team: state.heroes
          ? state.heroes.concat(action.payload)
          : action.payload,
      }
    }
    case ADD_RESERVE_HEROES: {
      return {
        ...state,
        team: state.heroes
          ? state.heroes.concat(action.payload)
          : action.payload,
      }
    }
    default:
      return state
  }
}

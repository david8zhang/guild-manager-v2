export const CREATE_GUILD = 'CREATE_GUILD'
export const ADD_STARTER_HEROES = 'ADD_STARTER_HEROES'

export const createGuild = (payload: any) => ({
  type: CREATE_GUILD,
  payload,
})

export const addStarterHeroes = (payload: any) => ({
  type: ADD_STARTER_HEROES,
  payload,
})

const initialState = null

export default (state = initialState, action: any) => {
  switch (action.type) {
    case CREATE_GUILD: {
      return action.payload
    }
    case ADD_STARTER_HEROES: {
      return { ...action.payload, heroes: action.payload }
    }
    default:
      return state
  }
}

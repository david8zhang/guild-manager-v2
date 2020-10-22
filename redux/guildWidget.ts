export const CREATE_GUILD = 'CREATE_GUILD'

export const createGuild = (payload: any) => ({
  type: CREATE_GUILD,
  payload,
})

const initialState = null

export default (state = initialState, action: any) => {
  switch (action.type) {
    case CREATE_GUILD: {
      return action.payload
    }
    default:
      return state
  }
}

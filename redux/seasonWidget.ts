export const SAVE_SEASON = 'SAVE_SEASON'

export const saveSeason = (seasonObj: any) => ({
  type: SAVE_SEASON,
  payload: seasonObj,
})

export default (state = null, action: any) => {
  switch (action.type) {
    case SAVE_SEASON: {
      return action.payload
    }
    default:
      return state
  }
}

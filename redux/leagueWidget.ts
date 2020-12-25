export const SAVE_LEAGUE = 'SAVE_LEAGUE'

export const saveLeague = (leagueObj: any) => ({
  type: SAVE_LEAGUE,
  payload: leagueObj,
})

export default (state = null, action: any) => {
  switch (action.type) {
    case SAVE_LEAGUE: {
      return action.payload
    }
    default:
      return state
  }
}

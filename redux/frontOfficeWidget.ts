export const SAVE_FRONT_OFFICE = 'SAVE_FRONT_OFFICE'

export const saveFrontOffice = (frontOfficeObj: any) => ({
  type: SAVE_FRONT_OFFICE,
  payload: frontOfficeObj,
})

export default (state = null, action: any) => {
  switch (action.type) {
    case SAVE_FRONT_OFFICE: {
      return action.payload
    }
    default:
      return state
  }
}

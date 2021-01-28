export const ATTACK_EVENT = 'ATTACK_EVENT'
export const KILL_EVENT = 'KILL_EVENT'
export const CLEAR_EVENTS = 'CLEAR_EVENTS'

export enum EventTypes {
  Kill,
  Damage,
}

export const sendAttackEvent = (payload: any) => ({
  type: ATTACK_EVENT,
  payload,
})

export const sendKillEvent = (payload: any) => ({
  type: KILL_EVENT,
  payload,
})

export const clearEvents = () => ({
  type: CLEAR_EVENTS,
})

export default (state = null, action: any) => {
  switch (action.type) {
    case ATTACK_EVENT: {
      return action.payload
    }
    case KILL_EVENT: {
      return action.payload
    }
    case CLEAR_EVENTS: {
      return null
    }
    default:
      return state
  }
}

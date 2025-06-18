import { SET_LOADING } from './actions'

const initialState = {
  loading: false
}

export default function loadingReducer(state = initialState, action: any) {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    default:
      return state
  }
} 
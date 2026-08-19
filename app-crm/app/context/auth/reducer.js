import { SET_USER, SET_CLIENT, SET_COOKIE, LOGOUT } from "./constants";

export const initialState = {
  user: null,
  client: null,
  cookie: null,
  error: null,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        error: null,
      };
    case SET_COOKIE:
      return {
        ...state,
        cookie: action.payload,
        error: null,
      };
    case SET_CLIENT:
      return {
        ...state,
        client: action.payload,
        error: null,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

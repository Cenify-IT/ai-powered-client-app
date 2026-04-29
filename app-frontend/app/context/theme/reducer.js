import { SET_THEME_COLORS } from "./constants";
export const initialState = {
  themeColor: null,
  themeAccentColor: null,
};

export const themeReducer = (state, action) => {
  switch (action.type) {
    case SET_THEME_COLORS:
      return {
        ...state,
        themeColor: action.payload,
      };

    default:
      return state;
  }
};

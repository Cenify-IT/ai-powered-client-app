import { SET_IS_CHAT_OPEN } from "./constants";

export const initialState = {
  isChatOpen: false,
  error: null,
  preliminaryMessageSent: false,
};

export const aiChatReducer = (state, action) => {
  switch (action.type) {
    case SET_IS_CHAT_OPEN:
      return {
        ...state,
        isChatOpen: action.payload,
        error: null,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case SET_PRELIMINARY_MESSAGE_SENT:
      return {
        ...state,
        preliminaryMessageSent: action.payload,
        error: null,
      };
    default:
      return state;
  }
};

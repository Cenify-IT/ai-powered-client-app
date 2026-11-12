import {
  SET_LEADS,
  SET_CHATBOT_CONVERSATIONS,
  SET_WEBSITE_DATA,
  SET_ERROR,
} from "./constants";

export const initialState = {
  websiteData: null,
  chatbotConversations: null,
  leads: null,
  error: null,
};

export const websiteReducer = (state, action) => {
  switch (action.type) {
    case SET_WEBSITE_DATA:
      return {
        ...state,
        websiteData: action.payload,
        error: null,
      };
    case SET_CHATBOT_CONVERSATIONS:
      return {
        ...state,
        chatbotConversations: action.payload,
        error: null,
      };
    case SET_LEADS:
      return {
        ...state,
        leads: action.payload,
        error: null,
      };
    default:
      return state;
  }
};

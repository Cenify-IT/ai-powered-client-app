"use client";
import { useEffect } from "react";
import { createContext, useContext, useReducer } from "react";
import { useRouter } from "next/navigation";
import { websiteReducer, initialState } from "./reducer";
import * as actionTypes from "./constants";
import { getWebsiteDataDispatch } from "./actions"; // loginUser, registerUser, etc.
const WebsiteContext = createContext();

export const WebsiteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(websiteReducer, initialState);

  const getWebsiteData = async (client) => {
    console.log("Fetching website data for client:", client);
    const res = await getWebsiteDataDispatch(client);
    if (res.success) {
      dispatch({
        type: actionTypes.SET_WEBSITE_DATA,
        payload: res.data.websiteData,
      });
      dispatch({
        type: actionTypes.SET_CHATBOT_CONVERSATIONS,
        payload: res.data.chatbotConversationsData,
      });
      dispatch({
        type: actionTypes.SET_LEADS,
        payload: res.data.leadsData,
      });
    } else {
      dispatch({ type: actionTypes.SET_ERROR, payload: res.message });
    }
    return res;
  };

  const refreshWebsiteData = async () => {
    const res = await getWebsiteDataDispatch(state.client);
    console.log(res);
    if (res.success) {
      dispatch({ type: actionTypes.SET_WEBSITE_DATA, payload: res.data });
      dispatch({
        type: actionTypes.SET_CHATBOT_CONVERSATIONS,
        payload: res.data.chatbotConversationsData,
      });
      dispatch({
        type: actionTypes.SET_LEADS,
        payload: res.data.leadsData,
      });
    }
  };

  return (
    <WebsiteContext.Provider
      value={{
        ...state,
        dispatch,
        getWebsiteData,
        refreshWebsiteData,
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => useContext(WebsiteContext);

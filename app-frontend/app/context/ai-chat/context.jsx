"use client";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import { aiChatReducer, initialState } from "./reducer";
import * as actionTypes from "./constants";
import { useRef } from "react";
import { nanoid } from "nanoid"; // or crypto.randomUUID()

import { useChat } from "@ai-sdk/react";

const AIChatContext = createContext();

const convertStrapiRichText = (blocks) => {
  return blocks
    .map((block) => {
      if (block.type === "paragraph") {
        return block.children.map((c) => c.text).join("");
      }
      return "";
    })
    .join("\n");
};

export const AIChatProvider = ({ children, chatbot }) => {
  const [state, dispatch] = useReducer(aiChatReducer, initialState);
  const sessionId = useState(() => nanoid());

  console.log("Initializing AIChatProvider with chatbot:", chatbot);

  const { messages, sendMessage, setMessages } = useChat({
    body: {
      chatbot,
      sessionId,
    },
  });

  useEffect(() => {
    if (!chatbot?.welcomeMessage) return;

    setMessages([
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: convertStrapiRichText(chatbot.welcomeMessage),
          },
        ],
      },
    ]);
  }, [chatbot, setMessages]);

  const openChat = async () => {
    console.log("Opening chat...");
    dispatch({ type: actionTypes.SET_IS_CHAT_OPEN, payload: true });
  };

  const closeChat = async () => {
    console.log("Closing chat...");
    dispatch({ type: actionTypes.SET_IS_CHAT_OPEN, payload: false });
  };

  return (
    <AIChatContext.Provider
      value={{
        ...state,
        dispatch,
        chatbot,
        sendMessage,
        sessionId,
        messages,
        openChat,
        closeChat,
      }}
    >
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = () => {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error("useAIChat must be used within AIChatProvider");
  }
  return context;
};

"use client";
import { useState, useRef, useEffect } from "react";
// import { useChat } from "@ai-sdk/react";

import { FaPaperPlane, FaTimes, FaCommentDots } from "react-icons/fa";
import { useAIChat } from "../../context/ai-chat/context";
import DynamicIcon from "./DynamicIcon";
import RichText from "./RichText";
import { useTheme } from "../../context/theme/context";

export default function ChatBubble({ chatbot }) {
  const { isChatOpen, openChat, closeChat, messages, sendMessage, sessionId } =
    useAIChat();

  const { themeColors } = useTheme();

  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      {/* 1. THE FLOATING BUTTON */}
      {!isChatOpen && (
        <button
          onClick={() => openChat()}
          className={
            `${themeColors.primaryButtonBg} hover:${themeColors.primaryButtonHover} ${themeColors.primaryButtonText} p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center` +
            (chatbot.iconBounce ? " animate-bounce" : "")
          }
        >
          <FaCommentDots size={30} />
        </button>
      )}

      {/* 2. THE CHAT WINDOW */}
      {isChatOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col h-[500px] w-80 md:w-96 overflow-hidden">
          {/* Header */}
          <div
            className={`${themeColors.primaryButtonBg} p-4 flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              {/* <div className="bg-white p-2 rounded-full text-blue-600">
                <FaRobot />
              </div> */}
              <DynamicIcon
                iconName={chatbot.icon.name}
                classNames={chatbot.icon.classNames}
                size={40}
              />
              <div>
                {/* <p className="text-white font-bold text-sm">Cenify IT AI</p> */}
                <RichText content={chatbot.header} />
                <RichText
                  content={chatbot.subheading}
                  className="text-xs text-blue-200"
                />
              </div>
            </div>
            <button
              onClick={() => closeChat()}
              className="text-white hover:text-blue-200"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.length === 0 && (
                <div className="text-center mt-10">
                  {/* <p className="text-slate-400 text-md">Hi, how can we help?</p> */}
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return <span key={index}>{part.text}</span>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}

              {/* 👇 invisible anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <form
            // onSubmit={handleSubmit}
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                // sendMessage({ text: input });
                sendMessage(
                  { text: input },
                  {
                    body: {
                      domain: window.location.hostname,
                      sessionId: sessionId,
                    },
                  },
                );
                setInput("");
              }
            }}
            className="p-4 bg-white border-t flex gap-2"
          >
            <input
              className="flex-1 text-sm outline-none bg-transparent"
              name="prompt"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
            />
            <button
              type="submit"
              className="text-blue-600 hover:scale-110 transition-transform disabled:opacity-50"
              disabled={!input}
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

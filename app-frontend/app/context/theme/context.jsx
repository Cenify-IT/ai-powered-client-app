"use client";
import { createContext, useContext, useReducer } from "react";
import { themeReducer, initialState } from "./reducer";

const ThemeContext = createContext();

export const ThemeProvider = ({ children, initialTheme = {} }) => {
  // Merge the initialState with the initialTheme from server
  const [state, dispatch] = useReducer(themeReducer, {
    ...initialState,
    themeColors: initialTheme,
  });

  const setThemeColors = (payload) => {
    console.log("Setting Theme Colors", payload);
    dispatch({ type: actionTypes.SET_THEME_COLORS, payload });
  };

  return (
    <ThemeContext.Provider
      value={{
        ...state,
        dispatch,
        setThemeColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("Theme must be used within ThemeProvider");
  return context;
};

"use client";
import { useEffect } from "react";
import { createContext, useContext, useReducer } from "react";
import { useRouter } from "next/navigation";
import { authReducer, initialState } from "./reducer";
import * as actionTypes from "./constants";
import {
  loginDispatch,
  logoutDispatch,
  checkUserLoggedInDispatch,
} from "./actions"; // loginUser, registerUser, etc.
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Optional: auto-check login status on mount
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const res = await checkUserLoggedInDispatch();
      console.log("checkUserLoggedIn response:", res);
      console.log(res);
      if (res.success) {
        dispatch({ type: actionTypes.SET_USER, payload: res.user });
        dispatch({ type: actionTypes.SET_CLIENT, payload: res.client });
        dispatch({ type: actionTypes.SET_COOKIE, payload: res.cookie });
        // router.push("/dashboard");
      } else {
        dispatch({ type: actionTypes.SET_ERROR, payload: res.message });
      }
    };

    checkUserLoggedIn(); // call the async function
  }, []);

  const login = async (credentials) => {
    console.log("Logging in with credentials:", credentials);
    const res = await loginDispatch(credentials);
    if (res.success) {
      dispatch({ type: actionTypes.SET_USER, payload: res.user });
      dispatch({ type: actionTypes.SET_CLIENT, payload: res.client });
      dispatch({ type: actionTypes.SET_COOKIE, payload: res.cookie });
    } else {
      dispatch({ type: actionTypes.SET_ERROR, payload: res.message });
    }

    return res;
  };

  const logout = async () => {
    const res = await logoutDispatch();
    if (res.success) {
      dispatch({ type: actionTypes.SET_USER, payload: null });
      dispatch({ type: actionTypes.SET_CLIENT, payload: null });
      dispatch({ type: actionTypes.SET_COOKIE, payload: null });
      router.push("/");
    }
  };

  const refreshUserDetails = async () => {
    const res = await checkUserLoggedInDispatch();
    console.log(res);
    if (res.success) {
      dispatch({ type: actionTypes.SET_USER, payload: res.user });
      dispatch({ type: actionTypes.SET_CLIENT, payload: res.client });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
        login,
        logout,
        refreshUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

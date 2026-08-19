import { NEXT_PUBLIC_FRONTEND_URL } from "../../config";
export const checkUserLoggedInDispatch = async () => {
  try {
    setTimeout(() => {
      console.log("Getting New User Details");
    }, 2000);
    const res = await fetch(`${NEXT_PUBLIC_FRONTEND_URL}/api/user/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies in the request
    });
    console.log("checkUserLoggedInDispatch response:", res);
    const data = await res.json();
    console.log("checkUserLoggedInDispatch data:", data);
    if (data.statusCode === 200) {
      return {
        success: true,
        user: data.user,
        client: data.client,
        message: "User is logged in",
      };
    } else {
      return {
        success: false,
        user: null,
        client: null,
        message: data.message || "User is not logged in",
      };
    }
  } catch (err) {
    return {
      success: false,
      user: null,
      message:
        "Network error... Please try again later." +
        (err.message ? `: ${err.message}` : ""),
    };
  }
};

export const loginDispatch = async ({ email, password }) => {
  console.log("loginDispatch called with:", { email, password });
  try {
    const req = await fetch(`${NEXT_PUBLIC_FRONTEND_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const res = await req.json();
    console.log("loginDispatch response:", res);

    if (res.status === 200) {
      return {
        success: true,
        message: res.message || "Login Successful",
        user: res.user,
        client: res.client,
      };
    } else if (res.status === 400) {
      return {
        success: false,
        message: res.message || "Invalid credentials",
        user: null,
        client: null,
      };
    } else {
      return {
        success: false,
        message: "Something went wrong...",
        user: null,
        client: null,
      };
    }
  } catch (err) {
    return {
      success: false,
      user: null,
      client: null,
      message:
        "Network error... Please try again later." +
        (err.message ? `: ${err.message}` : ""),
    };
  }
};

export const logoutDispatch = async () => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_FRONTEND_URL}/api/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return { success: false, message: "Logout failed" };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: "Network error" + (err.message ? `: ${err.message}` : ""),
    };
  }
};

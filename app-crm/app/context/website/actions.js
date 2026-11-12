import { NEXT_PUBLIC_FRONTEND_URL } from "../../config";

export const getWebsiteDataDispatch = async (client) => {
  try {
    const req = await fetch(`${NEXT_PUBLIC_FRONTEND_URL}/api/website-data`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies in the request
    });
    const res = await req.json();
    console.log("getWebsiteDataDispatch response:", res);

    if (res.statusCode === 200) {
      return {
        success: true,
        data: res,
      };
    } else {
      return {
        success: false,
        data: null,
      };
    }
  } catch (err) {
    return {
      success: false,
      data: null,
    };
  }
};

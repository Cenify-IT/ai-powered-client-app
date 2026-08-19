"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/me",
      handler: "me.getMe",
      config: {
        auth: true,
      },
    },
  ],
};

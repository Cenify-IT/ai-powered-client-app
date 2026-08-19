"use strict";

module.exports = {
  async getMe(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("You must be logged in.");
    }

    const userWithClient = await strapi
      .documents("plugin::users-permissions.user")
      .findOne({
        documentId: user.documentId,
        populate: {
          client: true,
        },
      });

    if (!userWithClient) {
      return ctx.notFound("User not found.");
    }

    ctx.body = userWithClient;
  },
};

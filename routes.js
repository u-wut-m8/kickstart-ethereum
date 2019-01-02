const routes = require("next-routes")();                                //Second set of parentheses to require a function.

routes
  .add("/campaigns/new", "/campaigns/new")
  .add("/campaigns/:address", "/campaigns/show");

module.exports = routes;

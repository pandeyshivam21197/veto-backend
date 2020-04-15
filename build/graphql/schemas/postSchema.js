"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphql = require("graphql");

var postSchema = (0, _graphql.buildSchema)(`
  type Query {
    hello: String
  }
`);
var _default = postSchema;
exports.default = _default;
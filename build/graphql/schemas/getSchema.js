"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphql = require("graphql");

var getSchema = (0, _graphql.buildSchema)(`
  type Query {
    hello: String
  }
`);
var _default = getSchema;
exports.default = _default;
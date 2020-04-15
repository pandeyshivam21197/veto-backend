"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _dotenv = require("dotenv");

var _expressGraphql = _interopRequireDefault(require("express-graphql"));

var _getSchema = _interopRequireDefault(require("./graphql/schemas/getSchema"));

var _postSchema = _interopRequireDefault(require("./graphql/schemas/postSchema"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

// @ts-ignore
var app = (0, _express.default)(); // parse application/x-www-form-urlencoded

app.use(_bodyParser.default.urlencoded({
  extended: false
}));
app.post('/graphql', (0, _expressGraphql.default)({
  schema: _postSchema.default,
  graphiql: false
}));
app.get('/graphql', (0, _expressGraphql.default)({
  schema: _getSchema.default,
  graphiql: true
}));
(0, _dotenv.config)();
var port = Number(process.env['PORT']) || 3000;
var hostname = process.env['HOST'] || 'localhost';
app.listen(port, hostname, function (error) {
  if (error) {
    return console.log(error);
  }

  return console.log(`server is listening on ${port}`);
});
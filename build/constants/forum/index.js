"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _directMessage = require("./directMessage");

Object.keys(_directMessage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _directMessage[key];
    }
  });
});

var _groupMessage = require("./groupMessage");

Object.keys(_groupMessage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _groupMessage[key];
    }
  });
});
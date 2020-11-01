"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require("sequelize");

var _express = require("express");

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import {
//   HTTP_OK,
//   HTTP_CREATED,
//   HTTP_BAD_REQUEST,
//   HTTP_NOT_FOUND
// } from '../../constants/httpStatusCode';
// import { CREATED, REMOVED, UPDATED } from '../../constants/forum'
const {
  sequelize,
  ConnectedUser
} = _models2.default;
/**
 * Connected user class
 */

class ConnectedUserController {
  /**
   *
   * @param {Object} data data
   * @return {Promise} add a connected user
   */
  async add(data) {
    const {
      userName = '',
      avatar = '',
      role = ''
    } = data || {};
    const connectedUser = await ConnectedUser.create({
      userName,
      avatar,
      role
    });
    return connectedUser.get();
  }
  /**
   *
   * @param {Object} data data
   * @return {Promise} add a connected user
   */


  async remove(data) {
    const options = [];
    let where = {};

    if (data) {
      Object.keys(data).forEach(key => {
        if (data[key]) {
          options.push({
            [key]: data[key]
          });
        }
      });
      where = {
        [_sequelize.Op.and]: options
      };
    }

    await ConnectedUser.destroy({
      where
    });
  }

}

exports.default = ConnectedUserController;
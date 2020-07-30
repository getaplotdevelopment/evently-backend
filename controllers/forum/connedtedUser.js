import { Op } from 'sequelize';
import { request, Response } from 'express';
import db from '../../models';
// import {
//   HTTP_OK,
//   HTTP_CREATED,
//   HTTP_BAD_REQUEST,
//   HTTP_NOT_FOUND
// } from '../../constants/httpStatusCode';
// import { CREATED, REMOVED, UPDATED } from '../../constants/forum'
const { sequelize, ConnectedUser } = db;

/**
 * Connected user class
 */
export default class ConnectedUserController {
  /**
   *
   * @param {Object} data data
   * @return {Promise} add a connected user
   */
  async add(data) {
    const { userName = '', avatar = '', role = '' } = data || {};
    const connectedUser = await ConnectedUser.create({
      userName,
      avatar,
      role
    });
    return { ...connectedUser.get() };
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
          options.push({ [key]: data[key] });
        }
      });
      where = { [Op.and]: options };
    }
    await ConnectedUser.destroy({ where });
  }
}

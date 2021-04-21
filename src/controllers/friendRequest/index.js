import models from '../../models/index';
import findOneHelper from '../../helpers/finOneHelper';

const { User, Friend } = models;

/**
 * @FriendController Controller
 * @exports
 * @class
 */
class FriendController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
   */
  async sendFriendRequest(req, res) {
    const { sendTo } = req.body;

    const { id: from } = req.user;

    const user = await findOneHelper(User, { id: sendTo });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (sendTo === from) {
      return res.status(400).json({
        error: 'You cannot send friend request to yourself'
      });
    }

    const alreadySentFriendRequest = await findOneHelper(Friend, {
      sentTo: from,
      from: sendTo
    });

    if (alreadySentFriendRequest) {
      if (alreadySentFriendRequest.dataValues.isFriend === true) {
        return res.status(400).json({
          error: 'You are already friends with this person'
        });
      }
      if (alreadySentFriendRequest.dataValues.sentStatus === 'sent') {
        return res.status(400).json({
          error: 'Friend request has been already sent to you'
        });
      }

      const friendRequest = await Friend.update(
        {
          requestStatus: 'pending',
          sentStatus: 'sent'
        },
        {
          where: { sentTo: from, from: sendTo },
          returning: true,
          plain: true
        }
      );

      return res.status(200).json({
        message: 'success',
        data: friendRequest[1]
      });
    }

    const findFriendRequest = await findOneHelper(Friend, {
      sentTo: sendTo,
      from
    });

    if (findFriendRequest) {
      if (findFriendRequest.dataValues.isFriend === true) {
        return res.status(400).json({
          error: 'You are already friends with this user'
        });
      }
      if (findFriendRequest.dataValues.sentStatus === 'sent') {
        return res.status(400).json({
          error: 'Friend request already sent'
        });
      }

      const updateFriendRequest = await Friend.update(
        {
          requestStatus: 'pending',
          sentStatus: 'sent'
        },
        {
          where: { sentTo: sendTo, from },
          returning: true,
          plain: true
        }
      );
      return res.status(200).json({
        message: 'success',
        data: updateFriendRequest[1]
      });
    }

    const newFriendRequest = await Friend.create({
      sentTo: sendTo,
      from,
      sentStatus: 'sent'
    });

    return res.status(200).json({
      message: 'success',
      data: newFriendRequest
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
   */
  async cancelFriendRequest(req, res) {
    const { sentTo } = req.body;

    const { id: from } = req.user;
    const findFriendRequest = await findOneHelper(Friend, {
      sentTo,
      from,
      sentStatus: 'sent',
      isFriend: false
    });

    if (!findFriendRequest) {
      return res.status(404).json({
        error: 'Friend request not found'
      });
    }

    const cancelFriendRequest = await Friend.update(
      {
        sentStatus: 'canceled'
      },
      {
        where: { sentTo, from },
        returning: true,
        plain: true
      }
    );

    return res.status(200).json({
      message: 'Friend request canceled',
      data: cancelFriendRequest[1]
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
   */
  async acceptingFriendRequest(req, res) {
    const { from } = req.body;

    const { status } = req.query;

    const { id: sentTo } = req.user;

    const user = await findOneHelper(User, { id: from });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const findFriendRequest = await Friend.findOne({
      where: {
        from,
        sentTo,
        sentStatus: 'sent',
        isFriend: false
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: {
            exclude: [
              'password',
              'isActivated',
              'deviceToken',
              'role',
              'redirectUrl',
              'isDeactivated',
              'isApproved',
              'createdAt',
              'updatedAt'
            ]
          }
        },
        {
          model: User,
          as: 'receiver',
          attributes: {
            exclude: [
              'password',
              'isActivated',
              'deviceToken',
              'role',
              'redirectUrl',
              'isDeactivated',
              'isApproved',
              'createdAt',
              'updatedAt'
            ]
          }
        }
      ]
    });

    if (!findFriendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (status === 'reject') {
      const rejectFriend = await Friend.update(
        {
          sentStatus: 'pending',
          requestStatus: 'rejected',
          receivedStatus: true
        },
        {
          where: { from, sentTo, sentStatus: 'sent' },
          returning: true,
          plain: true
        }
      );

      return res.status(200).json({
        message: 'You rejected this friend request',
        data: {
          newFriend: rejectFriend[1],
          from: findFriendRequest.dataValues.sender.dataValues,
          sentTo: findFriendRequest.dataValues.receiver.dataValues
        }
      });
    }

    const newFriend = await Friend.update(
      {
        requestStatus: 'accepted',
        isFriend: true,
        receivedStatus: true
      },
      {
        where: { from, sentTo, sentStatus: 'sent' },
        returning: true,
        plain: true
      }
    );

    const { sender, receiver } = findFriendRequest.dataValues;

    return res.status(200).json({
      message: `You are now friends with ${findFriendRequest.dataValues.sender.dataValues.userName}`,
      data: {
        newFriend: newFriend[1],
        from: sender.dataValues,
        sentTo: receiver.dataValues
      }
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
   */
  async unfriendUser(req, res) {
    const { friend } = req.body;

    const { id: user } = req.user;

    const findReceiver = await findOneHelper(
      Friend,
      {
        sentTo: friend,
        from: user,
        isFriend: true
      },
      [
        {
          model: User,
          as: 'sender',
          attributes: {
            exclude: [
              'password',
              'isActivated',
              'deviceToken',
              'role',
              'redirectUrl',
              'isDeactivated',
              'isApproved',
              'createdAt',
              'updatedAt'
            ]
          }
        },
        {
          model: User,
          as: 'receiver',
          attributes: {
            exclude: [
              'password',
              'isActivated',
              'deviceToken',
              'role',
              'redirectUrl',
              'isDeactivated',
              'isApproved',
              'createdAt',
              'updatedAt'
            ]
          }
        }
      ]
    );

    if (findReceiver) {
      const unFriendReceiver = await Friend.update(
        {
          isFriend: false,
          receivedStatus: false,
          sentStatus: 'pending',
          requestStatus: 'pending'
        },
        {
          where: { sentTo: friend, from: user, isFriend: true },
          returning: true,
          plain: true
        }
      );

      return res.status(200).json({
        message: `You are no longer friends with ${findReceiver.dataValues.receiver.dataValues.userName}`,
        data: unFriendReceiver[1],
        from: findReceiver.dataValues.sender,
        sentTo: findReceiver.dataValues.receiver
      });
    }

    const findSender = await findOneHelper(
      Friend,
      { from: friend, sentTo: user, isFriend: true },
      [
        {
          model: User,
          as: 'sender',
          attributes: {
            exclude: [
              'password',
              'isActivated',
              'deviceToken',
              'role',
              'redirectUrl',
              'isDeactivated',
              'isApproved',
              'createdAt',
              'updatedAt'
            ]
          }
        },
        {
          model: User,
          as: 'receiver',
          attributes: {
            exclude: [
              'password',
              'isActivated',
              'deviceToken',
              'role',
              'redirectUrl',
              'isDeactivated',
              'isApproved',
              'createdAt',
              'updatedAt'
            ]
          }
        }
      ]
    );

    if (findSender) {
      const unFriendSender = await Friend.update(
        {
          isFriend: false,
          receivedStatus: false,
          sentStatus: 'pending',
          requestStatus: 'pending'
        },
        {
          where: { from: friend, sentTo: user, isFriend: true },
          returning: true,
          plain: true
        }
      );

      return res.status(200).json({
        message: `You are no longer friends with ${findSender.dataValues.sender.dataValues.userName}`,
        data: {
          Unfriend: unFriendSender[1],
          from: findSender.dataValues.sender,
          sentTo: findSender.dataValues.receiver
        }
      });
    }

    return res.status(404).json({
      error: 'Friend not found'
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
   */
  async getAllFriends(req, res) {
    const findFriends = await Friend.findAll({
      where: { isFriend: true },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: {
            exclude: [
              'password',
              'isActivated',
              'deviceToken',
              'role',
              'redirectUrl',
              'isDeactivated',
              'isApproved',
              'createdAt',
              'updatedAt'
            ]
          }
        },
        {
          model: User,
          as: 'receiver',
          attributes: {
            exclude: [
              'password',
              'isActivated',
              'deviceToken',
              'role',
              'redirectUrl',
              'isDeactivated',
              'isApproved',
              'createdAt',
              'updatedAt'
            ]
          }
        }
      ]
    });

    const friends = [];

    findFriends.forEach(findFriend => {
      if (
        findFriend.from === req.user.id ||
        findFriend.sentTo === req.user.id
      ) {
        friends.push(findFriend);
      }
    });

    return res.status(200).json({
      message: 'success',
      count: friends.length,
      data: friends
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
   */
  async getSentFriendRequests(req, res) {
    const findFriendRequests = await Friend.findAll({
      where: { from: req.user.id, sentStatus: 'sent' },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: {
            exclude: [
              'password',
              'isActivated',
              'deviceToken',
              'role',
              'redirectUrl',
              'isDeactivated',
              'isApproved',
              'createdAt',
              'updatedAt'
            ]
          }
        },
        {
          model: User,
          as: 'receiver',
          attributes: {
            exclude: [
              'password',
              'isActivated',
              'deviceToken',
              'role',
              'redirectUrl',
              'isDeactivated',
              'isApproved',
              'createdAt',
              'updatedAt'
            ]
          }
        }
      ]
    });

    return res.status(200).json({
      message: 'success',
      count: findFriendRequests.length,
      data: findFriendRequests
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from the db
   * @returns {Object} Response
   */
  async getReceivedFriendRequests(req, res) {
    const findFriendRequests = await Friend.findAll({
      where: { sentTo: req.user.id, sentStatus: 'sent' },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: {
            exclude: [
              'password',
              'isActivated',
              'deviceToken',
              'role',
              'redirectUrl',
              'isDeactivated',
              'isApproved',
              'createdAt',
              'updatedAt'
            ]
          }
        },
        {
          model: User,
          as: 'receiver',
          attributes: {
            exclude: [
              'password',
              'isActivated',
              'deviceToken',
              'role',
              'redirectUrl',
              'isDeactivated',
              'isApproved',
              'createdAt',
              'updatedAt'
            ]
          }
        }
      ]
    });

    return res.status(200).json({
      message: 'success',
      count: findFriendRequests.length,
      data: findFriendRequests
    });
  }
}

export default FriendController;

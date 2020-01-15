import jwt from 'jsonwebtoken'
import 'dotenv/config'
import httpError from '../../helpers/errorsHandler/httpError';
import models from '../../models/index';

const { User } = models;


export default (async (req, res, next) => {
    try {
        const token = req.header('Authorization')
        if (!token) {
            throw new httpError(400, 'Token is required')
        }

        const { email } = jwt.verify(token.split(' ')[1], process.env.jwtSecret)

        const user = await User.findOne({ where: { email } })
        if (!user) {
            throw new httpError(401, 'Provide a valid token')
        }
        next()

    } catch (error) {
        throw new httpError(401, error)

    }

})
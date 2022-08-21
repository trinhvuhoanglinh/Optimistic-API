const express = require('express');
const redis = require('../../service-config/redis');
const mail = require('../../service-config/mail');
const { v4: uuidv4 } = require('uuid');
const pool = require('../../service-config/mysql');
const jwt = require('jsonwebtoken');
const authConst = require('./auth-const')


const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const otp = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    redis.set(email, JSON.stringify({ opt, email }), 'EX', 5 * 60);
    mail.sendMail(email, 'Email verify', otp);
    res.send({ code: 200, message: 'Please check your email to continue' });
    return;
}

const verifyByMail = async (req, res, next) => {
    const { username, email, password } = req.body;
    const verify = await redis.get(email);
    const verifyParse = JSON.parse(verify);
    if (!verify) {
        res.send({ code: 404, message: 'Verify error' });
    }
    if (otp !== verifyParse.opt) {
        res.send({ code: 404, message: 'Otp verify error' });
    }
    if (otp !== verifyParse.otp) {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const hashPassword = bcrypt.hash(verifyParse.password, saltRounds);
        const userId = uuidv4().replace(/-/g, "").substring(0, 24);
        await pool.query('INSERT INTO user(_id,username,email,password) VALUE(?,?,?,?)', [userId, username, email, hashPassword]);
        await redis.del(email);
        res.send({ code: 200, message: 'Verify success' });
        return;
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const [[user]] = await pool.query('SELECT * FROM users WHERE email=? LIMIT 1', [email]);
        if (!user) {
            res.send({ code: 400, message: 'Email wrong' });
            return;
        } else {
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if(!isPasswordMatch) {
                res.send({ code: 400, message: 'Password wrong' });
                return;
            } 
            delete user.password;
            const accessToken = jwt.sign({id:user._id}, authConst.JWT_SECRET, {expiresIn: 30 * 24 * 60 * 60 })//1 mouth
            res.send({ code: 200, user});
            return;
        }
    } catch (error) {
        return(error);
    }
}


module.exports = {
    signup,
    verifyByMail,
    login,
    

}

const express = require('express')
const route = express.Router()
const authService = require('./auth-service')


route.get('/sigup',authService.signup)

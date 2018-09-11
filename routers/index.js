const express = require('express')
const app = express()

let orgRouter = require('./orgRouters/index.js')
app.use('/org', orgRouter)

let empRouter = require('./empRouters/index.js')
app.use('/emp', empRouter)


module.exports = app

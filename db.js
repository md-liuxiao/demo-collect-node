const mongoose = require('mongoose')

const mongoURL = require('./common/index.js').mongoURL
mongoose.connect(mongoURL)

mongoose.connection.on('connected', function () {
  console.log('connect success')
})

mongoose.connection.on('error', function () {
  console.log('connect error')
})

mongoose.connection.on('disconnected', function () {
  console.log('connect disconnected')
})

module.exports = mongoose

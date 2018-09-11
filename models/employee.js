const mongoose = require('../db.js')
const uuid = require('node-uuid')
const Schema = mongoose.Schema

const EmployeeSchema = new Schema({
  _id: {
    type: String
  },
  employeeCode: String,
  employeeName: String,
  gender: String,
  birthDate: Date,
  loginDate: Date,
  phone: String
})

module.exports = mongoose.model('employees', EmployeeSchema)

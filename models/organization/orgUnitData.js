const mongoose = require('../../db.js')

const Schema = mongoose.Schema

const OrgUnitData = new Schema({
  _id: String,
  orgUnitId: String,
  orgUnitName: String,
  parentUnitName: String,
  parentId: String,
  isParent: Boolean,
  superReportingDepartmentId: String
})

module.exports = mongoose.model('orgUnitDatas', OrgUnitData)

const express = require('express')
const uuid = require('node-uuid')
const router = express.Router()
const Employee = require('../../models/employee.js')

let resultData = {}

let getTotal = function (req, res, next) {
  Employee.find({}, function (err, result) {
    resultData.total = result.length
    next()
  })
}

let getData = function (req, res, next) {
  Employee.find({}, function (err, result) {
    resultData.data = result
    res.send(resultData)
  })
}

router.get('/getUserDetail', [getTotal, getData])

router.post('/addUser', function (req, res) {
  req.body._id = uuid.v1()
  let userData = new Employee(req.body)
  userData.save(function (err) {
    if (err) {
      res.send(err)
    } else {
      res.send(true)
    }
  })
})

router.post('/updateUser', function (req, res) {
  let _id = req.body._id
  Employee.find({_id: _id}, function (err, result) {
    let oldData = result[0]
    console.log(result)
    Employee.update(oldData, {$set: req.body}, function (updateErr, updateResult) {
      if (updateResult.n > 0) {
        res.send(true)
      }
    })
  })
})

router.delete('/deleteUser', function (req, res) {
  let idList = req.query.idList.split(',')
  Employee.remove({'_id': {$in: idList}}, function (err, result) {
    res.send(result)
  })
})

module.exports = router

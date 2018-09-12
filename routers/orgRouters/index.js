const express = require('express')
const router = express.Router()
const uuid = require('node-uuid')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient
const mongoURL = require('../../common/index').mongoURL
const OrgUnitData = require('../../models/organization/orgUnitData.js')

// router.use(function (req, res, next) {
//   console.log('中间件返回信息')
//   next()
// })

// router.get('/get', function (req, res) {
//   MongoClient.connect(mongoURL, function (err, db) {
//     db.db('test').collection('feedback').find().toArray(function (err, result) {
//       res.send(result)
//       db.close()
//     })
//   })
// })

// 数据扁平化
let handlerChildren = function (list, arr) {
  list.forEach(item => {
    let orgUnitId = uuid.v1()
    item.orgUnitId = orgUnitId
    arr.push(item)
    delete item.isNew
    if (item.children && item.children.length) {
      item.children.forEach(childItem => {
        let childOrgUnitId = uuid.v1()
        childItem.parentId = item.orgUnitId
        childItem.parentUnitName = item.orgUnitName
        childItem.orgUnitId = childOrgUnitId
      })
      item.isParent = true
      handlerChildren(item.children, arr)
      delete item.children
      delete item.disabled
    }
  })
}

// 获得根组织
router.get('/getRootData', function (req, res) {
  OrgUnitData.find({parentId: '-1'}, function (err, result) {
    res.send(result)
  })
})

let nodeChilds = []

let editIsParent = function (req, res, next) {
  OrgUnitData.find({parentId: req.query.orgUnitId}, function (err, result) {
    nodeChilds = result.length ? result : []
    next()
    // result.forEach((item, index, arr) => {
    //   OrgUnitData.find({parentId: item.orgUnitId}, function (error, findResult) {
    //     console.log('findResult', findResult)
    //     if (index === arr.length - 1) {
    //     }
    //   })
    // })
  })
}

let resultData = function (req, res, next) {
  res.send(nodeChilds)
}

// 懒加载下级组织
router.get('/getChildrenData', [editIsParent, resultData])

// 批量新增组织
router.post('/addNodeList', function (req, res) {
  // OrgUnitData.find({orgUnitId: req.body.parentId}, function (findError, findResult) {
  //   OrgUnitData.update({orgUnitId: findResult[0].orgUnitId}, {$set: {isParent: true}}, function (updateError, updateResult) {
  //     req.body._id = uuid.v1()
  //     req.body.orgUnitId = uuid.v4()
  //     req.body.isParent = false
  //     let treeData = new OrgUnitData(req.body)
  //     treeData.save(function (err, addResult) {
  //       res.send(addResult)
  //     })
  //   })
  // })

  MongoClient.connect(mongoURL, (err, db) => {
    let arr = []
    handlerChildren(req.body, arr)
    
    db.db('test').collection('orgunitdatas').insertMany(arr, function (error, result) {
      req.body.forEach((item, index, list) => {
        db.db('test').collection('orgunitdatas').update({orgUnitId: item.parentId}, {$set: {isParent: true}}, function (updateError, updateResult) {
          if (index === list.length - 1) {
            res.send(result)
            db.close()
          }
        })
      })
    })
  })
})

// 批量删除组织
router.delete('/deleteOrgList', function (req, res) {
  let idList = req.query.deleteIdList.split(',')
  OrgUnitData.remove({'orgUnitId': {$in: idList}}, function (err, result) {
    res.send(result)
  })
})

router.get('/getOrgDetail', function (req, res) {
  OrgUnitData.find({orgUnitId: req.query.orgUnitId}, function (err, result) {
    res.send(result[0])
  })
})

module.exports = router

const express = require('express')
const router = express.Router()
const xlsx = require('node-xlsx')

router.post('/postExport', function (req, res) {
  let datas = [
    ['表头1','表头2','表头2'],
    ['表头1下对应的数据','表头2下对应的数据','表头3下对应的数据']
  ]

  let options = {'!cols': [{wch: 20}, {wch: 10}, {wch: 10}]}
  let buffer = xlsx.build([{name:'Excel', data:datas}])

  res.send(buffer)
})

module.exports = router

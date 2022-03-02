/*
处理文件上传的路由
 */
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
  destination:function(req, file, cb) {
    cb(null, dirPath);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({storage})
const dirPath = path.join(__dirname, '..', 'public/upload')
const uploadSingle = upload.single('image')

module.exports = function fileUpload(router) {
  // 上传图片
  router.post('/manage/img/upload', (req, res) => {
    uploadSingle(req, res, function (err) { //错误处理
      if (err) {
        return res.send({
          status: 1,
          msg: '上传文件失败'
        })
      }
      const file = req.file
      res.send({
        status: 0,
        data: {
          name: file.filename,
          url: 'http://localhost:3000/upload/' + file.filename
        }
      })
    })
  })

  // 删除图片
  router.post('/manage/img/delete', (req, res) => {
    const {name} = req.body
    fs.unlink(path.join(dirPath, name), (err) => {
      if (err) {
        console.log(err)
        res.send({
          status: 1,
          msg: '删除文件失败'
        })
      } else {
        res.send({
          status: 0
        })
      }
    })
  })
}

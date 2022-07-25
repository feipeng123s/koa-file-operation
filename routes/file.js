const router = require('koa-router')()
const fileController = require('../controller/file')

router.get('/file', ctx => {
    ctx.set('Content-Type', 'text/html');
    ctx.status = 200;
    ctx.body = `
    <h2>With <code>"koa"</code> npm package</h2>
    <form action="/file/formidable" enctype="multipart/form-data" method="post">
    <div>Text field title: <input type="text" name="title" /></div>
    <div>File: <input type="file" name="uploadFile" multiple="multiple" /></div>
    <input type="submit" value="Upload" />
    </form>
    `;
})

router.post('/file', fileController.upload)

router.post('/file/formidable', fileController.formidableUpload)

module.exports = router
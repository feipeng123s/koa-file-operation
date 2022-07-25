const fs = require('fs')
const util = require('util')
const stream = require('stream')
const pipeline = util.promisify(stream.pipeline)
const compressing = require('compressing')
const fsExtra = require('fs-extra')

const formidable = require('formidable')
const form = formidable({})

class FileController {
    // 上传一个包含多个utf-8格式文本文件的zip包
    async upload(ctx) {
        const file = ctx.request.files.uploadFile
        const reader = fs.createReadStream(file.filepath, { encoding: 'binary'})        

        // 写入二进制文件(zip)
        const filePath = process.cwd() + '/public/upload'
        if(!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath)
        }

        const fileName = decodeURIComponent(file.originalFilename)
        const writer = fs.createWriteStream(filePath + '/' + fileName, { encoding: 'binary'})
        await pipeline(reader, writer)

        // 解压zip文件
        const unzipPath = filePath + '/' + fileName.substring(0, fileName.length - 4)
        if(!fs.existsSync(unzipPath)) {
            fs.mkdirSync(unzipPath)
        }

        await compressing.zip.uncompress(filePath + '/' + fileName, unzipPath)


        // 读取解压后的文件的文本内容
        const files = fs.readdirSync(unzipPath)
        for(let i = 0; i < files.length; i++) {
            const unzipFile = files[i]
            const fileStat = fs.statSync(unzipPath + '/' + unzipFile)
            if(fileStat.isFile()) {
                const content = fs.readFileSync(unzipPath + '/' + unzipFile, { encoding: 'utf-8' })
                console.log(content)
            }
        }

        // 删除zip文件和解压后的文件
        fs.unlink(filePath + '/' + fileName, (err) => {
            if(err) {
                console.log(err)
            }
        })

        fsExtra.remove(unzipPath, (err) => {
            if(err) {
                console.log(err)
            }
        })

        ctx.status = 200
    }

    // 上传一个utf-8格式的文本文件
    async formidableUpload(ctx) {
        // 使用formidable时，请在app.js中去掉koa-body的use
        await new Promise((resolve, reject) => {
            form.parse(ctx.req, async (err, fields, files) => {
                if(err) {
                    reject(err)
                    return
                }

                const file = files.uploadFile
                const reader = fs.createReadStream(file.filepath, { encoding: 'utf-8'})

                // 读取文件内容
                let str = ''
                for await(const chunk of reader) {
                    str += chunk
                }
                console.log(str)

                ctx.status = 200
                resolve()
            })
        })
    }

    async download(ctx) {
        const filePath = ''
        ctx.body = fs.createReadStream(filePath)
        ctx.status = 200
    }
}

module.exports = new FileController()
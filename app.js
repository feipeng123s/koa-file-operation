const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const koaBody = require('koa-body')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const file = require('./routes/file')

// error handler
onerror(app)

// middlewares
// koa-body比koa-bodyparser多支持一个multipart/*类型的请求
app.use(koaBody({
  multipart: true,
  jsonLimit: '10mb',
  formidable: {
    maxFileSize: 100 * 1024 * 1024
  }
}))
// 格式化response body的中间件ß
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(file.routes(), file.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

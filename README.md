## 文件上传

### 使用koa-body实现文件上传

- 使用 `koa-body`来获取文件上传流
- [通过异步迭代简化 Node.js流](https://tie.pub/2019/11/nodejs-streams-async-iteration/)，实现流的读写
- 使用 `compressing`解压zip文件，并读取解压后的文件内容
- 读取完成后删除文件和目录

koa-body也是通过引用 `formidable`库来实现文件上传的

### 使用formidable实现文件上传

通过formidable拿到上传的文件之后，使用一步迭代的方式读取文件内容

注意：在使用formidable时请去掉对koa-body中间件的use


## 文件下载

```
ctx.body = fs.createReadStream(filePath)
ctx.status = 200
```

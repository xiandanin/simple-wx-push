const Koa = require('koa')
const path = require('path')
const Router = require('koa-router')
const render = require('koa-ejs')
const wxpush = require('./wxpush')
const app = new Koa()
const router = new Router()
app.use(require('koa-bodyparser')())
render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'detail',
    viewExt: 'html',
    cache: false,
    debug: false
})

router.all('/push', async (ctx) => {
    const params = ctx.method === 'POST' ? ctx.request.body : ctx.query
    const title = params.title || "消息提醒"
    if (params.message) {
        ctx.body = await wxpush.pushMessage(title, params.message, params.url)
    } else {
        ctx.body = {errcode: 400, errmsg: "内容不能为空"}
    }
})

router.get('/detail', async (ctx) => {
    ctx.state.detail = {
        title: ctx.query.title,
        time: ctx.query.time,
        message: ctx.query.message.replace(new RegExp(/\\n/g), "<br/>")
    }
    await ctx.render('detail')
})

app.use(router.routes()).use(router.allowedMethods())

const port = parseInt(process.env.PORT || 9401)
const server = app.listen(port, function () {
    let host = server.address().address
    console.info("启动成功，访问地址为 http://%s:%s", host === '::' ? "localhost" : host, port)
})

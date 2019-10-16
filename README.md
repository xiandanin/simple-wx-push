## 配置
[注册测试号](https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index)

增加消息模板`{{message.DATA}}`

<img src="screenshot.jpg" width="300"/>

根目录创建文件`config_custom.js`，也可以直接修改`config.js`

```
module.exports = {
    logger: false,
    app_id: "[AppID]",
    app_secret: "[AppSecret]",
    recipient: "[收件人微信ID]",
    template_id: "[发送模板ID]"
}
```

## 启动
### Node启动

```
node api.js
```

### PM2启动

```
pm2 start api.js --name wx_push
```

## API
POST | GET

```
/push
```
| 参数名 | 是否必选 |
|:-:|:-:|
| title | 否 |
| url | 否 |
| message | 是 |

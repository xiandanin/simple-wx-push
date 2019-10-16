let config
try {
    config = require('./config_custom.js')
} catch (e) {
    config = require('./config.js')
}
const moment = require('moment-timezone')
const util = require('util')
const got = require('got')

let cacheTime = 0
let cacheAccessToken = null

/**
 * 缓存AccessToken
 * @returns {Promise<void>}
 */
async function updateAccessToken () {
    const url = util.format('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s', config.app_id, config.app_secret)
    const rsp = await got(url)
    console.info(formatNow(), "请求AccessToken", rsp.body)
    return JSON.parse(rsp.body).access_token

}

async function obtainAccessToken () {
    //如果没有token或者距离上次缓存已经超过1个半小时 就刷新缓存
    if (cacheAccessToken || Date.now() - cacheTime > 1.5 * 60 * 60 * 1000) {
        cacheAccessToken = await updateAccessToken()
        cacheTime = Date.now()
    }
    return cacheAccessToken
}

async function pushMessage (title, message, redirectUrl) {
    const touser = config.recipient
    const templateID = config.template_id

    const accessToken = await obtainAccessToken()
    const url = util.format('https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=%s', accessToken)
    const now = formatNow()
    //const redirectUrl = util.format('%s/detail?title=%s&time=%s&message=%s', origin, title, now, message)
    const body = JSON.stringify({
        touser: touser,
        template_id: templateID,
        url: redirectUrl,
        data: {
            title: {
                value: title
            },
            message: {
                value: message
            },
            time: {
                value: now
            }
        }
    })
    console.debug(now, "发送消息", body)
    const rsp = await got(url, {body: body})
    if (JSON.parse(rsp.body).errcode === 0) {
        console.info(now, "发送消息成功", rsp.body)
    }
    return rsp.body
}

function formatNow () {
    return moment().tz("Asia/Shanghai").format('YYYY-MM-DD HH:mm:ss')
}

module.exports = {pushMessage}

import { Toast } from 'vant';
import store from '../store'
(process.env.NODE_ENV === "development") && require('../mock');
var fly = require("flyio");
var cryptoBase64 = require("crypto-js/enc-base64");
var cryptoHex = require("crypto-js/enc-hex");
var cryptoUtf8 = require("crypto-js/enc-utf8");
var cryptoMD5 = require("crypto-js/hmac-md5");

fly.config.baseURL = process.env.BASE_URL;
fly.config.headers = { 'Content-Type': 'application/json' }
var time=0;
//添加请求拦截器
fly.interceptors.request.use((request) => {
    if(time==0){
        Toast.loading({
            duration: 0,       // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: 'spinner',
            message: '加载中'
          });
    }
    time++;
    request.headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "source": "sctelapp"
    }
    if (request.url.indexOf("/auth") == -1) {
        // console.log(request.url)
        // console.log(store.state.userId)
        // console.log(store.state.timediff)
        //给所有请求添加自定义header
        let userId = store.state.userId
        let timestamp = new Date().getTime();
        let timediff = store.state.timediff
        timestamp = Number(timestamp) + Number(timediff)
        request.body = request.body || {}
        request.body.userId = userId
        let e = JSON.stringify(request.body)
        let sign = cryptoBase64.stringify(cryptoUtf8.parse(e))
        let AuthorizationCode = cryptoMD5(e, String(timestamp)).toString(cryptoHex)
        request.body = { sign: sign, timestamp: timestamp }
        request.headers["AuthorizationCode"] = AuthorizationCode
    }
    return request;
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
    (response) => {
        time--;
        if(time==0){
            Toast.clear();
        }
        
        //只将请求结果的data字段返回
        if (typeof (response.data) == "string") {
            response.data = JSON.parse(response.data);
        }
        return response.data;
    },
    (err) => {
        Toast.clear();
        //发生网络错误后会走到这里
        Toast.fail({
            duration: 3000, // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            message: "请求出错了，联系管理员！"
        });
        //return Promise.resolve("ssss")
    }
)
export default fly;
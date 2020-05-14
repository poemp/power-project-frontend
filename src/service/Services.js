/**
 * 类名 : 服务请求封装
 */

import axios from 'axios'
import { Message } from '@alifd/next';

const http = {
    post: '',
    get: ''
};
// 创建axios实例
const Axios = axios.create({
    baseURL: 'https://www.xx.com/v1/',
    timeout: 30000,
    headers: {
        'content-type': 'application/json',
    }
})  ;


/**
 * 请求拦截器
 * request 拦截器
 */
Axios.interceptors.request.use(
    (config) => {
        const xtoken = sessionStorage.getItem("Authorization");
        if (!xtoken){
            console.warn("token 为空. 没有登录 .");
        }
        if (xtoken){
            config.headers['Authorization'] = xtoken;
        }
        if (config.method === 'post') {
            config.data = {
                ...config.data,
                timestamp: new Date().getTime()
            }
        } else if (config.method === 'get') {
            config.params = {
                timestamp: new Date().getTime(),
                ...config.params
            }
        }
        return config
    }, function (error) {
        console.error(error);
        return Promise.reject(error)
    }
);

/**
 * http请求拦截器
 * response 拦截器
 */
Axios.interceptors.response.use(function (response) {
    //服务器错误
    if (response.status !== 200){
        Message.error('服务端错误， 请找寻管理员.');
        console.error("服务端错误， 请找寻管理员.");
    }
    const data = response.data;
    //拦截器， 登录拦截返回的信息
    if (data.code === 402){
        Message.error(data.message);
        console.warn(data.message)
    }
    return response
}, function (error) {
    return Promise.reject(error.response.data)
});


http.post = (url,data) => {
    let params = data;
    let listPormise = new Promise((resolve, reject) => {
        Axios.post(url, params).then((res) => {
            resolve(res);
        }).catch(res => {
            reject(res)
        })
    });
    return listPormise;
};

http.get = (url, data) => {
    let params = data;
    let listPormise = new Promise((resolve, reject) => {
        Axios.get(url, params).then((res) => {
            resolve(res);
        }).catch(res => {
            reject(res)
        })
    });
    return listPormise
};

export default http

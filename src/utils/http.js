import axios from "axios"
import NProgress from "nprogress"
import { getToken } from "./token"

import "nprogress/nprogress.css"
import { history } from "./history"
//封装axios 
const http = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
})

// Add a request interceptor
http.interceptors.request.use(function (config) {
  // Do something before request is sent
  NProgress.start()
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function (error) {
  // Do something with request error

  return Promise.reject(error)
})

// Add a response interceptor
http.interceptors.response.use(function (response) {
  NProgress.done()
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data
}, function (error) {
  NProgress.done()
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // console.dir(error)
  if (error.response.status === 401) {
    //跳回登陆
    history.push('/login')
  }
  return Promise.reject(error)
})

export { http }

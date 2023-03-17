import axios from "axios"
import { getToken } from "./token"
// import { nprogress } from "nprogress"

// import "nprogress/nprogress.css"
//封装axios 
const http = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
})

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent

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
axios.interceptors.response.use(function (response) {
  // nprogress.start()
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data
}, function (error) {
  // nprogress.done()
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})

export { http }
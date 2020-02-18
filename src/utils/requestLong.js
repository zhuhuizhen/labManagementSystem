import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const serviceLong = axios.create({
  baseURL: 'http://10.1.4.87:8081', // url = base url + request url
  // http://33.64.67.130:97 生产
  // http://119.23.213.192:8010 阿里云
  // http://10.1.101.84:8081大增
  // http://10.1.4.119:8081付秀
  // http://10.1.4.87:8081陈帅
  // http://10.1.4.92:8081徐艳辉
  // http://10.1.4.86:8081杨旭
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 90000 // request timeout
})

// request interceptor
serviceLong.interceptors.request.use(
  config => {
    // do something before request is sent
    if (!store.getters.token) {
      config.headers.Authorization = 'none'
    } else {
      config.headers.Authorization = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
serviceLong.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 0) {
    //   Message({
    //     message: res.msg || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //   // to re-login
    //   MessageBox.confirm('你已经退出了，你可以取消留在该页面，或者重新登录', '确认退出', {
    //     confirmButtonText: '重新登录',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     store.dispatch('user/resetToken').then(() => {
    //       location.reload()
    //     })
    //   })
    // }
    //   return Promise.reject(new Error(res.msg || 'Error'))
    // } else {
    //   // Message({
    //   //   message: "登录成功",
    //   //   type: 'success',
    //   //   duration: 5 * 1000
    //   // })
    //   return res
    // }
    return res
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default serviceLong

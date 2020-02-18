import axios from 'axios'
// import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'

// const baseURL =

// create an axios instance
const service = axios.create({
  baseURL:
  'http://119.23.213.192:8010', // url = base url + request url
  // http://33.64.67.130:97 生产
  // http://119.23.213.192:8010 阿里云
  // http://10.1.4.7:8081大增有限
  // http://10.1.101.126:8081大增无线
  // http://10.1.4.119:8081付秀
  // http://10.1.4.87:8081陈帅
  // http://10.1.4.92:8081徐艳辉
  // http://10.1.4.86:8081杨旭
  // withCredentials: true, // send cookies when cross-donmain requests
  timeout: 20000 // request timeout
})
// request interceptor
service.interceptors.request.use(
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
service.interceptors.response.use(
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
    // debugger
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
    if (res.code === 10003) { // 过期处理
      store.state.user.token = null
      store.dispatch('tagsView/delAllVisitedViews', '')
      store.dispatch('user/logout')
      router.push(`/login`)
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service

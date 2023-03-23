import { getToken, http, setToken, removeToken } from "@/utils"
import { makeAutoObservable } from "mobx"

class LoginStore {
  token = getToken() || ''
  constructor() {
    //响应式 
    makeAutoObservable(this)
  }
  getToken = async ({ mobile, code }) => {
    //调用登录接口 存入token
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile, code
    })
    this.token = res.data.token
    // 存入ls
    // console.log(res.data)
    setToken(this.token)
  }
  loginOut () {
    this.token = ''
    removeToken()
  }
}
export { LoginStore }
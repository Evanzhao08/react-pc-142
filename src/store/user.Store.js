import { makeAutoObservable } from "mobx"
import { http } from '@/utils'
class UserStore {
  useInfo = {}
  constructor() {
    makeAutoObservable(this)
  }
  getUserInfo = async () => {
    //调用接口获取数据
    const res = await http.get('/user/profile')
    this.useInfo = res.data
  }
}

export { UserStore } 
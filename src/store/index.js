import React from "react"

import { LoginStore } from "./login.Store"
class RootStore {
  constructor() {
    /** 
  * 对子模块进行实例化操作
  * 将来实例化根store的时候
  * 根store有两个属性 分别是countStore和listStore 
  * 各自对应的值 就是我们导入的子模块实例对象
  */
    this.loginStore = new LoginStore()
    // ...
  }
}

//实例化操作
const rootStore = new RootStore()
/* 
* 使用react conntext机制 完成统一方法封装
* Provider value={传递的数据}
* 查找机制：useContext优先从 Provider value 找 如果找不到
* createContext方法传递过来的默认参数
 */
const context = React.createContext(rootStore)
// 这个方法作用：通过useContext拿到rootStore实例对象 后返回
const useStore = () => React.useContext(context)

export { useStore }
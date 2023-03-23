
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from "react-router-dom"
import Layout from "./views/Layout"
import Login from "@/views/Login"
import { AuthComponent } from "@/components/AuthComponent"
import '@/App.css'
import Home from "./views/Home"
import Article from "./views/Article"
import Publish from "./views/Publish"
import { history } from "./utils/history"

function App () {
  return (
    //路由配置
    <HistoryRouter history={history}>
      <div className="App">
        <Routes>
          {/* 创建路由path和组件对应关系  */}
          <Route path="/" element={<AuthComponent><Layout /></AuthComponent>}>
            <Route index element={<Home />}></Route>
            <Route path="/article" element={<Article />}></Route>
            <Route path="/publish" element={<Publish />}></Route>
          </Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </div>
    </HistoryRouter>

  )
}

export default App

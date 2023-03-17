import { Card, Form, Input, Checkbox, Button, message } from "antd"
import logo from '@/assets/logo.png'
import './index.scss'
import { useStore } from "@/store"
import { useNavigate } from "react-router-dom"

function Login () {
  const { loginStore } = useStore()
  const navigate = useNavigate()
  const onFinish = async (values) => {
    // console.log('Success:', values)
    const { mobile, code } = values
    try {
      await loginStore.getToken({ mobile, code })
      //跳转首页
      navigate('/', { replace: true })
      message.success('登录成功')
    } catch (error) {
      message.error(error.response?.data?.message || '请求失败!')
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <div className="login" >
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/**登录表单 */}
        <Form
          validateTrigger={['onBlur', 'onChange']}
          initialValues={{
            remember: true,
            password: '123456'
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="mobile"
            rules={[
              {
                pattern: /^(?:(?:\+|00)86)?1\d{10}$/,
                message: '请输入正确手机号',
                validateTrigger: 'onBlur'
              },
              {
                required: true,
                message: '请输入手机号',
              },
            ]}
          >
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            name="code"
            rules={[
              {
                required: true,
                message: '请输入验证码',
              },
              {
                len: 6,
                message: '请输入6位密码',
                validateTrigger: 'onBlur'
              }
            ]}>
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox className="login-checkbox-label">我已阅读并同意「用户协议」和「隐私条款」</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div >
  )
}

export default Login

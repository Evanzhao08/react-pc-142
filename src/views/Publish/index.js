
import { useEffect, useRef, useState } from 'react'
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import NewEditor from '@/components/NewEditor'
import { useStore } from '@/store'
import './index.scss'
import { observer } from 'mobx-react-lite'
import { http } from '@/utils'

const { Option } = Select

const Publish = () => {
  const [content, setContent] = useState("")
  const { channelStore } = useStore()
  const [fileList, setFileList] = useState([])
  const cacheImgList = useRef()
  const navigate = useNavigate()
  const onUploadChange = ({ fileList }) => {
    //使用useRef声明一个暂存仓库
    console.log(fileList)
    // 采取受控的写法：在最后一次log里response
    const formatList = fileList.map(file => {
      //上传完毕 做数据处理
      if (file.response) {
        return {
          url: file.response.data.url
        }
      }
      //上传中,不做处理
      return file
    })
    setFileList(formatList)
    //同时把图片列表存入仓库一份
    cacheImgList.current = fileList

  }


  //切换图片 
  const [imgCount, setImgCount] = useState(1)
  const radioChange = (e) => {
    const rawValue = e.target.value
    console.log()
    setImgCount(rawValue)
    // 从仓库里取对应的图片数量 交给用来渲染的fileList
    if (rawValue === 1) {
      setFileList([cacheImgList.current ? cacheImgList.current[0] : []])
    } else if (rawValue === 3) {
      setFileList(cacheImgList.current ? cacheImgList.current : [])
    }
  }

  //提交表单
  const onFinish = async (values) => {
    const { channel_id, title, type } = values
    console.log(fileList)
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        images: fileList.map(item => item.url)
      }
    }
    if (content === "" || content.trim() === "<p></p>") {
      message.error("文本内容不能为空")
    } else {
      if (id) {
        await http.put(`/mp/articles/${id}?draft=false`, params)
      } else {
        await http.post(`/mp/articles?draft=false`, params)
      }

      //跳转列表 
      navigate('/article')
      message.success(`${id ? '更新成功' : '发布成功'}`)
    }
  }

  const [params] = useSearchParams()
  const id = params.get('id')
  // console.log('route', id)
  // const breadTitle = (id ? '编辑' : '发布').concat('文章')
  const form = useRef(null)
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${id}`)
      form.current.setFieldsValue({ ...res.data, type: res.data.cover.type })

      //设置content 文本回显
      setContent(res.data.content)
      const formatImgList = res.data.cover.images.map(url => ({ url }))
      setFileList(formatImgList)
      cacheImgList.current = formatImgList
    }
    if (id) {
      loadDetail()
      console.log(form.current)
    }
  }, [id])


  return (
    <div className="publish">
      <Card
        title={
          < Breadcrumb separator=">"
            items={[
              {
                title: <Link to="/home">首页</Link>,
              },
              {
                title: `${id ? '编辑' : '发布'}文章`
              }
            ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content: '' }}
          onFinish={onFinish}
          ref={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {
                channelStore.channelList.map(({ id, name }) => <Option value={id} key={id}>{name}</Option>)
              }
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imgCount > 0 && (<Upload
              name="image"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList
              action="http://geek.itheima.net/v1_0/upload"
              fileList={fileList}
              onChange={onUploadChange}
              multiple={imgCount > 1}
            >
              <div style={{ marginTop: 8 }}>
                <PlusOutlined />
              </div>
            </Upload>)
            }

          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
          >
            <NewEditor
              getContent={(value) => {
                setContent(value)
              }}
              content={content}
            ></NewEditor>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div >
  )
}

export default observer(Publish)
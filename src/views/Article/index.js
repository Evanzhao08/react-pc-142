import { Link, useNavigate } from 'react-router-dom'
import { observer } from "mobx-react-lite"
import { message, Popconfirm, Table, Tag, Space, Card, Breadcrumb, Form, Button, Radio, DatePicker, Select } from 'antd'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import './index.scss'
import { useEffect, useState } from 'react'
import { http } from '@/utils'
import { useStore } from '@/store'


const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const { channelStore } = useStore()

  //文章列表管理
  const [articleData, setList] = useState({
    list: [], //文章列表
    count: 0  //文章数量
  })
  //文章参数管理 
  const [params, setParams] = useState({
    page: 1,
    per_page: 5
  })


  //如果 异步请求函数要依赖一些数据的变化而重新执行
  //推荐写到内部
  useEffect(() => {
    const loadList = async () => {
      const res = await http.get('/mp/articles', { params })
      // const res = await http.get('http://localhost:5000/articles1', { params })
      const { results, total_count } = res.data
      setList({
        list: results,
        count: total_count
      })
    }
    loadList()
  }, [params])

  const onFinish = (values) => {
    // console.log('values', values)
    const { channel_id, date, status } = values
    console.log(channel_id, date, status)
    //数据处理
    let _params = {}
    if (status !== -1) {
      _params.status = status
    }
    if (channel_id) {
      _params.channel_id = channel_id
    }
    if (date) {
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    //修改params数据 引起接口的重新发送 对象的合并是一个整体覆盖
    setParams({ ...params, ..._params })
  }
  const pageChange = (page) => {
    setParams({
      ...params,
      page
    })
  }

  //删除
  const delArticle = (data) => {
    http.delete(`/mp/articles/${data.id}`).then(res => {
      if (res.status === 200) {
        //刷新列表
        setParams({
          ...params,
          page: 1
        })
        message.success('删除成功')
      }
    })
  }

  const navigate = useNavigate()
  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`)
  }



  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => <Tag color="green">审核通过</Tag>
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => goPublish(data)}
            />
            <Popconfirm
              title="删除任务"
              description="你确定要删除此项?"
              onConfirm={() => delArticle(data)}
              // onCancel={cancel}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              // onClick={() => delArticle(data)}
              />
            </Popconfirm>

          </Space>
        )
      }
    }
  ]


  return (
    <div>
      {/* 筛选区域 */}
      <Card
        title={
          < Breadcrumb separator=">"
            items={[
              {
                title: <Link to="/home">首页</Link>,
              },
              {
                title: '内容管理',
              },
            ]}
          />
        }
        style={{ marginBottom: 20 }}
      >
        <Form
          onFinish={onFinish}
          initialValues={{ status: null }}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={undefined}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
            >
              {
                channelStore.channelList.map((channel) => <Option value={channel.id} key={channel.id}>{channel.name}</Option>)
              }
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 文章列表区域 */}
      <Card title={`根据筛选条件共查询到 ${articleData.count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={articleData.list}
          pagination={{
            pageSize: params.per_page,
            total: articleData.count,
            onChange: pageChange
          }}
        />
      </Card>
    </div >
  )
}

export default observer(Article)
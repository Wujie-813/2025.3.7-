
import React, { useEffect, useState } from 'react'
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { Pagination } from 'antd';
import axios from 'axios';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input,Modal,message} from 'antd';
import {  ConfigProvider, Flex } from 'antd';
import { useResponsive } from 'antd-style';
import { Select} from 'antd';
function Index() {
  // 数据
  const  [usedata,setusedata]=useState([])
  // 搜索
  const [name,setname]=useState('')
  const [age,setage]=useState('')
  const [gongzuo,setgongzuo]=useState('')
  // 新增
  const [title,settitle]=useState('')
  // 编辑
  const [useemit,setuseemit]=useState(null)

  // 数据请求函数
  const datay=async()=>{
    const res=await axios.get('http://localhost:7788/wujie',{params:{name:name,age:age,gongzuo:gongzuo}})
    setusedata(res.data)
  }

  // from表单
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    let {name,age,gongzuo}=values
    setname(name)
    setage(age)
    setgongzuo(gongzuo)
    console.log('Success:', values);
  };
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  useEffect(()=>{
    datay()
  },[name,age,gongzuo])


  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  // 类型定义
  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };

  interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }


// 表单头部
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '性别',
      dataIndex: 'xingbie',
      key: 'xingbie',
    },
    {
      title: '工作单位',
      dataIndex: 'gongzuo',
      key: 'gongzuo',
    },
    {
      title: '是否单身',
      dataIndex: 'danshen',
      key: 'danshen',
    },
    
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">

        <Button color="red" variant="solid" onClick={()=>del(record.id)}>
         删除
        </Button>
           
        <Button color="orange" variant="solid" onClick={()=>emit(record)}>
          编辑
        </Button>

        </Space>
      ),
    },
  ];



// 新增
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [useForm]=Form.useForm()
  const showModal = () => {
    setIsModalOpen(true);
    settitle('新增信息')
  };
  const handleOk = () => {
    setIsModalOpen(false);
    useForm.submit()
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };


// 编辑
  const emit=(record)=>{
    settitle('编辑信息')
    setuseemit(record)
    setIsModalOpen(true);
    useForm.setFieldsValue(record);
    
  }

  // 新增和编辑
  const finish=(values)=>{
    if(title==='新增信息'){
      axios.post('http://localhost:7788/wujie',values).then((res)=>{
        console.log(res);
              datay()
    })
  }
  else
  {
    axios.put(`http://localhost:7788/wujie/${useemit.id}`,values).then((res)=>{
      console.log('emit',res);
      datay()
    })
  }
}

// 删除
const del=(val)=>{
  axios.delete(`http://localhost:7788/wujie/${val}`).then((res)=>{
    console.log(res)
    datay()
    message.success('删除');
  })  
}
  
  return (
    <div>
      {/* 头部搜索 */}
        <Form
        layout="inline"
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 1200 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
          <Button color="green" variant="solid"  type="primary" onClick={showModal}>
           新增
          </Button>

          <Form.Item<FieldType>
            label="姓名"
            name="name"
          >
            <Input />
          </Form.Item>
          
          <Form.Item<FieldType>
            label="年龄"
            name="age" 
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="工作单位"
            name="gongzuo" 
          >
             <Select
              defaultValue="请选择工作单位"
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: '前端开发工程师', label: '前端开发工程师' },
                { value: '后端开发工程师', label: '后端开发工程师' },
                { value: '超市收银员', label: '超市收银员' },
                { value: '化妆师', label: '化妆师'},
              ]}
              />
          </Form.Item>
         

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
      </Form>

        {/* 分页和数据 */}
      <Table<DataType> columns={columns} dataSource={usedata} pagination={{
         total:usedata.length,
         showSizeChanger:true,
         showQuickJumper:true,
         showTotal:(total) => `Total ${total} items`
      }} />


      {/* 模态框 */}
      <Modal title={title}  open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <Form form={useForm} onFinish={finish} setIsModalOpen={setIsModalOpen}>
              <Form.Item<FieldType>
                label="iD"
                name="id"
                rules={[{ required: true, message: '请输入您要增加的ID' }]}
                >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="年龄"
                name="age"
                rules={[{ required: true, message: '请输入您要增加的年龄' }]}
                >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="姓名"
                name="name"
                rules={[{ required: true, message: '请输入您要增加的姓名' }]}
                >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="工作单位"
                name="gongzuo"
                rules={[{ required: true, message: '请输入您要增加的工作单位' }]}
                >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="性别"
                name="xingbie"
                rules={[{ required: true, message: '请输入您要增加的性别' }]}
                >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="婚姻状态"
                name="danshen"                
                rules={[{ required: true, message: '请输入您要增加的婚姻状态' }]}
                >
                <Input />
              </Form.Item>

          </Form>
      </Modal>
     
    </div>
  )
}

export default Index

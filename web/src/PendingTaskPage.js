import React, {Component} from "react";
import {Button, Dropdown, Form, Input, Layout, Menu, Modal, Pagination, Space, Spin, Table, Tag, message} from "antd";
import {DownOutlined, PlusCircleOutlined} from "@ant-design/icons";
import * as ProjectBackend from "./backend/ProjectBackend";
import ChangeTags from "./ChangeTags";
import "./PendingTaskPage.less";

const {Header, Footer, Content} = Layout;
const {Search, TextArea} = Input;

export default class PeddingTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      data: [],
      tableHeight: 0,
      loadingState: false,
      isCreateProjectVisible: false,
      createLoading: false,
      form: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: [5, 10, 15, 20],
        showSizeChanger: true,
        total: 50,
      },
      createForm: {
        name: "",
        grade_range: [],
        subjects: [],
        description: "",
        requirement: "",
        summary: "",
        target: "",
      },
    };
  }

  createFormRef = React.createRef()

  columns = [
    {
      title: "项目名称",
      key: "name",
      align: "center",
      width: 210,
      render: (text, record) => (
        <span key={1}>{record.basic_info.name}</span>
      ),
    },
    {
      title: "学科",
      key: "subject",
      dataIndex: "subject",
      align: "center",
      width: 210,
      render: (text, record) => (
        <>
          {
            record.basic_info.subjects.map((item, index) => (
              <Tag key={index} color="green">
                {
                  item
                }
              </Tag>
            ))
          }
        </>
      ),
    },
    {
      title: "学段",
      key: "period",
      align: "center",
      render: (text, record) => (
        <>
          {
            record.basic_info.grade_range.map((item, index) => (
              <Tag key={index} color="green">
                {
                  item
                }
              </Tag>
            ))
          }
        </>
      ),
    },
    {
      title: "试卷",
      key: "paper",
      align: "center",
      width: 142,
      render: record => (
        <span>0</span>
      ),
    },
    {
      title: "试题",
      key: "questions",
      align: "center",
      width: 121,
      render: record => (
        <span>0</span>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "created_time",
      key: "create-time",
      align: "center",
      width: 342,
      render: (text, record) => (
        <span>{this.dateFilter(record.created_time)}</span>
      ),
    },
    {
      title: "操作",
      key: "title",
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={this.seekProjectManagement.bind(this, record)}>访问项目</Button>
          <Button type="link" danger>删除</Button>
        </Space>
      ),
    },
  ]
  pendingTaskMenu = () => {
    return (
      <Menu>
        <Menu.Item key="1">任务1</Menu.Item>
        <Menu.Item key="2">任务2</Menu.Item>
        <Menu.Item disabled key="3">任务3</Menu.Item>
        <Menu.Item key="4">任务4</Menu.Item>
      </Menu>
    );
  }
  componentDidMount = () => {
    this.getProjectList(this.state.classes.account);
  }
  seekProjectManagement = (state) => {
    let project_id = state.project_id.split("/").join("_");
    this.props.history.push(`/project-management/${project_id}/${state.role}`);
  }

  dateFilter(time) {
    let date = new Date(time);
    return `${date.getFullYear()}-${date.getMonth().toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  }

  getProjectList = (account) => {
    ProjectBackend.GetUserAssignments(account.id).then(res => {
      let resData = res.data ? res.data : [];
      let id_list = resData.map(item => item.project_id);
      let obj = {};
      resData.forEach(e => {
        obj[e.project_id] = e;
      });
      ProjectBackend.GetProjectList(id_list).then(res => {
        let data = Object.values(res.data);
        data = data.map((item, index) => {
          item.role = obj[item.owner + "/" + item.name].role;
          item.project_id = obj[item.owner + "/" + item.name].project_id;
          item.key = index.toString();
          return item;
        });
        this.setState({
          data,
          loadingState: false,
        });
      }).catch(err => {
        message.error(err || "请求错误！");
      }).catch(err => {
        message.error(err || "请求错误！");
      });
    });
  }

  render() {
    return (
      <Layout className="pending-tasks-page" data-component="pending-tasks-page">
        <Header>
          <span className="title">项目列表/待处理任务</span>
          <div className="right-box">
            <Search placeholder="input search text" style={{width: "2.64rem", height: ".32rem"}} />
            <Dropdown overlay={this.pendingTaskMenu()}>
              <span>待处理任务<DownOutlined /></span>
            </Dropdown>
            <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => {
              this.setState({
                isCreateProjectVisible: true,
              });
            }}>添加项目</Button>
          </div>
        </Header>
        <Content>
          <Table
            loading={this.state.loadingState}
            columns={this.columns}
            dataSource={this.state.data}
            size="small"
            rowKey={record => record.key}
            pagination={false}
            scroll={{y: "calc(100vh - 2.2rem)"}}
          />
        </Content>
        <Footer>
          <Pagination
            size="small"
            total={85}
            showSizeChanger
            showQuickJumper
          />
          <Modal
            title="创建项目"
            visible={this.state.isCreateProjectVisible}
            cancelText="取消创建"
            okText="创建项目"
            closable={!this.state.createLoading}
            confirmLoading={this.state.createLoading}
            maskClosable={!this.state.createLoading}
            keyboard={!this.state.createLoading}
            onOk={() => {
              const form = this.createFormRef.current;
              form.validateFields().then(data => {
                this.setState({
                  createLoading: true,
                });
                ProjectBackend.CreatTemplateProject(data).then(res => {
                  if (res.status == "ok") {
                    message.success("项目创建成功！");
                    this.createFormRef.current.resetFields();
                    this.getProjectList(this.state.classes.account);
                  } else {
                    message.error("项目创建失败！");
                  }
                  this.setState({
                    createLoading: false,
                    isCreateProjectVisible: false,
                  });
                }).catch(err => {
                  this.setState({
                    createLoading: false,
                  });
                  message.error(err.message || "未知错误");
                });
              }).catch(err => {
                message.warning("请按要求填写表单项！");
              });
            }}
            onCancel={() => {
              if (this.state.createLoading) {
                message.error("项目创建中，不可阻断！");
              } else {
                this.createFormRef.current.resetFields();
                this.setState({
                  isCreateProjectVisible: false,
                });
              }
            }}
          >
            <Spin spinning={this.state.createLoading} tip="项目创建中，请等待！">
              <Form labelCol={{span: 4}} wrapperCol={{span: 20}} ref={this.createFormRef} name="createForm" initialValues={this.state.createForm}>
                <Form.Item name="name" label="项目名称" rules={[{required: true, message: "项目名称不能为空！"}]}>
                  <Input placeholder="请输入项目名称" />
                </Form.Item>
                <Form.Item name="grade_range" label="年级范围" rules={[{required: true, message: "请至少创建一个年级"}]}>
                  <ChangeTags onChange={grade_range => {
                    let createForm = Object.assign(this.state.createForm, {
                      grade_range,
                    });
                    this.setState({
                      createForm,
                    });
                  }}></ChangeTags>
                </Form.Item>
                <Form.Item name="subjects" label="涉及学科" rules={[{required: true, message: "请至少创建一个学科！"}]}>
                  <ChangeTags onChange={subjects => {
                    let createForm = Object.assign(this.state.createForm, {
                      subjects,
                    });
                    this.setState({
                      createForm,
                    });
                  }}></ChangeTags>
                </Form.Item>
                <Form.Item name="target" label="目标说明" rules={[{required: true, message: "目标说明不能为空！"}]}>
                  <TextArea
                    placeholder="请输入项目目标说明，若无，请填写无"
                    autoSize={{minRows: 3, maxRows: 5}}
                  />
                </Form.Item>
                <Form.Item name="summary" label="项目摘要" rules={[{required: true, message: "项目摘要不能为空！"}]}>
                  <TextArea
                    placeholder="请输入项目摘要，若无，请填写无"
                    autoSize={{minRows: 3, maxRows: 5}}
                  />
                </Form.Item>
                <Form.Item name="description" label="项目描述" rules={[{required: true, message: "项目描述不能为空！"}]}>
                  <TextArea
                    placeholder="请输入项目描述，若无，请填写无"
                    autoSize={{minRows: 3, maxRows: 5}}
                  />
                </Form.Item>
                <Form.Item name="requirement" label="项目要求" rules={[{required: true, message: "项目要求不能为空！"}]}>
                  <TextArea
                    placeholder="请输入项目要求，若无，请填写无"
                    autoSize={{minRows: 3, maxRows: 5}}
                  />
                </Form.Item>
              </Form>
            </Spin>

          </Modal>
        </Footer>
      </Layout>
    );
  }
}

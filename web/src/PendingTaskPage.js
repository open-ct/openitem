import React, {Component} from "react";
import {Button, Dropdown, Form, Input, Layout, Menu, Modal, Pagination, Space, Spin, Table, Tag, message} from "antd";
import {DownOutlined, PlusCircleOutlined} from "@ant-design/icons";
import * as ProjectBackend from "./backend/ProjectBackend";
import ChangeTags from "./ChangeTags";
import "./PendingTaskPage.less";
import i18next from "i18next";

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
      title: i18next.t("project:Project name"),
      key: "name",
      align: "center",
      width: 210,
      render: (text, record) => (
        <span key={1}>{record.basic_info.name}</span>
      ),
    },
    {
      title: i18next.t("project:Subject"),
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
      title: i18next.t("project:Grade"),
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
      title: i18next.t("project:Test paper"),
      key: "paper",
      align: "center",
      width: 142,
      render: record => (
        <span>0</span>
      ),
    },
    {
      title: i18next.t("project:Test questions"),
      key: "questions",
      align: "center",
      width: 121,
      render: record => (
        <span>0</span>
      ),
    },
    {
      title: i18next.t("project:Creation time"),
      dataIndex: "created_time",
      key: "create-time",
      align: "center",
      width: 342,
      render: (text, record) => (
        <span>{this.dateFilter(record.created_time)}</span>
      ),
    },
    {
      title: i18next.t("general:Action"),
      key: "title",
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={this.seekProjectManagement.bind(this, record)}>{i18next.t("project:Visit")}</Button>
          <Button type="link" danger>{i18next.t("general:Delete")}</Button>
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
        message.error(err || i18next.t("general:Error"));
      });
    });
  }

  render() {
    return (
      <Layout className="pending-tasks-page" data-component="pending-tasks-page">
        <Header>
          <span className="title">{i18next.t("project:Project list") + "/" + i18next.t("project:Pending tasks")}</span>
          <div className="right-box">
            <Search placeholder="input search text" style={{width: "2.64rem", height: ".32rem"}} />
            <Dropdown overlay={this.pendingTaskMenu()}>
              <span>{i18next.t("project:Project list")}<DownOutlined /></span>
            </Dropdown>
            <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => {
              this.setState({
                isCreateProjectVisible: true,
              });
            }}>{i18next.t("project:Add project")}</Button>
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
            title={i18next.t("project:Create project")}
            visible={this.state.isCreateProjectVisible}
            cancelText={i18next.t("general:Cancel")}
            okText={i18next.t("general:Confirm")}
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
                    message.success(i18next.t("general:Success"));
                    this.createFormRef.current.resetFields();
                    this.getProjectList(this.state.classes.account);
                  } else {
                    message.error(i18next.t("general:Fail"));
                  }
                  this.setState({
                    createLoading: false,
                    isCreateProjectVisible: false,
                  });
                }).catch(err => {
                  this.setState({
                    createLoading: false,
                  });
                  message.error(err.message || i18next.t("general:Error"));
                });
              }).catch(err => {
                message.warning(i18next.t("project:Please fill in the form as required"));
              });
            }}
            onCancel={() => {
              if (this.state.createLoading) {
                message.error(i18next.t("general:Operation uninterruptible"));
              } else {
                this.createFormRef.current.resetFields();
                this.setState({
                  isCreateProjectVisible: false,
                });
              }
            }}
          >
            <Spin spinning={this.state.createLoading} tip={i18next.t("project:Please wait")}>
              <Form labelCol={{span: 4}} wrapperCol={{span: 20}} ref={this.createFormRef} name="createForm" initialValues={this.state.createForm}>
                <Form.Item name="name" label={i18next.t("general:Name")} rules={[{required: true, message: i18next.t("general:This item cannot be empty")}]}>
                  <Input placeholder={i18next.t("project:Please enter a project name")} />
                </Form.Item>
                <Form.Item name="grade_range" label={i18next.t("general:Grade")} rules={[{required: true, message: i18next.t("project:Please create at least one grade")}]}>
                  <ChangeTags onChange={grade_range => {
                    let createForm = Object.assign(this.state.createForm, {
                      grade_range,
                    });
                    this.setState({
                      createForm,
                    });
                  }}></ChangeTags>
                </Form.Item>
                <Form.Item name="subjects" label={i18next.t("general:Subject")} rules={[{required: true, message: i18next.t("project:Please create at least one subject")}]}>
                  <ChangeTags onChange={subjects => {
                    let createForm = Object.assign(this.state.createForm, {
                      subjects,
                    });
                    this.setState({
                      createForm,
                    });
                  }}></ChangeTags>
                </Form.Item>
                <Form.Item name="target" label={i18next.t("item:Explain")} rules={[{required: true, message: i18next.t("general:This item cannot be empty")}]}>
                  <TextArea
                    placeholder={i18next.t("general:Please enter this item. If not, please enter No")}
                    autoSize={{minRows: 3, maxRows: 5}}
                  />
                </Form.Item>
                <Form.Item name="summary" label={i18next.t("item:Abstract")} rules={[{required: true, message: i18next.t("general:This item cannot be empty")}]}>
                  <TextArea
                    placeholder={i18next.t("general:Please enter this item. If not, please enter No")}
                    autoSize={{minRows: 3, maxRows: 5}}
                  />
                </Form.Item>
                <Form.Item name="description" label={i18next.t("item:Describe")} rules={[{required: true, message: i18next.t("general:This item cannot be empty")}]}>
                  <TextArea
                    placeholder={i18next.t("general:Please enter this item. If not, please enter No")}
                    autoSize={{minRows: 3, maxRows: 5}}
                  />
                </Form.Item>
                <Form.Item name="requirement" label={i18next.t("item:Request")} rules={[{required: true, message: i18next.t("general:This item cannot be empty")}]}>
                  <TextArea
                    placeholder={i18next.t("general:Please enter this item. If not, please enter No")}
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

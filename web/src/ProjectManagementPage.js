import React, {Component} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {Button, Descriptions, Form, Input, Modal, PageHeader, Spin, Tabs, message} from "antd";
import * as ProjectBackend from "./backend/ProjectBackend";
import ChangeTags from "./ChangeTags";
import Step from "./Step";
import BuildTeam from "./BuildTeam";
import "./ProjectManagementPage.less";

const {TabPane} = Tabs;
const {TextArea} = Input;

export default class ProjectManagementPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      demo: "Hello",
      classes: props,
      projectBaseInfo: {},
      loadingState: true,
      isCreateProjectVisible: false,
      createLoading: false,
    };
  }
  createFormRef = React.createRef();

  componentDidMount() {
    this.getProjectBaseInfo();
  }

  getProjectBaseInfo() {
    this.setState({
      loadingState: true,
    });
    ProjectBackend.GetDetailedInfo(this.props.match.params.project_id.split("_").join("/")).then(res => {
      this.setState({
        projectBaseInfo: res.data,
        ProjectInfo: res.data.basic_info.basic_info,
        loadingState: false,
      });
    }).catch(err => {
      this.props.history.push("/home");
      message.error(err.message || "项目信息加载失败，请重试！");
      this.setState({
        loadingState: false,
      });
    });
  }

  dateFilter(time) {
    let date = new Date(time);
    return `${date.getFullYear()}-${date.getMonth().toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  }

  tabCruuent = () => {
    let path_list = this.props.location.pathname.split("/");
    return `${path_list[path_list.length - 1]}_${path_list[path_list.length - 2]}`;
  }

  render() {
    return (
      <div className="project-management-page" data-component="project-management-page" key="project-management-page">
        <PageHeader
          ghost={false}
          onBack={() => this.props.history.push("/pending-tasks")}
          title="项目管理"
          subTitle={this.state.loadingState ? "加载中" : this.state.projectBaseInfo.basic_info.basic_info.name}
          extra={[
            <Button key="2" onClick={() => {
              this.setState({
                isCreateProjectVisible: true,
              });
            }}>编辑项目</Button>,
            <Button key="1">导出成员</Button>,
          ]
          }
          footer = {
            this.state.loadingState ? (
              <Spin spinning={this.state.loadingState} tip="加载中" />
            ) : (
              <Tabs defaultActiveKey={`${this.state.projectBaseInfo.steps[0].uuid}_${this.state.projectBaseInfo.steps[0].name}`} type="card" activeKey={this.tabCruuent()} onChange={(e) => {
                this.props.history.push(`/project-management/${this.props.match.params.project_id}/${this.props.match.params.role}/${e.split("_")[1]}/${e.split("_")[0]}`, this.state.classes.account);
              }}>
                {
                  this.state.projectBaseInfo.steps.map(item => (
                    <TabPane key={`${item.uuid}_${item.name}`} tab={item.name}></TabPane>
                  ))
                }
              </Tabs>
            )
          }
        >
          {
            this.state.loadingState ? (
              <Spin spinning={this.state.loadingState} tip="加载中..." />
            ) : (
              <Descriptions size="small" column={3} style={{width: "auto"}}>
                <Descriptions.Item label="创建时间">{this.dateFilter(this.state.projectBaseInfo.basic_info.created_time)}</Descriptions.Item>
                <Descriptions.Item label="学科">
                  {
                    this.state.projectBaseInfo.basic_info.basic_info.subjects.map((item, index) => (
                      <span key={index}>{`${item}${index === this.state.projectBaseInfo.basic_info.basic_info.subjects.length - 1 ? "" : "、"}`}</span>
                    ))
                  }
                </Descriptions.Item>
                <Descriptions.Item label="学段">
                  {
                    this.state.projectBaseInfo.basic_info.basic_info.grade_range.map((item, index) => (
                      <span key={index}>{`${item}${index === this.state.projectBaseInfo.basic_info.basic_info.grade_range.length - 1 ? "" : "、"}`}</span>
                    ))
                  }
                </Descriptions.Item>
                <Descriptions.Item label="试卷">0</Descriptions.Item>
                <Descriptions.Item label="试题">0</Descriptions.Item>
              </Descriptions>
            )
          }
        </PageHeader>
        <div className="page-content-box">
          {
            this.state.loadingState ? (<></>) : (
              <Switch>
                {
                  this.state.projectBaseInfo.steps.map(item => (
                    <Route path={`/project-management/:project_id/:role/${item.name}/:step_id`} component={item.name === "组建团队" ? BuildTeam : Step} exact key={item.Id}></Route>
                  ))
                }
                <Redirect from={`/project-management/${this.props.match.params.project_id}/${this.props.match.params.role}`} to={`/project-management/${this.props.match.params.project_id}/${this.props.match.params.role}/${this.state.projectBaseInfo.steps[0].name}/${this.state.projectBaseInfo.steps[0].uuid}`}></Redirect>
                {/* <Route component={NotFound} key="404"></Route> */}
              </Switch>
            )
          }
        </div>
        <Modal
          title="编辑项目"
          visible={this.state.isCreateProjectVisible}
          cancelText="取消更改"
          okText="确定更改"
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
                  message.success("项目修改成功！");
                  this.createFormRef.current.resetFields();
                  this.getProjectList(this.state.classes.account);
                } else {
                  message.error("项目修改失败！");
                }
                this.setState({
                  createLoading: false,
                  isCreateProjectVisible: false,
                });
              }).catch(err => {
                message.error(err.message || "未知错误");
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
              message.error("项目修改中，不可阻断！");
            } else {
              this.createFormRef.current.resetFields();
              this.setState({
                isCreateProjectVisible: false,
              });
            }
          }}
        >
          <Spin spinning={this.state.createLoading} tip="项目修改中，请等待！">
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
      </div >
    );
  }
}

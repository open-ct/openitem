import React, {Component} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {Button, Descriptions, Form, Input, Modal, PageHeader, Spin, Tabs, message} from "antd";
import * as ProjectBackend from "./backend/ProjectBackend";
import ChangeTags from "./ChangeTags";
import Step from "./Step";
import BuildTeam from "./BuildTeam";
import ProcessManagement from "./ProcessManagement";
import "./ProjectManagementPage.less";
import i18next from "i18next";

const {TabPane} = Tabs;
const {TextArea} = Input;

export default class ProjectManagementPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      message.error(err.message || i18next.t("general:Error"));
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
    if(path_list[path_list.length - 1] == "流程管理") {return "流程管理";}
    return `${path_list[path_list.length - 1]}_${path_list[path_list.length - 2]}`;
  }

  render() {
    return (
      <div className="project-management-page" data-component="project-management-page" key="project-management-page">
        <PageHeader
          ghost={false}
          onBack={() => this.props.history.push("/pending-tasks")}
          title={i18next.t("item:Project management")}
          subTitle={this.state.loadingState ? i18next.t("general:Loadding") : this.state.projectBaseInfo.basic_info.basic_info.name}
          extra={[
            <Button key="2" onClick={() => {
              this.setState({
                isCreateProjectVisible: true,
              });
            }}>{i18next.t("item:Edit Project")}</Button>,
            <Button key="1">{i18next.t("item:Export users")}</Button>,
          ]
          }
          footer = {
            this.state.loadingState ? (
              <Spin spinning={this.state.loadingState} tip={i18next.t("general:Loadding")} />
            ) : (
              <Tabs defaultActiveKey={`${this.state.projectBaseInfo.steps[0].uuid}_${this.state.projectBaseInfo.steps[0].name}`} type="card" activeKey={this.tabCruuent()} onChange={(e) => {
                if(e === "流程管理") {
                  this.props.history.push(`/project-management/${this.props.match.params.project_id}/${this.props.match.params.role}/${e}`, {account: this.props.account});
                } else {
                  this.props.history.push(`/project-management/${this.props.match.params.project_id}/${this.props.match.params.role}/${e.split("_")[1]}/${e.split("_")[0]}`, this.state.classes.account);
                }
              }}>
                <TabPane key="流程管理" tab={i18next.t("item:Process management")}></TabPane>
                {/* // this.state.projectBaseInfo.steps.map(item => (
                  //   <TabPane key={`${item.uuid}_${item.name}`} tab={item.name}></TabPane>
                  // )) */}
                <TabPane key={`${this.state.projectBaseInfo.steps[0].uuid}_${this.state.projectBaseInfo.steps[0].name}`} tab={i18next.t("item:Build team")}></TabPane>
                <TabPane key={`${this.state.projectBaseInfo.steps[1].uuid}_${this.state.projectBaseInfo.steps[1].name}`} tab={i18next.t("item:Test framework and demonstration report")}></TabPane>
                <TabPane key={`${this.state.projectBaseInfo.steps[2].uuid}_${this.state.projectBaseInfo.steps[2].name}`} tab={i18next.t("item:Interviewed by 6 people")}></TabPane>
                <TabPane key={`${this.state.projectBaseInfo.steps[3].uuid}_${this.state.projectBaseInfo.steps[3].name}`} tab={i18next.t("item:Test for 30 people")}></TabPane>
                <TabPane key={`${this.state.projectBaseInfo.steps[4].uuid}_${this.state.projectBaseInfo.steps[4].name}`} tab={i18next.t("item:Careful outside questions")}></TabPane>
                <TabPane key={`${this.state.projectBaseInfo.steps[5].uuid}_${this.state.projectBaseInfo.steps[5].name}`} tab={i18next.t("item:Test for 300 people")}></TabPane>
                <TabPane key={`${this.state.projectBaseInfo.steps[6].uuid}_${this.state.projectBaseInfo.steps[6].name}`} tab={i18next.t("item:Finalized reviews")}></TabPane>
              </Tabs>
            )
          }
        >
          {
            this.state.loadingState ? (
              <Spin spinning={this.state.loadingState} tip={i18next.t("general:Loadding")} />
            ) : (
              <Descriptions size="small" column={3} style={{width: "auto"}}>
                <Descriptions.Item label={i18next.t("project:Creation time")}>{this.dateFilter(this.state.projectBaseInfo.basic_info.created_time)}</Descriptions.Item>
                <Descriptions.Item label={i18next.t("project:Subject")}>
                  {
                    this.state.projectBaseInfo.basic_info.basic_info.subjects.map((item, index) => (
                      <span key={index}>{`${item}${index === this.state.projectBaseInfo.basic_info.basic_info.subjects.length - 1 ? "" : "、"}`}</span>
                    ))
                  }
                </Descriptions.Item>
                <Descriptions.Item label={i18next.t("project:Grade")}>
                  {
                    this.state.projectBaseInfo.basic_info.basic_info.grade_range.map((item, index) => (
                      <span key={index}>{`${item}${index === this.state.projectBaseInfo.basic_info.basic_info.grade_range.length - 1 ? "" : "、"}`}</span>
                    ))
                  }
                </Descriptions.Item>
                <Descriptions.Item label={i18next.t("project:Test paper")}>0</Descriptions.Item>
                <Descriptions.Item label={i18next.t("project:Test questions")}>0</Descriptions.Item>
              </Descriptions>
            )
          }
        </PageHeader>
        <div className="page-content-box">
          {
            this.state.loadingState ? (<></>) : (
              <Switch>
                <Route path={"/project-management/:project_id/:role/流程管理"} component={ProcessManagement} key="流程管理"></Route>
                {
                  this.state.projectBaseInfo.steps.map(item => (
                    <Route path={`/project-management/:project_id/:role/${item.name}/:step_id`} component={item.name === "组建团队" ? BuildTeam : Step} exact key={item.uuid}></Route>
                  ))
                }
                <Redirect from={`/project-management/${this.props.match.params.project_id}/${this.props.match.params.role}`} to={`/project-management/${this.props.match.params.project_id}/${this.props.match.params.role}/${this.state.projectBaseInfo.steps[0].name}/${this.state.projectBaseInfo.steps[0].uuid}`}></Redirect>
                {/* <Route component={NotFound} key="404"></Route> */}
              </Switch>
            )
          }
        </div>
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
      </div >
    );
  }
}

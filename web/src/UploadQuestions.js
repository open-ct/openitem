import React, {Component} from "react";
import {Button, Descriptions, Input, Layout, Menu, PageHeader, Pagination, Spin, message} from "antd";
import ChoiceQuestionEditer from "./ChoiceQuestionEditer";
import HistoryQuestion from "./HistoryQuestion";
import UpLoadQuestionModal from "./UpLoadQuestionModal";
import "./UploadQuestions.less";
import * as ProjectBackend from "./backend/ProjectBackend";

const {Search} = Input;
const {Sider, Content} = Layout;

export default class UploadQuestions extends Component {
    state = {
      difficultyValue: 4,
      createTime: 0,
      projectInfo: {},
      initLoading: true,
      upLoadQuestionModalParams: {
        show: false,
        type: "update",
      },
    }

    componentDidMount() {
      let t = new Date();
      this.setState({
        createTime: `${t.getFullYear()}-${t.getMonth().toString().padStart(2, "0")}-${t.getDate().toString().padStart(2, "0")} ${t.getHours().toString().padStart(2, "0")}:${t.getMinutes().toString().padStart(2, "0")}:${t.getSeconds().toString().padStart(2, "0")}`,
      });
      this.getProjectInfo();
    }

    getProjectInfo=() => {
      let newParms = this.props.match.params;
      ProjectBackend.GetDetailedInfo(newParms.uid + "/" + newParms.project).then(res => {
        this.setState({
          projectInfo: res.data.basic_info,
          initLoading: false,
        });
      }).catch(err => {
        this.setState({
          initLoading: false,
        });
        this.props.history.goBack();
        message.error("编辑器加载失败！");
      });
    }

    render() {
      return (
        <div className="upLoad-question-page" data-component="upLoad-question-page">
          <PageHeader
            ghost={false}
            onBack={() => this.props.history.goBack()}
            title="命题组卷"
            subTitle="上传试题"
            extra={[
              <Button key="1" onClick={() => {
                this.setState({
                  upLoadQuestionModalParams: {
                    show: true,
                    type: "update",
                  },
                });
              }}>编辑内容</Button>,
            ]}
          >
            {
              this.state.initLoading ? (
                <Spin spinning={true} tip="初始化中"></Spin>
              ) : (
                <Descriptions size="small" column={3}>
                  <Descriptions.Item label="创建时间" key="createAt">{this.state.createTime}</Descriptions.Item>
                  <Descriptions.Item label="项目" key="peojects">{this.state.projectInfo.basic_info.name}</Descriptions.Item>
                  <Descriptions.Item label="学科" key="subjects">{
                    this.state.projectInfo.basic_info.subjects.map((item, index) => (
                      <span key={index}>{item}{index === this.state.projectInfo.basic_info.subjects.length - 1 ? "" : "、"}</span>
                    ))
                  }</Descriptions.Item>

                  <Descriptions.Item label="内容纬度" key="content">{
                    this.props.match.params.content.split(",").map((item, index) => (
                      <span key={index}>{item}{index === this.props.match.params.content.split(",").length - 1 ? "" : "、"}</span>
                    ))
                  }</Descriptions.Item>
                  <Descriptions.Item label="能力纬度" key="ability">
                    {
                      this.props.match.params.ability.split(",").map((item, index) => (
                        <span key={index}>{item}{index === this.props.match.params.ability.split(",").length - 1 ? "" : "、"}</span>
                      ))
                    }
                  </Descriptions.Item>
                </Descriptions>
              )
            }
          </PageHeader>
          <div className="main">
            <Layout className="container">
              <Sider theme="light" width="2.4rem" style={{backgroundColor: "#FAFAFA"}}>
                <Menu
                  style={{width: "2.4rem"}}
                  defaultSelectedKeys={[this.props.match.params.type]}
                  defaultOpenKeys={[this.props.match.params.type]}
                  mode="vertical"
                  theme="light"
                  onClick = {(e) => {
                    let data = this.props.match.params;
                    this.props.history.push(`/proposition-paper/upload-questions/${data.project}/${data.subject}/${data.ability}/${data.content}/${e.key}`);
                  }}
                >
                  <Menu.Item key="1">选择题</Menu.Item>
                  <Menu.Item key="2">填空题</Menu.Item>
                  <Menu.Item key="3">阅读题</Menu.Item>
                </Menu>
              </Sider>
              <Content style={{backgroundColor: "white"}} className="content">
                <ChoiceQuestionEditer
                  author={this.props.match.params.uid}
                  defaultSubjectValue={this.props.match.params.subject}
                  subjectList={this.state.initLoading ? [] : this.state.projectInfo.basic_info.subjects}
                  ability={this.props.match.params.ability.split(",")}
                  content={this.props.match.params.content.split(",")}
                  grade_range={this.state.initLoading ? [] : this.state.projectInfo.basic_info.grade_range}
                  projectId={this.props.match.params.project}
                />
              </Content>
              <Sider theme="light" width="7.47rem" className="question-box">
                <div className="question-content-box">
                  <div className="title">相关题目</div>
                  <div className="filter-box">
                    <span>筛选</span>
                    <Search placeholder="input search text" style={{width: 200}} size="small" />
                  </div>
                  <HistoryQuestion

                  />
                  <HistoryQuestion

                  />
                  <HistoryQuestion

                  />
                  <Pagination defaultCurrent={1} total={50} className="page-spare" />
                </div>
              </Sider>
            </Layout>
          </div>
          <UpLoadQuestionModal
            {...this.state.upLoadQuestionModalParams}
            onClose={() => {
              let upLoadQuestionModalParams = Object.assign(this.state.upLoadQuestionModalParams, {show: false});
              this.setState({
                upLoadQuestionModalParams,
              });
            }}
          />
        </div>
      );
    }
}

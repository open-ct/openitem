import React, {Component} from "react";
import {Button, Descriptions, Input, Layout, Menu, PageHeader, Pagination, Spin} from "antd";
import ChoiceQuestionEditer from "./ChoiceQuestionEditer";
import HistoryQuestion from "./HistoryQuestion";
import UpLoadQuestionModal from "./UpLoadQuestionModal";
import "./UploadQuestions.less";

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
      // this.setState({
      //     initLoading:true
      // });
      // request({
      //     url:baseURL+`/review/proj/detailed/${this.props.match.params.project}`,
      //     // url:`http://49.232.73.36:8081/review/proj/detailed/${this.props.match.params.project}`,
      //     method:"GET"
      // }).then(res => {
      //     this.setState({
      //         projectInfo:res.data.basic_info,
      //         initLoading:false
      //     });
      // }).catch(err => {
      //     this.setState({
      //         initLoading:false
      //     });
      //     this.props.history.push("/home/proposition-paper/home");
      //     message.error("编辑器加载失败！");
      // });
      var res = {
        "operation_code": 1000,
        "message": "",
        "data": {
          "basic_info": {
            "Id": "62e4b170b686c0cf874cf17b",
            "CreateAt": "2022-07-30T04:20:00.137Z",
            "UpdateAt": "2022-07-30T04:20:00.137Z",
            "uuid": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
            "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
            "status": 0,
            "basic_info": {
              "name": "demo",
              "description": "无",
              "requirement": "无",
              "target": "无",
              "grade_range": [
                "大一",
              ],
              "subjects": [
                "数学",
              ],
              "summary": "无",
            },
          },
          "group": {
            "admins": [
              {
                "Id": "62e4b170b686c0cf874cf17c",
                "CreateAt": "2022-07-30T04:20:00.138Z",
                "UpdateAt": "2022-07-30T04:20:00.138Z",
                "uuid": "28dc2172-292a-45c0-9cdd-7c74b7cae5db",
                "user_id": "2ab2770e-b6e7-476b-969c-2db815e878e6",
                "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
                "role": 1,
                "operator": "system",
                "is_confirmed": true,
                "status": 0,
              },
            ],
            "assistants": [],
            "experts": [],
            "out_experts": [],
            "teachers": [],
          },
          "materials": {
            "questions": null,
            "exam_papers": null,
            "files": null,
          },
          "steps": [
            {
              "Id": "62e4b170b686c0cf874cf17d",
              "CreateAt": "2022-07-30T04:20:00.14Z",
              "UpdateAt": "2022-07-30T04:20:00.14Z",
              "uuid": "b694e0e4-ba70-43b4-87e9-a36290503839",
              "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
              "index": 0,
              "name": "组建团队",
              "description": "",
              "requirement": "",
              "status": 0,
              "deadline": 0,
              "timetable": null,
              "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
              "attachments": null,
            },
            {
              "Id": "62e4b170b686c0cf874cf17e",
              "CreateAt": "2022-07-30T04:20:00.14Z",
              "UpdateAt": "2022-07-30T04:20:00.14Z",
              "uuid": "a17143e3-e428-4058-9ee7-7c1d7998fd97",
              "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
              "index": 1,
              "name": "测试框架与论证报告",
              "description": "",
              "requirement": "",
              "status": 0,
              "deadline": 0,
              "timetable": null,
              "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
              "attachments": null,
            },
            {
              "Id": "62e4b170b686c0cf874cf17f",
              "CreateAt": "2022-07-30T04:20:00.141Z",
              "UpdateAt": "2022-07-30T04:20:00.141Z",
              "uuid": "fe40481f-ca4b-4c80-8b7f-1da14c246e47",
              "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
              "index": 2,
              "name": "6人访谈",
              "description": "",
              "requirement": "",
              "status": 0,
              "deadline": 0,
              "timetable": null,
              "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
              "attachments": null,
            },
            {
              "Id": "62e4b170b686c0cf874cf180",
              "CreateAt": "2022-07-30T04:20:00.141Z",
              "UpdateAt": "2022-07-30T04:20:00.141Z",
              "uuid": "ec57d848-a037-4b0f-a128-aab83ecc3482",
              "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
              "index": 3,
              "name": "30人测试",
              "description": "",
              "requirement": "",
              "status": 0,
              "deadline": 0,
              "timetable": null,
              "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
              "attachments": null,
            },
            {
              "Id": "62e4b170b686c0cf874cf181",
              "CreateAt": "2022-07-30T04:20:00.142Z",
              "UpdateAt": "2022-07-30T04:20:00.142Z",
              "uuid": "05726d4e-14ad-46d7-b7ec-751c3d546bc0",
              "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
              "index": 4,
              "name": "试题外审",
              "description": "",
              "requirement": "",
              "status": 0,
              "deadline": 0,
              "timetable": null,
              "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
              "attachments": null,
            },
            {
              "Id": "62e4b170b686c0cf874cf182",
              "CreateAt": "2022-07-30T04:20:00.143Z",
              "UpdateAt": "2022-07-30T04:20:00.143Z",
              "uuid": "1acb34c2-88b5-43b0-a96b-27d9444c26c8",
              "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
              "index": 5,
              "name": "300人测试",
              "description": "",
              "requirement": "",
              "status": 0,
              "deadline": 0,
              "timetable": null,
              "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
              "attachments": null,
            },
            {
              "Id": "62e4b170b686c0cf874cf183",
              "CreateAt": "2022-07-30T04:20:00.144Z",
              "UpdateAt": "2022-07-30T04:20:00.144Z",
              "uuid": "0edc10b2-9af9-4254-a50d-91cf6c6b1fe8",
              "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
              "index": 6,
              "name": "定稿审查",
              "description": "",
              "requirement": "",
              "status": 0,
              "deadline": 0,
              "timetable": null,
              "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
              "attachments": null,
            },
          ],
        },
      };
      this.setState({
        projectInfo: res.data.basic_info,
        initLoading: false,
      });
    }

    render() {
      return (
        <div className="upLoad-question-page" data-component="upLoad-question-page">
          <PageHeader
            ghost={false}
            onBack={() => this.props.history.push("/proposition-paper/home")}
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

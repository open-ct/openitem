import React, {Component, createRef} from "react";
import {Button, Descriptions, Input, Layout, PageHeader, Pagination, Spin, message} from "antd";
import ChoiceQuestionEditer from "./ChoiceQuestionEditer";
import HistoryQuestion from "./HistoryQuestion";
import UpLoadQuestionModal from "./UpLoadQuestionModal";
import "./UploadQuestions.less";
import * as ProjectBackend from "./backend/ProjectBackend";
import * as PropositionBackend from "./backend/PropositionBackend";

const {Search} = Input;
const {Sider, Content} = Layout;

export default class UploadQuestions extends Component {

  constructor(props) {
    super(props);
    this.historyCom = createRef();
    this.ChoiceComp = createRef();
    this.onIndex = this.onIndex.bind(this);
    this.state = {
      classes: props,
      question: {},
      historyQuestions: [],
      serchLoading: false,
      difficultyValue: 4,
      createTime: 0,
      projectInfo: {},
      initLoading: true,
      currentPage: 1,
      upLoadQuestionModalParams: {
        show: false,
        type: "update",
      },
    };
  }

  componentDidMount() {
    let t = new Date();
    this.setState({
      createTime: `${t.getFullYear()}-${t.getMonth().toString().padStart(2, "0")}-${t.getDate().toString().padStart(2, "0")} ${t.getHours().toString().padStart(2, "0")}:${t.getMinutes().toString().padStart(2, "0")}:${t.getSeconds().toString().padStart(2, "0")}`,
    });
    this.getProjectInfo();
  }

    searchFinishQuestion=(value, e) => {
      this.setState({
        serchLoading: true,
      });
      PropositionBackend.SearchFinalQuestion(value).then(res => {
        if(res.data) {
          this.setState({
            historyQuestions: res.data,
            serchLoading: false,
          });
          this.historyCom.current.getQuestionInfo(res.data);
        }else{
          message.warning("未检索到相关问题！");
          this.setState({
            serchLoading: false,
          });
        }
      }).catch(err => {
        message.error(err.message);
        this.setState({
          serchLoading: false,
        });
      });
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
        this.classes.history.goBack();
        message.error("编辑器加载失败！");
      });
    }
    onIndex=(indexQuestion) => {
      this.setState({
        question: indexQuestion,
      });
      this.ChoiceComp.fillEditor(indexQuestion);
    }
    render() {
      return (
        <div className="upLoad-question-page" data-component="upLoad-question-page">
          <PageHeader
            style={{backgroundColor: "F5F5F5"}}
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
                  <Descriptions.Item label="项目" key="peoject">{this.props.match.params.project}</Descriptions.Item>
                  <Descriptions.Item label="学科" key="subject">{this.props.match.params.subject}</Descriptions.Item>
                  <Descriptions.Item label="类型" key="type">{this.props.match.params.type}</Descriptions.Item>
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
              <Content style={{backgroundColor: "white", padding: "5px", borderRadius: "10px"}} className="content">
                <ChoiceQuestionEditer
                  ref={(el) => {this.ChoiceComp = el;}}
                  classes={this.props}
                  author={this.props.match.params.uid}
                  defaultSubjectValue={this.props.match.params.subject}
                  subjectList={this.state.initLoading ? [] : this.state.projectInfo.basic_info.subjects}
                  ability={this.props.match.params.ability.split(",")}
                  content={this.props.match.params.content.split(",")}
                  grade_range={this.state.initLoading ? [] : this.state.projectInfo.basic_info.grade_range}
                  projectId={this.props.match.params.project}
                />
              </Content>
              <Sider theme="light" width="7rem" className="question-box">
                <div className="question-content-box">
                  <div className="title">
                    <img src="https://openitem.oss-cn-beijing.aliyuncs.com/img/search.png" style={{marginRight: "16px"}} width="80px" height="80px"></img>
                    <span style={{fontWeight: "bolder", color: "#72AEF7"}}>Search</span>
                    <div style={{color: "cadetblue", fontSize: "12px", marginLeft: "200px"}}>从题库中导入题目到编辑器中,以达到快速命题的效果</div>
                  </div>
                  <div className="filter-box">
                    <Search placeholder="input search text" style={{width: "100%"}} enterButton size="large" loading={this.state.serchLoading} onSearch={this.searchFinishQuestion} />
                  </div>
                  {this.state.historyQuestions ?
                    <HistoryQuestion ref={this.historyCom} onIndex={this.onIndex} />
                    : <></>
                  }
                  <Pagination current={this.state.currentPage} total={this.state.historyQuestions ? this.state.historyQuestions.length : 0} pageSize={2} hideOnSinglePage showQuickJumper={true} onChange={(page) => {
                    this.setState({
                      currentPage: page,
                    });
                    this.historyCom.current.setPageNum(page);
                  }} className="page-spare" />
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

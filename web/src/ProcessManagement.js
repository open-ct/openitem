import React, {Component} from "react";
import {Col, Descriptions, Modal, Popconfirm, Row, Select, Space, Spin, Table, message} from "antd";
import ModulaCard from "./ModulaCard.js";
import * as ProjectBackend from "./backend/ProjectBackend";

const {Option} = Select;

import * as PropositionBackend from "./backend/PropositionBackend";

export default class ProcessManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberList: [],
      testpaperVisible: {
        show: false,
        id_list: [],
        loadingState: false,
        questionList: [],
        testpaperDetailData: [],
        testPaperData: {},
      },
      roleData: {"组建团队": {}, "测试框架与论证报告": {}, "6人访谈": {}, "30人测试": {}, "试题外审": {}, "300人测试": {}, "定稿审查": {}},
      testPaperData: [],
      loadingState: false,
      lodingModal: false,
      openState: false,
      steps: ["组建团队", "测试框架与论证报告", "6人访谈", "30人测试", "试题外审", "300人测试", "定稿审查"],
      columns: [
        {
          title: "试卷id",
          dataIndex: "uuid",
          key: "testpaper_id",
          align: "center",
        },
        {
          title: "试卷标题",
          dataIndex: "title",
          key: "testpaper_title",
          align: "center",
        },
        {
          title: "命题人",
          dataIndex: "authorName",
          key: "author",
          align: "center",
        },
        {
          title: "试卷详情",
          dataIndex: "detail",
          key: "detail",
          align: "center",
          render: (_, record) => {
            return (
              <a onClick={() => {
                this.setState({
                  testpaperVisible: Object.assign(this.state.testpaperVisible, {show: true, testPaperData: record, testpaperDetailData: record.info}),
                });
                this.getTestpaperRecord(record.uuid);
              }}>试卷详情</a>
            );
          },
        },
        // {
        //   title: "审核员",
        //   dataIndex: "role",
        //   align: "center",
        //   key: "role",
        //   render: (_, record) => {
        //     return (
        //       <a onClick={() => {
        //         if(this.props.match.params.role !== "1") {
        //           message.warn("暂无权限");
        //           return;
        //         }
        //         ProjectBackend.GetOneTpAssignment(record.uuid).then(res => {
        //           let keys = Object.keys(res.data);
        //           let data = Object.assign({}, {"组建团队": {}, "测试框架与论证报告": {}, "6人访谈": {}, "30人测试": {}, "试题外审": {}, "300人测试": {}, "定稿审查": {}});
        //           if (keys.length > 0) {
        //             keys.map(item => {
        //               data[item] = {name: res.data[item].name, displayName: res.data[item].displayName};
        //             });
        //           }
        //           this.setState({
        //             roleData: data,
        //             openState: true,
        //             testpaper_id: record.uuid,
        //           });
        //         });
        //       }}>分配审核人</a>
        //     );
        //   },
        // },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          align: "center",
          render: (_, record) => (
            <Space size="middle">
              <Popconfirm
                title="Are you sure to delete this testpaper?"
                onConfirm={() => {
                  if(this.props.match.params.role !== "1") {
                    message.warn("暂无权限");
                    return;
                  }
                  this.setState({
                    loadingState: true,
                  });
                  PropositionBackend.DeleteTempTestpaper(record.uuid).then(res => {
                    if (res.status == "ok") {
                      message.success("删除成功！");
                      this.setState({
                        loadingState: false,
                      });
                    } else {
                      message.success("删除失败");
                      this.setState({
                        loadingState: false,
                      });
                    }
                    let pid = this.props.match.params.project_id.split("_").join("/");
                    this.getTestpaperList(pid);
                    this.getProjectMember(pid);
                  });
                }}
                onCancel={() => {

                }}
                okText="Yes"
                cancelText="No"
              >
                <a>删除</a>
              </Popconfirm>
              <Popconfirm
                title="Are you sure to finish this testpaper?"
                onConfirm={() => {
                  this.setState({
                    loadingState: false,
                  });
                  ProjectBackend.GetDetailedInfo(this.props.match.params.project_id.split("_").join("/")).then(res => {
                    let currentStep = res.data.steps.filter(item => {return item.status == "未通过";});
                    if(currentStep.length === 0) {
                      ProjectBackend.finishTempTestpaper(record.uuid).then(res => {
                        this.setState({
                          loadingState: false,
                        });
                        if(res.status == "ok") {
                          message.success("试卷完成入库");
                        }else{
                          message.warn(res.msg);
                        }
                      });
                    }else{
                      this.setState({
                        loadingState: false,
                      });
                      message.warn("项目流程未结束");
                    }
                  }).catch(err => {
                    this.setState({
                      loadingState: true,
                    });
                    message.warn(err.message);
                  });
                }}
                onCancel={() => {

                }}
              >
                <a>完成</a>
              </Popconfirm >
            </Space>
          ),
        },
      ],
    };
  }
  getTestpaperList = (pid) => {
    this.setState({
      loadingState: true,
    });
    ProjectBackend.GetProjectTempTestpaper(pid).then(res => {
      let users_id = res.data ? res.data.map(item => {
        return item.author;
      }) : [];
      let resData = res.data;
      ProjectBackend.GetUserList(users_id).then(res => {
        resData ? resData.map((item, index) => {
          return Object.assign(item, {authorName: res.data[item.author].displayName, state: this.state.steps[Math.floor(Math.random() * 7)].split(" "), key: index});
        }) : [];
        this.setState({
          loadingState: false,
          testPaperData: resData,
        });
      }).catch(err => {
        message.error(err);
        this.setState({
          loadingState: false,
        });
      });
    }).catch(err => {
      message.error(err);
      this.setState({
        loadingState: false,
      });
    });
  }
  getProjectMember = (pid) => {
    this.setState({
      loadingState: true,
    });
    ProjectBackend.GetProjectAssignments(pid).then(res => {
      let memberList = [];
      memberList = [...res.data.admins.map(item => {
        item.roleName = "admin";
        return item;
      }), ...res.data.assistants.map(item => {
        item.roleName = "assistant";
        return item;
      }), ...res.data.experts.map(item => {
        item.roleName = "expert";
        return item;
      }), ...res.data.out_experts.map(item => {
        item.roleName = "out_expert";
        return item;
      }), ...res.data.teachers.map(item => {
        item.roleName = "teacher";
        return item;
      })];
      let id_list = memberList.map(item => item.user_id);
      ProjectBackend.GetUserList(id_list).then(res => {
        let userInfo_list = res.data;
        memberList = memberList.map((item, index) => {
          item.info = userInfo_list[item.user_id];
          item.key = index.toString();
          return item;
        });
        this.setState({
          memberList,
          loadingState: false,
        });
      });
    });
  }
  componentDidMount() {
    let pid = this.props.match.params.project_id.split("_").join("/");
    this.getTestpaperList(pid);
    this.getProjectMember(pid);
  }
  dateFtt=(fmt, date) => {
    var o = {
      "M+": date.getMonth() + 1,                 // 月份   
      "d+": date.getDate(),                    // 日   
      "h+": date.getHours(),                   // 小时   
      "m+": date.getMinutes(),                 // 分   
      "s+": date.getSeconds(),                 // 秒   
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度   
      "S": date.getMilliseconds(),             // 毫秒   
    };
    if(/(y+)/.test(fmt)) {fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));}
    for(var k in o) {
      if(new RegExp("(" + k + ")").test(fmt)) {fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));}
    }
    return fmt;
  }
  getTestpaperRecord = (tid) => {
    this.setState({
      loadingState: true,
      testpaperVisible: Object.assign(this.state.testpaperVisible, {loadingState: true}),
    });
    PropositionBackend.GetTempTestpaperDetail(tid).then(res => {
      this.setState({
        loadingState: false,
        testpaperVisible: Object.assign(this.state.testpaperVisible, {loadingState: false, testpaperDetailData: res.data.info}),
      });
    }).catch(err => {
      this.setState({
        loadingState: false,
        testpaperVisible: Object.assign(this.state.testpaperVisible, {loadingState: false, show: false}),
      });
      message.error(err.message || "请求错误");
    });
  }
  render() {
    return (
      <div className="process-management-page" data-component="process-management-page" >
        <ModulaCard
          title="试卷管理"
        >
          <div>
            <Table
              style={{height: "6rem"}}
              columns={this.state.columns}
              dataSource={this.state.testPaperData}
              loading={this.state.loadingState}
              pagination={{
                responsive: true,
                position: "bottomRight",
                hideOnSinglePage: true,
                pageSize: 4,
                defaultCurrent: 1,
                showQuickJumper: true,
                total: this.state.testPaperData ? this.state.testPaperData.length : 0,
              }}
            />
          </div>
        </ModulaCard>
        <Modal
          title="请分配审核人员  (管理员永远拥有最高权限)"
          visible={this.state.openState}
          onCancel={() => {
            this.setState({
              openState: false,
            });
          }}
          footer={null}
        >
          {this.state.steps.map((item, index) => {
            return (
              <div key={index} style={{marginTop: "20px"}}>
                <span>{item + ":"}</span>
                <Select
                  value={this.state.roleData[item].displayName ? this.state.roleData[item].displayName : ""}
                  onSelect={(_, e) => {
                    let itemData = Object.assign({
                      operator: this.props.location.state.account.id,
                      project_id: this.props.match.params.project_id.split("_").join("/"),
                      testpaper_id: this.state.testpaper_id,
                      user_id: e.key,
                      role: this.state.steps[index],
                      displayName: e.value,
                    });
                    let data = this.state.roleData;
                    data[this.state.steps[index]] = itemData;
                    this.setState({
                      roleData: data,
                    });
                    ProjectBackend.MakeOneTpAssignment(itemData).then(res => {
                      message.success("分配成功！");
                      this.setState({
                      });
                    }).catch(err => {
                      message.error(err);
                    });
                  }}
                  style={{
                    position: "absolute",
                    left: "200px",
                    display: "inline-block",
                    width: "240px",
                  }}
                >
                  {this.state.memberList ? this.state.memberList.map((iitem, index) => {
                    return (
                      <Option key={iitem.user_id} value={iitem.info.displayName}>{iitem.info.displayName + `(${iitem.roleName})`}</Option>
                    );
                  }) : <></>}
                </Select>
              </div>
            );
          })}
        </Modal>
        <Modal
          title="试卷详情"
          visible={this.state.testpaperVisible.show}
          width="80%"
          onOk={() => {
            this.setState({
              testpaperVisible: Object.assign(this.state.testpaperVisible, {show: false}),
            });
          }}
          onCancel={() => {
            this.setState({
              testpaperVisible: Object.assign(this.state.testpaperVisible, {show: false}),
            });
          }}
        >
          <Spin spinning={this.state.testpaperVisible.loadingState} tip="加载中">
            {
              this.state.testpaperVisible.loadingState ? "" : (
                <>
                  <Spin spinning={this.state.testpaperVisible.loadingState} tip="加载中">
                    {
                      this.state.testpaperVisible.loadingState ? "" : (
                        <>
                          <Descriptions title="试卷相关信息">
                            <Descriptions.Item label="唯一标识">{this.state.testpaperVisible.testPaperData.uuid}</Descriptions.Item>
                            <Descriptions.Item label="标题">{this.state.testpaperVisible.testPaperData.title}</Descriptions.Item>
                            <Descriptions.Item label="作者">{this.state.testpaperVisible.testPaperData.authorName}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{this.dateFtt("yyyy年MM月dd日  hh:mm", new Date(this.state.testpaperVisible.testPaperData.create_at))}</Descriptions.Item>
                            <Descriptions.Item label="更新时间">{this.dateFtt("yyyy年MM月dd日  hh:mm", new Date(this.state.testpaperVisible.testPaperData.updated_at))}</Descriptions.Item>
                            <Descriptions.Item label="批注信息">{this.state.testpaperVisible.testPaperData.comment_record}</Descriptions.Item>
                          </Descriptions>
                        </>
                      )
                    }
                  </Spin>
                  <br></br>
                  <hr></hr>
                  <Descriptions title="试卷内容"></Descriptions>
                  {
                    this.state.testpaperVisible.testpaperDetailData.map((question_stem, index) => (
                      <div className="paper-question-stem" key={index}>
                        <Row className="header">
                          <Col>
                            <span style={{fontWeight: "bold"}}>{question_stem.title}{question_stem.description}</span>
                          </Col>
                        </Row>
                        <div>
                          <>
                            {question_stem.question_list.map((question_item, index) => {
                              return (
                                <div className="paper-question-item" key={index}>
                                  <Row className="header">
                                    <Col span="4">
                                      <span>序号：<span style={{fontWeight: "bold", color: "red"}}>{index + 1}</span></span>
                                    </Col>
                                    <Col span="6">
                                      <span>
                                        测试年份：<span style={{fontWeight: "bold", color: "green"}}>{question_item.question.apply_record.test_year}</span>
                                      </span>
                                    </Col>
                                    <Col span="4">
                                      <span>
                                        试题难度：<span style={{fontWeight: "bold", color: "blue"}}>{question_item.question.advanced_props.irt_level}</span>
                                      </span>
                                    </Col>
                                    <Col span="4">
                                      <span>
                                        试题类型：{question_item.question.info.type}
                                      </span>
                                    </Col>
                                  </Row>
                                  <div className="body" dangerouslySetInnerHTML={{__html: question_item.question.info.body}}></div>
                                  <br />
                                  <br />
                                </div>
                              );
                            })}
                          </>
                        </div>
                      </div>
                    ))
                  }
                </>
              )
            }
          </Spin>
        </Modal>
      </div>
    );
  }
}

import React, {Component} from "react";
import {Descriptions, Modal, Popconfirm, Select, Space, Spin, Table, Tag, message} from "antd";
import ModulaCard from "./ModulaCard.js";
import * as ProjectBackend from "./backend/ProjectBackend";

const {Option} = Select;

export default class ProcessManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // roles: ["第一阶段审核员", "第二阶段审核员", "第三阶段审核员", "第四阶段审核员", "第五阶段审核员", "第六阶段审核员", "第七阶段审核员"],
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
          // dataIndex: "testpaper_id",
          dataIndex: "uuid",
          key: "testpaper_id",
          width: "200px",
          //   render: (_, {testpaper_id}) => <Paragraph ellipsis={true}>{testpaper_id}</Paragraph>,
        },
        {
          title: "试卷标题",
          // dataIndex: "testpaper_title",
          dataIndex: "title",
          key: "testpaper_title",
          width: "300px",
        },
        {
          title: "命题人",
          dataIndex: "authorName",
          key: "author",
          width: "160px",
        },
        {
          title: "流程阶段",
          dataIndex: "state",
          key: "state",
          width: "120px",
          render: (_, {state}) => (
            <>
              {state.map((tag, index) => {
                let color = "green";
                // switch(tag) {
                // case "组建团队": {color = "#8B4513"; break;}
                // case "测试框架与论证报告": {color = "#FFB7DD"; break;}
                // case "6人访谈": {color = "#BBFFEE"; break;}
                // case "30人测试": {color = "#CCBBFF"; break;}
                // case "试题外审": {color = "#FF3EFF"; break;}
                // case "300人测试": {color = "#FFFF33"; break;}
                // case "已完成": {color = "orangered "; break;}
                // case "未开始": {color = "green"; break;}
                // default: {color = "red";}
                // }
                return (
                  <Tag color={color} key={index}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          ),
        },
        {
          title: "下一阶段",
          dataIndex: "next_state",
          key: "next_state",
          width: "120px",
          render: (_, {state}) => (
            <>
              {state.map((tag, index) => {
                let color;
                tag = this.state.steps[(this.state.steps.indexOf(tag)) + 1];
                switch (tag) {
                // case "组建团队": {color = "#8B4513"; break;}
                // case "测试框架与论证报告": {color = "#FFB7DD"; break;}
                // case "6人访谈": {color = "#BBFFEE"; break;}
                // case "30人测试": {color = "#CCBBFF"; break;}
                // case "试题外审": {color = "#FF3EFF"; break;}
                // case "300人测试": {color = "#FFFF33"; break;}
                case "已完成": {color = "orangered "; break;}
                case "未开始": {color = "green"; break;}
                default: {color = "volcano";}
                }
                return (
                  <Tag color={color} key={index}>
                    {tag}
                  </Tag>
                );
              })}
            </>
          ),
        },
        {
          title: "试卷详情",
          dataIndex: "detail",
          key: "detail",
          width: "150px",
          render: (_, record) => {
            return (
              <a onClick={() => {
                this.setState({
                  testpaperVisible: Object.assign(this.state.testpaperVisible, {show: true, testPaperData: record, testpaperDetailData: record.info}),
                });
              }}>试卷详情</a>
            );
          },
        },
        {
          title: "审核员",
          dataIndex: "role",
          width: "150px",
          key: "role",
          render: (_, record) => {
            return (
              <a onClick={() => {
                ProjectBackend.GetOneTpAssignment(record.uuid).then(res => {
                  let keys = Object.keys(res.data);
                  let data = Object.assign({}, {"组建团队": {}, "测试框架与论证报告": {}, "6人访谈": {}, "30人测试": {}, "试题外审": {}, "300人测试": {}, "定稿审查": {}});
                  if (keys.length > 0) {
                    keys.map(item => {
                      data[item] = {name: res.data[item].name, displayName: res.data[item].displayName};
                    });
                  }
                  this.setState({
                    roleData: data,
                    openState: true,
                    testpaper_id: record.uuid,
                  });
                });
              }}>分配审核人</a>
            );
          },
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          render: (_, record) => (
            <Space size="middle">
              <Popconfirm
                title="Are you sure to through this stage?"
                onConfirm={() => {
                  let data = this.state.testPaperData.map(item => {
                    if(item.uuid === record.uuid) {
                      let num = this.state.steps.indexOf(record.state[0]) + 1;
                      return Object.assign(item, {state: [this.state.steps[num]]});
                    }
                    return item;
                  });
                  this.setState({
                    testPaperData: data,
                  });
                }}
                onCancel={() => {

                }}
                okText="Yes"
                cancelText="No"
              >
                <a>下一阶段</a>
              </Popconfirm>
              <a>重置</a>
              <a>删除</a>
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
      let users_id = res.data.map(item => {
        return item.author;
      });
      let resData = res.data;
      ProjectBackend.GetUserList(users_id).then(res => {
        resData.map((item, index) => {
          return Object.assign(item, {authorName: res.data[item.author].displayName, state: this.state.steps[Math.floor(Math.random() * 7)].split(" "), key: index});
        });
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
  dateFtt=(fmt, date) => { // author: meizz   
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
  render() {
    return (
      <div className="process-management-page" data-component="process-management-page" >
        <ModulaCard
          title="流程管理"
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
                total: this.state.testPaperData.length,
              }}
            />
          </div>
        </ModulaCard>
        <Modal
          title="请分配审核人员"
          visible={this.state.openState}
          onOk={() => {
            this.setState({
              openState: false,
            });
          }}
          onCancel={() => {
            this.setState({
              openState: false,
            });
          }}
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
                  <Descriptions title="试卷相关信息">
                    <Descriptions.Item label="唯一标识">{this.state.testpaperVisible.testPaperData.uuid}</Descriptions.Item>
                    <Descriptions.Item label="标题">{this.state.testpaperVisible.testPaperData.title}</Descriptions.Item>
                    <Descriptions.Item label="作者">{this.state.testpaperVisible.testPaperData.authorName}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{this.dateFtt("yyyy年MM月dd日  hh:mm", new Date(this.state.testpaperVisible.testPaperData.create_at))}</Descriptions.Item>
                    <Descriptions.Item label="更新时间">{this.dateFtt("yyyy年MM月dd日  hh:mm", new Date(this.state.testpaperVisible.testPaperData.updated_at))}</Descriptions.Item>
                    <Descriptions.Item label="批注信息">{this.state.testpaperVisible.testPaperData.comment_record}</Descriptions.Item>
                  </Descriptions>
                  {/* <hr />
                  {
                    this.state.testpaperVisible.testpaperDetailData.map((question_stem, index) => (
                      <div className="paper-question-stem" key={index}>
                        <Row className="header">
                          <Col>
                            <span style={{fontWeight: "bold"}}>{question_stem.title}{question_stem.description}</span>
                          </Col>
                        </Row>
                      </div>
                    ))
                  } */}
                </>
              )
            }
          </Spin>
        </Modal>
      </div>
    );
  }
}

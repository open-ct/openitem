import React, {Component} from "react";
import {Button, Modal, Pagination, Radio, Space, Table, Tag, message} from "antd";
import {FileTextTwoTone} from "@ant-design/icons";
import ModulaCard from "./ModulaCard";
import ModifyRecordModal from "./ModifyRecordModal";
import UpLoadModal from "./UpLoadModal";
import "./DataTable.less";
import * as ProjectBackend from "./backend/ProjectBackend";

export default class index extends Component {
  state = {
    showFiles: false,
    upLoadVisible: false,
    data: [],
    loadingState: false,
    reviewResultsVisible: false,
    statusChangeLoading: false,
    modifyRecordVisible: false,
    selectedSubmitId: "",
    statusChangeParams: {
      value: 1,
      submitId: "",
    },
  }

  modifyRecordRef = React.createRef()

  columns = [{
    title: "上传时间",
    dataIndex: "create_at",
    key: "create_at",
    align: "center",
    width: 150,
    render: (text, record) => (
      <span>{this.dateFilter(record.create_at)}</span>
    ),
  }, {
    title: "上传用户",
    dataIndex: "user_name",
    key: "user_name",
    align: "center",
    width: 120,
  }, {
    title: "所属试卷",
    dataIndex: "testpaper_id",
    key: "testpaper_id",
    align: "center",
  }, {
    title: "材料标题",
    dataIndex: "name",
    key: "name",
    align: "center",
  }, {
    title: "评审材料",
    key: "file",
    dataIndex: "file",
    align: "center",
    render: (text, record) => (
      <Space size="middle">
        {
          record.file ? (
            <span style={{cursor: "pointer"}} onClick={() => {
              this.setState({
                showFiles: true,
                file: record.file,
              });
            }}>点击查看<FileTextTwoTone /></span>
          ) : "无"
        }
      </Space>
    ),
  }, {
    title: "评审",
    key: "status",
    dataIndex: "status",
    align: "center",
    width: 100,
    render: (text, record) => {
      let levelList = [{
        mode: "未审核",
        color: "default",
      }, {
        mode: "审核通过",
        color: "#87D068",
      }, {
        mode: "驳回",
        color: "#FF5500",
      }];
      return (
        record ? <Space size="middle">
          <Tag color={levelList.filter(item => {return item.mode == record.status;})[0].color} onClick={() => {
            ProjectBackend.getAllTpassign(record.testpaper_id).then(res => {
              // this.setState({
              //   auth: (res.data[this.props.stepName] ? res.data[this.props.stepName].id : null) == this.props.account.id ? true : false,
              // });
              if(this.props.role == 2 || this.props.role == 1) {
                this.setState({
                  reviewResultsVisible: true,
                  statusChangeParams: {
                    submitId: record.owner + "/" + record.name,
                    value: record.status,
                  },
                });
              }else{
                message.warn("暂无权限");
                return;
              }
            }).catch(err => {
              message.error(err.message);
            });
          }} style={{cursor: "pointer"}}>{record.status}</Tag>
        </Space> : <></>
      );
    },
  }, {
    title: "反馈批注材料",
    dataIndex: "description",
    key: "description",
    align: "center",
    render: (text, record) => {
      return (<div>反馈批注材料</div>);
    },
  }]

  dateFilter(time) {
    let date = new Date(time);
    return `${date.getFullYear()}-${date.getMonth().toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  }

  loadClumsIndex = () => {
    if (this.props.role === "2") {
      return 0;
    } else if (this.props.role === "3") {
      return 1;
    } else if (this.props.role === "4" && this.props.stepName === "测试框架与论证报告") {
      return 2;
    } else if (this.props.role === "4" && this.props.stepName !== "测试框架与论证报告") {
      return 1;
    } else {
      return 0;
    }
  }

  componentDidMount() {
    this.getDataList();
  }

  getDataList = () => {
    this.setState({
      loadingState: true,
    });
    let pid = this.props.projectId.split("_").join("/");
    ProjectBackend.GetAllSubmit(pid).then(res => {
      let data = res.data ? res.data.filter(item => {
        return item.step_id == this.props.stepId;
      }) : null;
      this.setState({
        data,
        loadingState: false,
      });
      let userList = this.state.data ? this.state.data.map(item => {
        return item.submitter;
      }) : [];
      ProjectBackend.GetUserList(userList).then(res => {
        let newData = this.state.data ? this.state.data.map((item, index) => {
          return Object.assign(item, {user_name: res.data[item.submitter].displayName, key: index});
        }) : [];
        this.setState({
          data: newData,
        });
      }).catch(err => {
        message.error(err.message);
      });
    }).catch(err => {
      message.error(err.message || "审查材料加载失败！");
      this.setState({
        loadingState: false,
      });
    });
  }

  render() {
    return (
      <ModulaCard title={this.props.title} right={(
        <Button type="primary" size="small" onClick={() => {
          this.setState({
            upLoadVisible: true,
          });
        }}>上传审核材料</Button>
      )}>
        <UpLoadModal
          show={this.state.upLoadVisible}
          projectId={this.props.projectId}
          stepId={this.props.stepId}
          account={this.props.account}
          onClose={() => {
            this.setState({
              upLoadVisible: false,
            });
          }}
          getDataList={this.getDataList}
        ></UpLoadModal>
        <div className="data-table-box" data-component="data-table-box">
          <Table
            dataSource={this.state.data}
            columns={this.columns}
            size="small"
            rowKey="key"
            pagination={false}
            scroll={{y: "5.8rem"}}
            loading={this.state.loadingState}
          />
          <div className="footer">
            <Pagination
              total={85}
              showTotal={total => `Total ${total} items`}
              defaultPageSize={20}
              defaultCurrent={1}
              size="small"
            />
          </div>
        </div>
        <Modal
          title="点击下载审核文件"
          visible={this.state.showFiles}
          closable={true}
          onCancel={() => {
            this.setState({
              showFiles: false,
            });
          }}
          footer={null}
        >
          {this.state.file ? this.state.file.map((item, index) => {
            return <p key={index + ""}><span>{item.file_name}</span>&nbsp;&nbsp;&nbsp;&nbsp;<a href={item.file_url}>点击查看</a></p>;
          })
            : <></>}
        </Modal>
        <Modal title="评审意见" visible={this.state.reviewResultsVisible}
          cancelText="关闭"
          okText="审核"
          confirmLoading={this.state.statusChangeLoading}
          closable={!this.state.statusChangeLoading}
          maskClosable={!this.state.statusChangeLoading}
          keyboard={!this.state.statusChangeLoading}
          onOk={() => {
            this.setState({
              statusChangeLoading: true,
            });
            let data = {
              new_status: this.state.statusChangeParams.value,
              submit_id: this.state.statusChangeParams.submitId,
            };
            ProjectBackend.AlterOneSubmit(data).then(res => {
              this.setState({
                statusChangeLoading: false,
                reviewResultsVisible: false,
              });
              this.getDataList();
              message.success("审核成功");
            }).catch(err => {
              message.error(err.message);
              this.setState({
                statusChangeLoading: false,
              });
            });
          }}
          onCancel={() => {
            if (this.state.statusChangeLoading) {
              message.warning("请等待");
            } else {
              this.setState({
                reviewResultsVisible: false,
              });
            }
          }}
        >
          <span>材料评审结果：</span>
          <Radio.Group name="radiogroup" value={this.state.statusChangeParams.value} onChange={(e) => {
            let statusChangeParams = Object.assign(this.state.statusChangeParams, {
              value: e.target.value,
            });
            this.setState({
              statusChangeParams,
            });
          }}>
            <Radio value="未审核">未审核</Radio>
            <Radio value="审核通过">审核通过</Radio>
            <Radio value="驳回">驳回</Radio>
          </Radio.Group>
        </Modal>
        <ModifyRecordModal
          show={this.state.modifyRecordVisible}
          submitId={this.state.selectedSubmitId}
          ref={this.modifyRecordRef}
          onCancel={() => {
            this.setState({
              modifyRecordVisible: false,
            });
          }}
          onComplete={() => {
            this.setState({
              modifyRecordVisible: false,
            });
          }}
        />
      </ModulaCard>
    );
  }
}

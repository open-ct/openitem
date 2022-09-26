import React, {Component} from "react";
import {Modal, Pagination, Radio, Space, Table, Tag, message} from "antd";
import {FileTextTwoTone} from "@ant-design/icons";
import ModulaCard from "./ModulaCard";
import ModifyRecordModal from "./ModifyRecordModal";
import "./DataTable.less";
import * as ProjectBackend from "./backend/ProjectBackend";
import i18next from "i18next";

export default class index extends Component {
    state = {
      showFiles: false,
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

    columns=[{
      title: i18next.t("step:Upload time"),
      dataIndex: "create_at",
      key: "create_at",
      align: "center",
      width: 150,
      render: (text, record) => (
        <span>{this.dateFilter(record.create_at)}</span>
      ),
    }, {
      title: i18next.t("step:Upload user"),
      dataIndex: "user_name",
      key: "user_name",
      align: "center",
      width: 120,
    }, {
      title: i18next.t("step:Testpaper"),
      dataIndex: "testpaper_id",
      key: "testpaper_id",
      align: "center",
    }, {
      title: i18next.t("step:Material title"),
      dataIndex: "name",
      key: "name",
      align: "center",
    }, {
      title: i18next.t("step:Material review"),
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
              }}>{i18next.t("step:Click to view")}<FileTextTwoTone /></span>
            ) : "无"
          }
        </Space>
      ),
    }, {
      title: i18next.t("step:Review"),
      key: "status",
      dataIndex: "status",
      align: "center",
      width: 100,
      render: (text, record) => {
        let levelList = [{
          mode: "未审核",
          color: "default",
        }, {
          mode: "通过",
          color: "#87D068",
        }, {
          mode: "驳回",
          color: "#FF5500",
        }];
        return (
          <Space size="middle">
            <Tag color={levelList.filter(item => {return item.mode == record.status;})[0].color} onClick={() => {
              this.setState({
                reviewResultsVisible: true,
                statusChangeParams: {
                  submitId: record.owner + "/" + record.name,
                  value: record.status,
                },
              });
            }} style={{cursor: "pointer"}}>{record.status}</Tag>
          </Space>
        );
      },
    }, {
      title: i18next.t("step:Notation materials"),
      dataIndex: "description",
      key: "description",
      align: "center",
      render: (text, record) => {
        return (<div>{i18next.t("step:Notation materials")}</div>);
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
        let data = res.data.filter(item => {
          return item.step_id == this.props.stepId;
        });
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
        message.error(err.message || i18next.t("general:Fail"));
        this.setState({
          loadingState: false,
        });
      });
    }

    render() {
      return (
        <ModulaCard title={this.props.title}>
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
            title={i18next.t("step:Download the audit file")}
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
              return <p key={index + ""}><span>{`${i18next.t("step:Material")}${index + 1}`}</span>&nbsp;&nbsp;&nbsp;&nbsp;<a href={item}>{i18next.t("step:Click to download")}</a></p>;
            })
              : <></>}
          </Modal>
          <Modal title={i18next.t("step:Review")} visible={this.state.reviewResultsVisible}
            cancelText={i18next.t("general:Cancel")}
            okText={i18next.t("general:Confirm")}
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
                message.success(i18next.t("general:Success"));
              }).catch(err => {
                message.error(err.message);
                this.setState({
                  statusChangeLoading: false,
                });
              });
            }}
            onCancel={() => {
              if (this.state.statusChangeLoading) {
                message.warning(i18next.t("general:Please wait"));
              } else {
                this.setState({
                  reviewResultsVisible: false,
                });
              }
            }}
          >
            <span>{i18next.t("step:Review Results")}&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <Radio.Group name="radiogroup" value={this.state.statusChangeParams.value} onChange={(e) => {
              let statusChangeParams = Object.assign(this.state.statusChangeParams, {
                value: e.target.value,
              });
              this.setState({
                statusChangeParams,
              });
            }}>
              <Radio value="未审核">{i18next.t("step:Audit")}</Radio>
              <Radio value="通过">{i18next.t("step:Pass")}</Radio>
              <Radio value="驳回">{i18next.t("step:Reject")}</Radio>
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

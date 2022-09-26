import React, {Component} from "react";
import {Button, Form, Input, Modal, Select, Space, Table, Tag, message} from "antd";
import {withRouter} from "react-router-dom";
import * as ProjectBackend from "./backend/ProjectBackend";
import ModalCard from "./ModulaCard";
import "./BuildTeam.less";
import {WarningTwoTone} from "@ant-design/icons";
import i18next from "i18next";

const {Search, TextArea} = Input;
const {confirm} = Modal;
const {Option} = Select;

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      loadingState: false,
      createLoading: false,
      roleChangeForm: {
        show: false,
        assignment_id: "",
        new_role: "",
        updateLoading: false,
      },
      addMemberForm: {
        show: false,
        loadingState: false,
        role: 2,
        user_id: null,
        userInfo: null,
      },
      emailForm: {
        show: false,
        loadingState: false,
        message: "",
        send_time: "",
        sender: "binary",
        destination: [],
        subject: "",
      },
      memberList: [],
    };
  }
  columns = [{
    title: i18next.t("buildteam:Name"),
    align: "center",
    key: "name",
    render: (text, record) => (
      <span>{record.info.name}</span>
    ),
  }, {
    title: i18next.t("buildteam:Age"),
    align: "center",
    key: "age",
    render: (text, record) => (
      <span>{record.info.birthday}</span>
    ),
  }, {
    title: i18next.t("buildteam:Gender"),
    align: "center",
    key: "gender",
    render: (text, record) => (
      <span>{record.info.gender ? i18next.t("buildteam:Male") : i18next.t("buildteam:Female")}</span>
    ),
  }, {
    title: i18next.t("buildteam:Job"),
    align: "center",
    key: "specialty",
    render: (text, record) => (
      <Tag color="processing">{record.info.owner}</Tag>
    ),
  }, {
    title: i18next.t("buildteam:Position"),
    align: "center",
    key: "post",
    render: (text, record) => (
      <span>{record.info.type}</span>
    ),
  }, {
    title: i18next.t("buildteam:Email"),
    align: "center",
    key: "email",
    render: (text, record) => (
      <Button type="link" onClick={() => {
        this.setState({
          emailForm: Object.assign(this.state.emailForm, {destination: [record.info.email], send_time: new Date().getTime().toString(), show: true}),
        });
      }}>
        {record.info.email}
      </Button>
    ),
  }, {
    title: i18next.t("buildteam:Organization"),
    align: "center",
    key: "organization",
    render: (text, record) => (
      <span>{record.info.signupApplication}</span>
    ),
  }, {
    title: i18next.t("buildteam:Address"),
    align: "center",
    key: "position",
    render: (text, record) => (
      <span>{record.info.region}</span>
    ),
  }, {
    title: i18next.t("buildteam:Phone"),
    align: "center",
    key: "phone",
    render: (text, record) => (
      <span>{record.info.phone}</span>
    ),
  }, {
    title: i18next.t("buildteam:Role"),
    align: "center",
    key: "role",
    render: (text, record) => {
      let roleList = [i18next.t("buildteam:Admin"), i18next.t("buildteam:Expert"), i18next.t("buildteam:Subject assistant"), i18next.t("buildteam:Teacher"), i18next.t("buildteam:External personnel")];
      return (
        <Tag color="green">{roleList[record.role - 1]}</Tag>
      );
    },
  }, {
    title: i18next.t("buildteam:State"),
    align: "center",
    key: "state",
    render: (text, record) => (
      <>
        {
          record.info.isOnline ? (
            <Tag color="#87d068">{i18next.t("buildteam:Confirmed")}</Tag>
          ) : (
            <Tag color="#f50">{i18next.t("buildteam:Unconfirmed")}</Tag>
          )
        }
      </>
    ),
  }, {
    title: i18next.t("general:Action"),
    align: "center",
    key: "management",
    render: (text, record) => (
      <Space size="middle">
        <Button type="link" onClick={() => {
          this.setState({
            roleChangeForm: Object.assign(this.state.roleChangeForm, {
              assignment_id: record.uuid,
              new_role: record.role,
              show: true,
            }),
          });
        }}>{i18next.t("buildteam:Change role")}</Button>
        <Button type="link" danger onClick={() => {
          confirm({
            icon: <WarningTwoTone />,
            content: i18next.t("buildteam:The deletion cannot be reversed. Whether to continue?"),
            okText: i18next.t("buildteam:Confirm to remove"),
            cancelText: i18next.t("buildteam:Cancel to remove"),
            onOk: () => {
              this.setState({
                loadingState: true,
              });
              ProjectBackend.RemoveAssignment(record.uuid).then(res => {
                this.setState({
                  loadingState: false,
                });
                message.success(i18next.t("general:Successfully delete"));
                this.getProjectMember();
              }).catch(err => {
                message.error(err.message || i18next.t("general:Fail to delete"));
                this.setState({
                  loadingState: false,
                });
              });
            },
            onCancel() {
              message.info(i18next.t("buildteam:Canceld"));
            },
          });
        }}>{i18next.t("buildteam:Remove member")}</Button>
      </Space>
    ),
  }]

  emailFormRef = React.createRef()

  componentDidMount() {
    this.getProjectMember();
  }

  getProjectMember = () => {
    this.setState({
      loadingState: true,
    });
    ProjectBackend.GetProjectAssignments(this.props.match.params.project_id.split("_").join("/")).then(res => {
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

  render() {
    return (
      <div className="build-team-page" data-component="build-team-page">
        <ModalCard
          title={i18next.t("buildteam:Member")}
          right={(
            <Button type="primary" size="small" onClick={() => {
              this.setState({
                addMemberForm: Object.assign(this.state.addMemberForm, {show: true}),
              });
            }}>{i18next.t("general:Add")}</Button>
          )}
        >
          <div className="member-list">
            <Table
              columns={this.columns}
              pagination={false}
              dataSource={this.state.memberList}
              size="small"
              loading={this.state.loadingState}
            />
          </div>
        </ModalCard>
        <Modal
          title={i18next.t("buildteam:Change role")}
          visible={this.state.roleChangeForm.show}
          okText={i18next.t("general:Confirm")}
          cancelText={i18next.t("general:Cancel")}
          closable={!this.state.roleChangeForm.updateLoading}
          keyboard={!this.state.roleChangeForm.updateLoading}
          maskClosable={!this.state.roleChangeForm.updateLoading}
          confirmLoading={this.state.roleChangeForm.updateLoading}
          onOk={() => {
            this.setState({
              roleChangeForm: Object.assign(this.state.roleChangeForm, {updateLoading: true}),
            });
            let data = {
              assignment_id: this.state.roleChangeForm.assignment_id,
              new_role: this.state.roleChangeForm.new_role,
            };
            ProjectBackend.ChangeAssignment(data).then(res => {
              this.setState({
                roleChangeForm: Object.assign(this.state.roleChangeForm, {updateLoading: false, show: false}),
              });
              this.getProjectMember();
              message.success(i18next.t("general:Success"));
            }).catch(err => {
              message.error(err.message || i18next.t("general:Error"));
              this.setState({
                roleChangeForm: Object.assign(this.state.roleChangeForm, {updateLoading: false}),
              });
            });
          }}
          onCancel={() => {
            if (this.state.roleChangeForm.updateLoading) {
              message.error(i18next.t("general:Operation uninterruptible"));
            } else {
              this.setState({
                roleChangeForm: Object.assign(this.state.roleChangeForm, {show: false}),
              });
            }
          }}
        >
          <label style={{lineHeight: ".6rem"}}>{i18next.t("buildteam:New roles") + ":"}</label>
          <Select value={this.state.roleChangeForm.new_role} style={{width: "100%"}} onChange={(e) => {
            this.setState({
              roleChangeForm: Object.assign(this.state.roleChangeForm, {new_role: e}),
            });
          }}>
            <Option value={1}>{i18next.t("buildteam:Admin")}</Option>
            <Option value={2}>{i18next.t("buildteam:Expert")}</Option>
            <Option value={3}>{i18next.t("buildteam:Subject assistant")}</Option>
            <Option value={4}>{i18next.t("buildteam:Teacher")}</Option>
            <Option value={5}>{i18next.t("buildteam:External personnel")}</Option>
          </Select>
        </Modal>
        <Modal
          title={i18next.t("general:Add")}
          visible={this.state.addMemberForm.show}
          okText={i18next.t("general:Confirm")}
          cancelText={i18next.t("general:Cancel")}
          closable={!this.state.addMemberForm.loadingState}
          keyboard={!this.state.addMemberForm.loadingState}
          maskClosable={!this.state.addMemberForm.loadingState}
          confirmLoading={this.state.addMemberForm.loadingState}
          onOk={() => {
            this.setState({
              addMemberForm: Object.assign(this.state.addMemberForm, {loadingState: true}),
            });
            let data = new Object();
            data.project_id = this.props.match.params.project_id.split("_").join("/");
            data.user_id = this.state.addMemberForm.user_id;
            data.role = this.state.addMemberForm.role;
            ProjectBackend.MakeOneAssignment(data).then(res => {
              message.success("success");
              this.setState({
                addMemberForm: Object.assign(this.state.addMemberForm, {userInfo: null, loadingState: false, show: false}),
              });
              this.getProjectMember();
            });
          }}
          onCancel={() => {
            if (this.state.addMemberForm.loadingState) {
              message.error(i18next.t("general:Operation uninterruptible"));
            } else {
              this.setState({
                addMemberForm: Object.assign(this.state.addMemberForm, {show: false}),
              });
            }
          }}
        >
          <label style={{lineHeight: ".6rem"}}>{i18next.t("buildteam:Search user")}</label>
          <Search placeholder={i18next.t("buildteam:Please enter the user account to be added")} onSearch={(e) => {
            this.setState({
              addMemberForm: Object.assign(this.state.addMemberForm, {loadingState: true}),
            });
            ProjectBackend.GetUserByName(e).then(res => {
              let userInfo = res;
              if(userInfo) {
                this.setState({
                  addMemberForm: Object.assign(this.state.addMemberForm, {user_id: userInfo.id, userInfo: userInfo, loadingState: false}),
                });
              }else{
                message.warn(i18next.t("buildteam:Not found"));
                this.setState({
                  addMemberForm: Object.assign(this.state.addMemberForm, {loadingState: false}),
                });
              }

            });
          }} enterButton />
          {
            this.state.addMemberForm.userInfo != null ? (
              <>
                <label style={{lineHeight: ".6rem"}}>{i18next.t("buildteam:User name")}</label>
                <div>{this.state.addMemberForm.userInfo.displayName}</div>
                <label style={{lineHeight: ".6rem"}}>{i18next.t("buildteam:Change role")}</label>
                <Select value={this.state.addMemberForm.role} style={{width: "100%"}} onChange={(e) => {
                  this.setState({
                    addMemberForm: Object.assign(this.state.addMemberForm, {role: e}),
                  });
                }}>
                  <Option value={2}>{i18next.t("buildteam:Expert")}</Option>
                  <Option value={3}>{i18next.t("buildteam:Subject assistant")}</Option>
                  <Option value={4}>{i18next.t("buildteam:Teacher")}</Option>
                  <Option value={5}>{i18next.t("buildteam:External personnel")}</Option>
                </Select>
              </>
            ) : (<></>)
          }
        </Modal>
        <Modal
          title={i18next.t("buildteam:Send email")}
          visible={this.state.emailForm.show}
          okText={i18next.t("general:Confirm")}
          cancelText={i18next.t("general:Cancel")}
          closable={!this.state.emailForm.loadingState}
          keyboard={!this.state.emailForm.loadingState}
          maskClosable={!this.state.emailForm.loadingState}
          confirmLoading={this.state.emailForm.loadingState}
          // onOk={() => {
          //   this.emailFormRef.current.validateFields().then(formData => {
          //     let data = {
          //       body: {
          //         message: formData.message,
          //         send_time: this.state.emailForm.send_time,
          //         sender: this.state.emailForm.sender
          //       },
          //       destination: this.state.emailForm.destination,
          //       subject: formData.subject
          //     };
          //     this.setState({
          //       emailForm: Object.assign(this.state.emailForm, {loadingState: true})
          //     });
          //     request({
          //       url: baseURL + "/review/noticer/email",
          //       // url:"http://49.232.73.36:8081/review/noticer/email",
          //       method: "POST",
          //       data
          //     }).then(res => {
          //       this.setState({
          //         emailForm: Object.assign(this.state.emailForm, {loadingState: false, show: false})
          //       });
          //       this.emailFormRef.current.resetFields();
          //       message.success("发送成功");
          //     }).catch(err => {
          //       this.setState({
          //         emailForm: Object.assign(this.state.emailForm, {loadingState: false})
          //       });
          //       message.error(err.message || "请求错误");
          //     });
          //   }).catch(err => {
          //     message.warning("请正确填写邮件内容");
          //   });
          // }}

          onOk={() => { }}
          onCancel={() => {
            if (this.state.emailForm.loadingState) {
              message.error(i18next.t("general:Operation uninterruptible"));
            } else {
              this.emailFormRef.current.resetFields();
              this.setState({
                emailForm: Object.assign(this.state.emailForm, {show: false}),
              });
            }
          }}
        >
          <Form
            name="emailForm"
            labelCol={{span: 4}}
            wrapperCol={{span: 20}}
            initialValues={this.state.emailForm}
            autoComplete="off"
            ref={this.emailFormRef}
          >
            <Form.Item
              label={i18next.t("buildteam:Email topic")}
              name="subject"
              rules={[{required: true, message: "Please enter the subject of your email"}]}
            >
              <Input placeholder="Please enter the subject of your email" />
            </Form.Item>

            <Form.Item
              label={i18next.t("buildteam:Email topic")}
              name="message"
              rules={[{required: true, message: "Please enter the content of your email"}]}
            >
              <TextArea placeholder="Please enter the content of your email" autoSize={{minRows: 2, maxRows: 6}} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default withRouter(index);

import React, {Component} from "react";
import {Button, Divider, Form, Input, Modal, Select, Space, Tag, message} from "antd";
import {withRouter} from "react-router-dom";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import * as PorjectBackend from "./backend/ProjectBackend";

const {Option} = Select;
const {confirm} = Modal;

class index extends Component {

    state = {
      form: {
        project: null,
        subject: null,
        content: [],
        ability: [],
        type: null,
      },
      projectLoading: false,
      projectList: [],
      uid: null,
      name: null,
      contentOption: [{
        value: "数与代数",
      }, {
        value: "历史认知",
      }, {
        value: "积累与运用",
      }],
      abilityOption: [{
        value: "听力",
      }, {
        value: "了解",
      }, {
        value: "认识与知识",
      }, {
        value: "古诗文积累",
      }],
    }

    formRef = React.createRef()

    titleList=[{
      type: "create",
      value: "上传试题信息",
    }, {
      type: "update",
      value: "编辑试题信息",
    }, {
      type: "edit",
      value: "编辑试题信息",
    }, {
      type: "create-paper",
      value: "上传试卷信息",
    }, {
      type: "update-paper",
      value: "更新试卷信息",
    }]

    componentDidMount() {
      this.getProjectList();
    }
    getProjectList = () => {
      this.setState({
        projectLoading: true,
      });
      let uid = this.props.uid ? this.props.uid : this.props.match.params.uid;
      PorjectBackend.GetUserAssignments(uid).then(res => {
        let id_list = [];
        if(res.data) {
          for(let i = 0;i < res.data.length;i++) {
            id_list.push(res.data[i].project_id);
          }
        }
        PorjectBackend.GetProjectList(id_list).then(res => {
          this.setState({
            projectList: Object.values(res.data),
            projectLoading: false,
          });
        }).catch(err => {
          message.error(err.message || "加载失败，请重试");
          this.setState({
            projectLoading: false,
          });
        });
      }).catch(err => {
        message.error(err.message || "加载失败，请重试");
        this.setState({
          projectLoading: false,
        });
      });
    }
    tagRender = (props) => {
      let colorList = ["gold", "lime", "green", "cyan"];
      const {label, closable, onClose} = props;
      const onPreventMouseDown = event => {
        event.preventDefault();
        event.stopPropagation();
      };
      return (
        <Tag
          color={colorList[Math.floor(Math.random() * (3))]}
          onMouseDown={onPreventMouseDown}
          closable={closable}
          onClose={onClose}
          style={{marginRight: 3}}
        >
          {label}
        </Tag>
      );
    }
    onNameChange = (event) => {
      this.setState({
        name: event.target.value,
      });
    };
    firstAddItem = (e) => {
      e.preventDefault();
      if (this.state.name.length > 0 && (this.state.contentOption.map(item => item.value).indexOf(this.state.name) === -1)) {
        this.setState({
          contentOption: this.state.contentOption.concat({value: (this.state.name)}),
          name: "",
        });
      }
      setTimeout(() => {
        this.inputRef.current?.focus();
      }, 0);
    };
    secondAddItem = (e) => {
      e.preventDefault();
      if(this.state.name.length > 0 && (this.state.abilityOption.map(item => item.value).indexOf(this.state.name) === -1)) {
        this.setState({
          abilityOption: this.state.abilityOption.concat({value: (this.state.name)}),
          name: "",
        });
      }
      setTimeout(() => {
        this.inputRef.current?.focus();
      }, 0);
    };
    render() {
      return (
        <Modal
          title={this.titleList[this.titleList.findIndex(item => item.type === this.props.type)].value}
          cancelText="取消"
          okText={this.props.type === "create" || this.props.type === "create-paper" ? "下一步" : "保存"}
          visible={this.props.show}
          onOk={() => {
            this.formRef.current.validateFields().then(data => {
              if(this.props.type === "create") {
                this.props.history.push(`/proposition-paper/upload-questions/${data.project}/${data.subject}/${data.ability}/${data.content}/${data.type}/${this.props.uid}/$`, {owner: this.state.owner});
              }else if(this.props.type === "update") {
                let that = this;
                confirm({
                  icon: <ExclamationCircleOutlined />,
                  content: "此操作将覆盖当前撰写的试题，是否继续？",
                  onOk() {
                    that.props.onClose();
                    that.props.history.push(`/proposition-paper/upload-questions/${data.project}/${data.subject}/${data.ability}/${data.content}/${data.type}`, {owner: this.state.owner});
                  },
                  onCancel() {
                    that.props.onClose();
                  },
                });
              }else if(this.props.type === "edit") {
                this.props.onClose();
              }else if(this.props.type === "create-paper") {
                this.props.history.push(`/proposition-paper/create-paper/${data.project}/${data.subject}/${data.ability}/${data.content}/${data.type}/${this.props.uid}`, {owner: this.state.owner});
              }else if(this.props.type === "update-paper") {
                let that = this;
                confirm({
                  icon: <ExclamationCircleOutlined />,
                  content: "此操作将覆盖当前撰写的试卷，是否继续？",
                  onOk() {
                    that.props.onClose();
                    that.props.history.push(`/proposition-paper/create-paper/${data.project}/${data.subject}/${data.ability}/${data.content}/${data.type}/${this.props.uid}`, {owner: this.state.owner});
                  },
                  onCancel() {
                    that.props.onClose();
                  },
                });
              }else{
                message.error("组件参数异常，失败！");
                this.props.onClose();
              }
            }).catch(err => {
              message.warning("请按要求选择选项");
            });

          }}
          onCancel={() => {
            this.formRef.current.resetFields();
            this.props.onClose();
          }}
        >
          <div className="upLoad-question-title">
            <span>该信息用于标记本张试卷</span>
          </div>
          <Form
            labelCol={{span: 5}}
            wrapperCol={{span: 19}}
            labelAlign="left"
            ref={this.formRef}
            initialValues={this.state.form}
          >
            <Form.Item
              name="project"
              label="项目"
              rules={[{required: true, message: "请选择项目名称"}]}
            >
              <Select placeholder="选择项目名称" loading={this.state.projectLoading} onFocus={this.getProjectList} onSelect={(e, data) => {
                let from = Object.assign(this.state.form, {project: e});
                this.setState({
                  from,
                  owner: data.owner,
                });
              }}>
                {
                  this.state.projectLoading ? (
                    <></>
                  ) : this.state.projectList.map(item => (
                    <Option key={item.owner + "/" + item.name} owner={item.owner} value={item.basic_info.name}>{item.basic_info.name}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              name="subject"
              label="学科"
              rules={[{required: true, message: "请选择学科"}]}
            >
              <Select placeholder="选择学科" loading={this.state.projectLoading} onFocus={() => {
                if(!this.state.form.project) {
                  message.warning("请先选择项目");
                }
              }} onSelect={(e) => {
                let form = Object.assign(this.state.form, {subject: e});
                this.setState({
                  form,
                });
              }}>
                {
                  !this.state.form.project ? (
                    <></>
                  ) : this.state.projectList[this.state.projectList.findIndex(item => item.name === this.state.form.project)].basic_info.subjects.map((item, index) => (
                    <Option key={index} value={item}>{item}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              name="content"
              label="内容纬度"
              rules={[{required: true, message: "请选择内容纬度"}]}
            >
              <Select
                mode="multiple"
                showArrow
                tagRender={this.tagRender}
                style={{width: "100%"}}
                options={this.state.contentOption}
                onChange={(e) => {
                  let form = Object.assign(this.state.form, {content: e});
                  this.setState({
                    form,
                  });
                }}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider
                      style={{
                        margin: "8px 0",
                      }}
                    />
                    <Space
                      style={{
                        padding: "0 8px 4px",
                      }}
                    >
                      <Input
                        placeholder="添加标签"
                        ref={this.inputRef}
                        value={this.state.name}
                        onChange={this.onNameChange}
                      />
                      <Button type="text" icon={<PlusOutlined />} onClick={this.firstAddItem}>
                      填入
                      </Button>
                    </Space>
                  </>
                )}
              />
            </Form.Item>
            <Form.Item
              name="ability"
              label="能力维度"
              rules={[{required: true, message: "请选择能力维度"}]}
            >
              <Select
                mode="multiple"
                showArrow
                tagRender={this.tagRender}
                style={{width: "100%"}}
                options={this.state.abilityOption}
                onChange={(e) => {
                  let form = Object.assign(this.state.form, {ability: e});
                  this.setState({
                    form,
                  });
                }}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider
                      style={{
                        margin: "8px 0",
                      }}
                    />
                    <Space
                      style={{
                        padding: "0 8px 4px",
                      }}
                    >
                      <Input
                        placeholder="添加标签"
                        ref={this.inputRef}
                        value={this.state.name}
                        onChange={this.onNameChange}
                      />
                      <Button type="text" icon={<PlusOutlined />} onClick={this.secondAddItem}>
                      填入
                      </Button>
                    </Space>
                  </>
                )}
              />
            </Form.Item>
            <Form.Item
              name="type"
              label={this.props.type === "create-paper" ? "标题" : "题型"}
              rules={[{required: true, message: "请选择题型"}]}
            >
              <Input onBlur={(e) => {
                let form = Object.assign(this.state.form, {type: e});
                this.setState({
                  form,
                });
              }}></Input>
            </Form.Item>
          </Form>
        </Modal>
      );
    }
}

export default withRouter(index);

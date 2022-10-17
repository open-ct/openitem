// 上传文件弹出框组件

import React, {Component} from "react";
import {Form, Input, Modal, Upload, message} from "antd";
import {InboxOutlined} from "@ant-design/icons";
import "./UpLoadModal.less";
import * as PropositionBackend from "./backend/PropositionBackend";
import * as ProjectBackend from "./backend/ProjectBackend";

// const {Option} = Select;

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      testPaperList: [],
      selectLoading: false,
      upLoadFileList: [],
      upLoadState: false, // 用于控制文件上传
      createLoading: false,
      submitForm: {
        type: 1,
      },
    };
  }

  upLoadFormRef = React.createRef()

  uuid = (len, radix) => {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      for (i = 0; i < len; i++) {uuid[i] = chars[0 | Math.random() * radix];}
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
      uuid[14] = "4";
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join("");
  }

  getTestPaperList = () => {
    this.setState({
      selectLoading: true,
    });
    let pid = this.props.projectId.split("_").join("/");
    ProjectBackend.GetProjectTempTestpaper(pid).then(res => {
      this.setState({
        testPaperList: res.data,
        selectLoading: false,
      });
    }).catch(err => {
      message.error(err.message);
      this.setState({
        selectLoading: false,
      });
    });
  }

  upLoadFile=(info) => {
    this.setState({
      upLoadState: true,
    });
    message.info("开始上传文件：" + info.file.name);
    const formData = new FormData();
    formData.append("file", info.file);
    formData.append("source_project", this.props.projectId.split("_").join("/"));
    formData.append("tags", "无");
    formData.append("description", "步骤附件");
    PropositionBackend.UploadFile(formData).then(res => {
      let upLoadFileList = Object.assign(this.state.upLoadFileList, {});
      upLoadFileList[upLoadFileList.length - 1].status = "done";
      upLoadFileList[upLoadFileList.length - 1].uid = this.uuid(32, 36);
      upLoadFileList[upLoadFileList.length - 1].file_url = res.data;
      upLoadFileList[upLoadFileList.length - 1].file_name = res.data2;
      this.setState({
        upLoadFileList,
        upLoadState: false,
      });
      message.success("文件上传成功");
    }).catch(err => {
      let upLoadFileList = Object.assign(this.state.upLoadFileList, {});
      upLoadFileList[upLoadFileList.length - 1].status = "error";
      upLoadFileList[upLoadFileList.length - 1].uid = this.uuid(32, 36);
      this.setState({
        upLoadFileList,
        upLoadState: false,
      });
      message.error("文件上传失败");
      message.warn("可能存在非法文件名");
    });
  }

  render() {
    return (
      <Modal title="上传材料"
        width="6.26rem"
        okText="确认创建"
        cancelText="放弃创建"
        visible={this.props.show}
        closable={!this.state.createLoading}
        keyboard={!this.state.createLoading}
        confirmLoading={this.state.createLoading}
        onCancel={() => {
          if (this.state.createLoading) {
            message.info("请等待");
          } else {
            this.upLoadFormRef.current.resetFields();
            this.setState({
              upLoadFileList: [],
            });
            this.props.onClose();
          }
        }}
        onOk={() => {
          if (!this.upLoadFormRef.current.getFieldValue("title")) {
            message.warn("请输入材料组标题");
            return;
          }
          let file = this.state.upLoadFileList.filter(item => {
            return item.status === "done";
          });
          if (this.state.upLoadFileList.length === 0 || file.length === 0) {
            message.warning("请至少上传一个文件");
            return;
          } else {
            this.setState({
              createLoading: true,
            });
            let data = {
              owner: this.props.account.id,
              name: this.upLoadFormRef.current.getFieldValue("title"),
              step_id: this.props.stepId,
              testpaper_id: this.upLoadFormRef.current.getFieldValue("testpaper_id"),
              title: "title",
              description: "description",
              submitter: this.props.account.id,
              file: [].concat(file),
              contents: [],
            };
            ProjectBackend.MakeOneSubmit(data).then(res => {
              message.success("提交成功");
              this.setState({
                createLoading: false,
                upLoadFileList: [],
              });
              this.props.getDataList();
              this.props.onClose();
            }).catch(err => {
              this.setState({
                createLoading: false,
              });
              message.error("提交失败");
            });
          }
        }}
      >
        <div className="up-load-modal-box" data-component="up-load-modal-box">
          <Form
            name="material"
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
            initialValues={this.state.submitForm}
            ref={this.upLoadFormRef}
          >
            {/* <Form.Item
              name="testpaper_id"
              label="试卷"
              rules={[{required: true, message: "请选择所属试卷"}]}
            >
              <Select placeholder="选择所属试卷" loading={this.state.selectLoading} onFocus={this.getTestPaperList}>
                {
                  this.state.selectLoading ? (
                    <></>
                  ) : (this.state.testPaperList ? this.state.testPaperList.map(item => (
                    <Option key={item.uuid} value={item.uuid}>{item.title}</Option>
                  )) : <></>)
                }
              </Select>
            </Form.Item> */}

            <Form.Item
              label="材料标题"
              name="title"
              className="title"
              rules={[{required: true}]}
            // extra="新材料自动生成材料编号，不可修改"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="上传"
              rules={[{required: true}]}
              // labelCol={{span: 4}}
              required={true}
            >
              <Upload.Dragger
                name="filename"
                multiple={true}
                fileList={this.state.upLoadFileList}
                beforeUpload={(e) => {
                  if (this.state.upLoadState || this.state.createLoading) {
                    message.warning("当前存在上传中文件，请等待");
                    return false;
                  } else {
                    let upLoadFileList = [...this.state.upLoadFileList];
                    upLoadFileList.push({
                      name: e.name,
                      status: "uploading",
                    });
                    this.setState({
                      upLoadFileList,
                    });
                    return true;
                  }
                }}
                customRequest={this.upLoadFile.bind(this)}
                onRemove={(e) => {
                  let upLoadFileList = Object.assign(this.state.upLoadFileList, {});
                  upLoadFileList.splice(upLoadFileList.findIndex(item => item.uid === e.uid), 1);
                  this.setState({
                    upLoadFileList,
                  });
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint" style={{fontSize: ".1rem"}}>Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
              </Upload.Dragger>

            </Form.Item>
          </Form>
        </div>
      </Modal>
    );
  }
}

import React, {Component} from "react";
import {Button, Upload, message} from "antd";
import ModulaCard from "./ModulaCard";
import CalendarButton from "./CalendarButton";
import {FieldTimeOutlined, LinkOutlined} from "@ant-design/icons";
import "./TaskRequirements.less";
import * as ProjectBackend from "./backend/ProjectBackend";
import * as PropositionBackend from "./backend/PropositionBackend";

export default class index extends Component {

    state = {
      stepInfo: {},
      loadingState: false,
      upLoadState: false,
    }

    upLoadFile(info) {
      this.setState({
        upLoadState: true,
      });
      message.info("开始上传文件：" + info.file.name);
      const formData = new FormData();
      formData.append("name", info.file.name);
      formData.append("file", info.file);
      formData.append("source_project", this.props.projectId.split("_").join("/"));
      formData.append("tags", "无");
      formData.append("description", "步骤附件");
      PropositionBackend.UploadFile(formData).then(res => {
        const data = {
          files_ids: [res.data],
          step_id: this.props.stepId,
        };
        ProjectBackend.UploadStepAttachment(data).then(res => {
          this.setState({
            upLoadState: false,
          });
          this.getStepInfo();
          message.success("文件上传成功");
        }).catch(err => {
          this.setState({
            upLoadState: false,
          });
          message.error("文件上传失败");
        });
      }).catch(err => {
        this.setState({
          upLoadState: false,
        });
        message.error("文件上传失败");
      });
    }

    // 根据不同身份加载不同操作情况
    operationRender = () => {
      return (<div className="choice-box">
        <CalendarButton label="截止时间：2021年8月20日" icon={<FieldTimeOutlined />} onDateChange={(date) => {
          message.error("改操作暂不可用");
        }} />
        <Upload
          name="filename"
          showUploadList={false}
          beforeUpload={() => {
            if (this.state.upLoadState) {
              message.error("当前存在上传中文件，请勿频繁上传！");
              return false;
            }
            return true;
          }}
          customRequest={this.upLoadFile.bind(this)}
        >
          <Button size="small" icon={<LinkOutlined />} style={{marginLeft: ".1246rem"}}>{
            this.state.stepInfo.attachments ? "覆盖文件" : "上传文件"
          }</Button>
        </Upload>
      </div>);
      // let operationDomList = [() => (
      //   <div className="choice-box">
      //     <CalendarButton label="截止时间：2021年8月20日" icon={<FieldTimeOutlined />} onDateChange={(date) => {
      //       message.error("改操作暂不可用");
      //     }} />
      //     <Upload
      //       name="filename"
      //       showUploadList={false}
      //       beforeUpload={() => {
      //         if (this.state.upLoadState) {
      //           message.error("当前存在上传中文件，请勿频繁上传！");
      //           return false;
      //         }
      //         return true;
      //       }}
      //       customRequest={this.upLoadFile.bind(this)}
      //     >
      //       <Button size="small" icon={<LinkOutlined />} style={{marginLeft: ".1246rem"}}>{
      //         this.state.stepInfo.attachments ? "已上传" : "暂无文件"
      //       }</Button>
      //     </Upload>
      //   </div>
      // ), () => (
      //   <div className="choice-box">
      //     <Button size="small" style={{marginRight: ".1246rem"}} icon={<FieldTimeOutlined />}>截止时间：2021年8月20日</Button>
      //     <Button size="small" icon={<LinkOutlined />} onClick={this.downLoadFile}>{
      //       this.state.stepInfo.attachments ? "已上传" : "暂无文件"
      //     }</Button>
      //   </div>
      // ), () => (
      //   <div className="choice-box">
      //     <Button size="small" style={{marginRight: ".1246rem"}} icon={<FieldTimeOutlined />}>截止时间：2021年8月20日</Button>
      //     <Button size="small" icon={<LinkOutlined />} onClick={this.downLoadFile}>{
      //       this.state.stepInfo.attachments ? "已上传" : "暂无文件"
      //     }</Button>
      //   </div>
      // )];
      // return operationDomList[(this.props.role === "1" || this.props.role === "5") ? 0 : this.props.role - 2]();
    }

    componentDidMount() {
      this.getStepInfo();
    }

    getStepInfo = () => {
      this.setState({
        loadingState: true,
      });
      ProjectBackend.GetOneStepInfo(this.props.stepId).then(res => {
        this.setState({
          stepInfo: res.data,
          loadingState: false,
        });
      }).catch(err => {
        this.setState({
          loadingState: false,
        });
      });
    }

    render() {
      return (
        <ModulaCard title="任务要求">
          {
            this.state.loadingState ? (
              <></>
            ) : (
              <div className="task-requirements-box" data-component="task-requirements-box">
                <div className="describe-box">
                  <div className="context">
                    <a href={this.state.stepInfo.attachments ? this.state.stepInfo.attachments[0] : "*"}>{this.state.stepInfo.attachments ? "任务要求文件(点击下载)" : "无"}</a>
                  </div>
                  <div className="btn-box">
                    {this.props.role == 1 ? (<Button type="link">删除</Button>) : ""}
                  </div>
                </div>
                {this.operationRender()}
              </div>
            )
          }
        </ModulaCard>
      );
    }
}

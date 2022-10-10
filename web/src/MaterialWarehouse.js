// 封装的材料仓库组件
import React, {Component} from "react";
import {Empty, Input, Spin, Upload, message} from "antd";
import ModulaCard from "./ModulaCard";
import {FileExcelFilled, FileMarkdownFilled, FilePptFilled, FileTextFilled, FileZipFilled, PlusOutlined} from "@ant-design/icons";
import "./MaterialWarehouse.less";
import * as ProjectBackend from "./backend/ProjectBackend";
import * as PropositionBackend from "./backend/PropositionBackend";

const {Search} = Input;

export default class inedx extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fileType: [<FileTextFilled key={1} />, <FileExcelFilled key={2} />, <FileZipFilled key={3} />, <FileMarkdownFilled key={4} />, <FilePptFilled key={5} />],
      fileList: [],
      upLoadVisible: false,
      getFileLoading: false,
      upLoadState: false,
    };
  }

  componentDidMount() {
    this.getFileList();
  }

  getFileList = () => {
    this.setState({
      getFileLoading: true,
    });
    ProjectBackend.GetOneStepInfo(this.props.stepId).then(res => {
      res.data.attachments ?
        this.setState({
          fileList: [].concat(res.data.attachments),
          getFileLoading: false,
        }) : null;
    }).catch(err => {
      this.setState({
        getFileLoading: false,
      });
      message.error(err.message);
    });
  }

  fileViewLoader = () => {
    if (this.state.fileList == null) {
      return (
        <div className="empty-state-box">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      );
    } else {
      return this.state.fileList.map((item, index) => (
        <div className="file-item" key={index}>
          <a href={item.file_url}>
            <div className="icon" style={{fontSize: "0.4rem"}}>
              <FileTextFilled key={index} style={{width: "100%", height: "0.5rem"}} />
            </div>
            <div className="name" title={item.file_name} style={{width: "1rem", overflow: "hidden", textOverflow: "ellipsis", textAlign: "center"}}>
              {item.file_name}
            </div>
          </a>
        </div>
      ));
    }
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
      let itemFile = Object.assign({}, {file_url: res.data, file_name: res.data2});
      let newFileList = this.state.fileList;
      newFileList.push(itemFile);
      const data = {
        files_ids: newFileList,
        step_id: this.props.stepId,
      };
      ProjectBackend.UploadStepAttachment(data).then(res => {
        this.setState({
          upLoadState: false,
        });
        message.success("文件上传成功");
        this.getFileList();
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
      message.error(err.message);
    });
  }

  render() {
    return (
      <ModulaCard title="材料仓库" right={<Search placeholder="input search text" size="small" style={{width: 200}} />}>
        <div className="material-warehouse-box" data-component="material-warehouse-box">
          <div className="container">
            {
              // this.props.role === "3" || (this.props.role === "4" && this.props.stepName !== "测试框架与论证报告") ? (
              // this.props.stepName == "测试框架与论证报告" ? (
              this.props.role ? (
                <div className="upload-download-box" onClick={() => {
                  // this.setState({
                  //   upLoadVisible: true,
                  // });
                }}>
                  <Upload
                    name="attachment"
                    showUploadList={false}
                    listType="picture-card"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={() => {
                      if (this.state.upLoadState) {
                        message.error("当前存在上传中文件，请勿频繁上传！");
                        return false;
                      }
                      return true;
                    }}
                    customRequest={this.upLoadFile.bind(this)}
                  >
                    <div className="file-load-btn" onClick={() => {
                    }}>
                      <PlusOutlined />
                      <div style={{marginTop: 8, width: "100%"}}>上传</div>
                    </div>
                  </Upload>
                </div>
              ) : (
                <></>
              )
            }
            <Spin spinning={this.state.upLoadState}>
              {this.fileViewLoader()}
            </Spin>
          </div>
        </div>
      </ModulaCard>
    );
  }
}

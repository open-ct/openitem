import React, {Component} from "react";
import {Col, Row, Statistic} from "antd";
import ModulaCard from "./ModulaCard";
import "./CompletionStatus.less";
import i18next from "i18next";

export default class index extends Component {

    state = {
      status: {},
      loadingState: false,
    }

    getStatusList = () => {
      this.setState({
        loadingState: true,
      });
      // request({
      //     url:baseURL+`/review/proj/step/stat/${this.props.stepId}`,
      //     // url:`http://49.232.73.36:8081/review/proj/step/stat/${this.props.stepId}`,
      //     method:"GET"
      // }).then(res => {
      //     this.setState({
      //         status:res.data,
      //         loadingState:false
      //     });
      // }).catch(err => {
      //     this.setState({
      //         loadingState:false
      //     });
      // });
      var res = {
        "operation_code": 1000,
        "message": "",
        "data": {
          "pass": 0,
          "pass_rate": 0,
          "return": 0,
          "to_audit": 0,
          "to_correct": 0,
          "to_upload": 0,
          "total": 0,
        },
      };
      this.setState({
        status: res.data,
        loadingState: false,
      });
    }

    componentDidMount() {
      this.getStatusList();
    }

    render() {
      return (
        <ModulaCard title={i18next.t("step:Performance")}>
          {
            this.state.loadingState ? (
              <></>
            ) : (
              <div className="completion-status-box" data-component="completion-status-box">
                <div className="left-box">
                  <div className="title">
                    <span>{this.props.title}</span>
                  </div>
                  <div className="value-list">
                    <Row gutter={16}>
                      <Col span={12}>
                        <Statistic title={i18next.t("step:Total")} value={this.state.status.total} />
                      </Col>
                      <Col span={12}>
                        <Statistic title={i18next.t("step:Rate")} value={this.state.status.pass_rate} suffix="%" />
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="right-box">
                  <Row gutter={16} style={{width: "4.2rem"}}>
                    <Col span={8}>
                      <Statistic title={<div className="statistic-item-title"><div className="circle" style={{backgroundColor: "#87D068"}}></div>{i18next.t("step:Pass")}</div>} value={this.state.status.pass} />
                    </Col>
                    <Col span={8}>
                      <Statistic title={<div className="statistic-item-title"><div className="circle" style={{backgroundColor: "#FF5500"}}></div>{i18next.t("step:Reject")}</div>} value={this.state.status.return} />
                    </Col>
                    {/* <Col span={5}>
                      <Statistic title={<div className="statistic-item-title"><div className="circle" style={{backgroundColor: "#FF5500"}}></div>{i18next.t("step:Not uploaded")}</div>} value={this.state.status.to_upload} />
                    </Col> */}
                    <Col span={8}>
                      <Statistic title={<div className="statistic-item-title"><div className="circle" style={{backgroundColor: "#2DB7F5"}}></div>{i18next.t("step:Audit")}</div>} value={this.state.status.to_audit} />
                    </Col>
                    {/* <Col span={5}>
                      <Statistic title={<div className="statistic-item-title"><div className="circle" style={{backgroundColor: "#2DB7F5"}}></div>{i18next.t("step:Modified")}</div>} value={this.state.status.to_correct} />
                    </Col> */}
                  </Row>
                </div>
              </div>
            )
          }
        </ModulaCard>
      );
    }
}

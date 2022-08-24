import {Component} from "react";
import {Button, Col, Row} from "antd";
import "./HistoryQuestion.less";
import BraftEditor from "braft-editor";

export default class HistoryQuestion extends Component {
  state = {
    editorState: BraftEditor.createEditorState(),
  };
  getQuestionInfo=(info) => {
    this.setState({
      question: info,
    });
  }
  render() {
    return (
      <div>{this.state.question ? this.state.question.map((item, index) => {
        return (
          <div key={index} className="history-question-item" data-component="history-question-item">
            <Row gutter={[16, 16]} className="queston-content">
              <Col span="16" style={{overflow: "hidden"}}>
                {BraftEditor.createEditorState(item.info.body).toText()}
                {this.state.editorState.toText()}
              </Col>
              <Col span="8" className="question-params">
                <Row className="params-item">
                  <Col span="12" className="title">
                    <span>学科名称：</span>
                  </Col>
                  <Col span="12" className="value" >
                    <span>{item.basic_props.subject}</span>
                  </Col>
                </Row>
                <Row className="params-item">
                  <Col span="12" className="title">
                    <span>能力纬度：</span>
                  </Col>
                  <Col span="12" className="value">
                    <span>{item.basic_props.ability_dimension}</span>
                  </Col>
                </Row>
                <Row className="params-item">
                  <Col span="12" className="title">
                    <span>内容纬度</span>
                  </Col>
                  <Col span="12" className="value">
                    <span>{item.basic_props.details_dimension}</span>
                  </Col>
                </Row>
                <Row className="params-item">
                  <Col span="12" className="title">
                    <span>难度等级：</span>
                  </Col>
                  <Col span="12" className="value">
                    <span>{item.advanced_props.ctt_level}</span>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="question-footer">
              <Col span="16" className="question-answer">
                <span>答案：
                  <Button size="small">点击查看</Button>
                </span>
              </Col>
              <Col span="8">
                <Button type="primary" size="small" onClick={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  this.props.onIndex(item);
                }} style={{backgroundColor: "#56BFFF", borderColor: "#56BFFF"}}>使用</Button>
              </Col>
            </Row>
          </div>
        );
      }) : <></>
      }
      </div>
    );
  }
}

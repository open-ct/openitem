import {Component} from "react";
import {Button, Col, Drawer, Row, Space} from "antd";
import "./HistoryQuestion.less";
import BraftEditor from "braft-editor";

export default class HistoryQuestion extends Component {
  constructor(props) {
    super(props);
    this.setPageNum = this.setPageNum.bind(this);
    this.state = {
      editorState: BraftEditor.createEditorState(),
      editorUtil: BraftEditor.createEditorState(),
      page: 1,
      questionPreview: false,
      index: 0,
    };
  }
  getQuestionInfo=(info) => {
    this.setState({
      questions: info,
    });
  }
  setPageNum=(page) => {
    this.setState({
      page,
    });
  }
  render() {
    return (
      <div>{this.state.questions ? this.state.questions.map((item, index) => {
        if(2 * (this.state.page - 1) <= index && index < 2 * this.state.page) {
          return (
            <div key={index} className="history-question-item" data-component="history-question-item">
              <Row gutter={[16, 16]} className="queston-content">
                <Col span="16" >
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
                  <Space size="middle">
                    <Button size="small" type="primary" onClick={() => {
                      this.setState({
                        editorUtil: BraftEditor.createEditorState(this.state.questions[index].info.body),
                        questionPreview: true,
                        index,
                      });
                    }}>问题预览</Button>
                    <Button size="small" type="primary" onClick={() => {
                      this.setState({
                        editorUtil: BraftEditor.createEditorState(this.state.questions[index].info.answer),
                        questionPreview: true,
                        index,
                      });
                    }}>答案</Button>
                    <Button size="small" type="primary" onClick={() => {
                      this.setState({
                        editorUtil: BraftEditor.createEditorState(this.state.questions[index].info.solution),
                        questionPreview: true,
                        index,
                      });
                    }}>解析</Button>
                  </Space>
                </Col>
                <Col span="8">
                  <Button type="primary" size="small" onClick={(e, index) => {
                    e.nativeEvent.stopImmediatePropagation();
                    this.props.onIndex(item);
                  }} style={{marginTop: "10px"}}>使用</Button>
                </Col>
              </Row>
            </div>
          );
        }
      }) : <></>
      }
      <Drawer width="1200px" forceRender={true} visible={this.state.questionPreview} title="预览问题" onClose={() => {
        this.setState({
          questionPreview: false,
        });
      }}>
        <div dangerouslySetInnerHTML={{
          __html: this.state.editorUtil.toHTML(),
        }} >
        </div>
      </Drawer>
      </div>
    );
  }
}

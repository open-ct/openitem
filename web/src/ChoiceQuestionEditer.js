import React, {Component} from "react";
import {Button, Col, Row, Select, Slider, Spin, Tabs, Tag, message} from "antd";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";
import "./ChoiceQuestionEditer.less";
import * as PropositionBackend from "./backend/PropositionBackend";

const {Option} = Select;
const {TabPane} = Tabs;

class ChoiceQuestionEditer extends Component {
  constructor(props) {
    super(props);
    this.fillEditor = this.fillEditor.bind();
    this.state = {
      question: {},
      classes: props,
      editorState: {
        body: BraftEditor.createEditorState(null),
        answer: BraftEditor.createEditorState(null),
        solution: BraftEditor.createEditorState(null),
      },
      loadingState: false,
      questionParams: {
        subject: "",
        difficulty: 1,
        answer: "",
      },
    };
  }
  fillEditor=(question) => {
    const {body, answer, solution} = question.info;
    this.setState({
      editorState: {
        body: BraftEditor.createEditorState(body),
        answer: BraftEditor.createEditorState(answer),
        solution: BraftEditor.createEditorState(solution),
      },
    });
  }
  upLoadQuestion = (uid) => {
    this.setState({
      loadingState: true,
    });
    let data = {
      advanced_props: {
        ctt_diff_1: this.state.questionParams.difficulty,
        ctt_diff_2: this.state.questionParams.difficulty,
        ctt_level: this.state.questionParams.difficulty,
        irt_level: this.state.questionParams.difficulty,
      },
      apply_record: {
        grade_fits: this.props.grade_range.join(","),
        participant_count: 0,
        test_count: 0,
        test_region: [],
        test_year: `${new Date().getFullYear()}`,
      },
      author: uid,
      basic_props: {
        ability_dimension: this.props.ability.join(","),
        description: "暂无",
        details: this.state.editorState.body.toHTML(),
        details_dimension: this.props.content.join(","),
        encode: "",
        keywords: [],
        sub_ability_dimension: "",
        sub_details_dimension: "",
        subject: this.state.questionParams.subject,
        subject_requirements: "",
      },
      extra_props: {
        is_question_group: false,
        is_scene: true,
        material_length: 0,
        reading_material_topic: "",
      },
      info: {
        answer: this.state.questionParams.answer,
        body: this.state.editorState.body.toHTML(),
        solution: "无",
        title: "无",
        type: "选择题",
      },
      source_project: this.props.projectId,
      spec_props: {
        article_type: "无",
        length: "无",
        topic: "无",
      },
    };
    Object.assign(data, {body: {
      text: this.state.editorState.body.toHTML(),
    }});
    Object.assign(data, {answer: {
      text: this.state.editorState.answer.toHTML(),
    }});
    Object.assign(data, {solution: {
      text: this.state.editorState.solution.toHTML(),
    }});
    PropositionBackend.CreateNewQuestion(data).then(res => {
      this.setState({
        loadingState: false,
      });
    }).then(res => {
      this.props.classes.history.goBack();
      message.success("上传成功");
    }).catch(err => {
      this.setState({
        loadingState: false,
      });
      message.error(err.message || "请求错误");
    });
  }
  componentDidMount() {
    this.setState({
      questionParams: Object.assign(this.state.questionParams, {subject: this.props.defaultSubjectValue}),
    });
  }
  onChange=() => {

  }
  render() {
    return (
      <div className="choice-question-editer" data-component="choice-question-editer" id="choice-question-edit-box">
        <Spin spinning={this.state.loadingState} tip="上传试题中">
          <Tabs onChange={this.onChange} type="card">
            <TabPane tab="主体" key="1">
              <BraftEditor
                value={this.state.editorState.body}
                onChange={(value) => {
                  this.setState({editorState: Object.assign(this.state.editorState, {body: value})});
                }}
                onSave={() => {
                }}
              />
            </TabPane>
            <TabPane tab="答案" key="2">
              <BraftEditor
                value={this.state.editorState.answer}
                onChange={(value) => {
                  this.setState({editorState: Object.assign(this.state.editorState, {answer: value})});
                }}
                onSave={() => {
                }}
              />
            </TabPane>
            <TabPane tab="解析" key="3">
              <BraftEditor
                value={this.state.editorState.solution}
                onChange={(value) => {
                  this.setState({editorState: Object.assign(this.state.editorState, {solution: value})});
                }}
                onSave={() => {
                }}
              />
            </TabPane>
          </Tabs>
          <Row className="question-params">
            <div className="title">
              <span>参数编辑</span>
            </div>
            <Row className="param-item" style={{marginTop: ".17rem"}}>
              <Col span="4" className="label">
                <span>学科</span>
              </Col>
              <Col span="20" className="value">
                <Select
                  placeholder="选择学科"
                  value={this.state.questionParams.subject}
                  defaultValue={this.props.defaultSubjectValue}
                  onSelect={(e) => {
                    let questionParams = Object.assign(this.state.questionParams, {subject: e});
                    this.setState({
                      questionParams,
                    });
                  }}
                  size="small"
                >
                  {
                    this.props.subjectList.map((item, index) => (
                      <Option value={item} key={index + Math.random(100)}>{item}</Option>
                    ))
                  }
                </Select>
              </Col>
            </Row>
            <Row className="param-item" style={{marginTop: ".17rem"}}>
              <Col span="4" className="label">
                <span>难度</span>
              </Col>
              <Col span="20" className="value">
                <Slider marks={{1: 1, 2: 2, 3: 3, 4: 4, 5: 5}} step={null} defaultValue={1} max={5} min={1} onChange={(e) => {
                  let questionParams = Object.assign(this.state.questionParams, {difficulty: e});
                  this.setState({
                    questionParams,
                  });
                }} />
              </Col>
            </Row>
            <Row className="param-item" style={{marginTop: ".3rem"}}>
              <Col span="4" className="label">
                <span>能力纬度</span>
              </Col>
              <Col span="20" className="value">
                <div className="tag-list">
                  {
                    this.props.ability.map(item => (
                      <Tag key={item.id}>{item}</Tag>
                    ))
                  }
                </div>
              </Col>
            </Row>
            <Row className="param-item" style={{marginTop: ".17rem"}}>
              <Col span="4" className="label">
                <span>内容纬度</span>
              </Col>
              <Col span="20" className="value">
                <div className="tag-list">
                  {
                    this.props.content.map(item => (
                      <Tag key={item.id}>{item}</Tag>
                    ))
                  }
                </div>
              </Col>
            </Row>
          </Row>
          <div className="question-complete-box">
            <Button type="primary" block onClick={() => {
              this.upLoadQuestion(this.props.author);
            }}>完成编辑</Button>
          </div>
        </Spin>
      </div>
    );
  }
}
export default ChoiceQuestionEditer;

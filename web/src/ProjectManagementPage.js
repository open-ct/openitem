import React, {Component} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import {PageHeader, Tabs, Button, Descriptions, Spin, message} from "antd";
// import Step from '../../components/Step'
// import BuildTeam from '../../components/BuildTeam'
// import './index.less'

const {TabPane} = Tabs;

export default class ProjectManagementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: props,
            projectBaseInfo: {},
            loadingState: true
        };
    }

    componentDidMount() {
        this.getProjectBaseInfo();
    }

    getProjectBaseInfo() {
        // this.setState({
        //     loadingState:true
        // })
        // request({ method:'GET', url:baseURL+`/review/proj/detailed/${this.props.match.params.project_id}`}).then(res=>{
        // // request({ method:'GET', url:`http://49.232.73.36:8081/review/proj/detailed/${this.props.match.params.project_id}`}).then(res=>{
        //     this.setState({
        //         projectBaseInfo:res.data,
        //         loadingState:false
        //     })
        // }).catch(err=>{
        //     this.props.history.push('/home')
        //     message.error(err.message||"项目信息加载失败，请重试！");
        //     this.setState({
        //         loadingState:false
        //     })
        // })
        var res = {
            "operation_code": 1000,
            "message": "",
            "data": {
                "basic_info": {
                    "Id": "62e4b170b686c0cf874cf17b",
                    "CreateAt": "2022-07-30T04:20:00.137Z",
                    "UpdateAt": "2022-07-30T04:20:00.137Z",
                    "uuid": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
                    "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
                    "status": 0,
                    "basic_info": {
                        "name": "demo",
                        "description": "无",
                        "requirement": "无",
                        "target": "无",
                        "grade_range": [
                            "大一"
                        ],
                        "subjects": [
                            "数学"
                        ],
                        "summary": "无"
                    }
                },
                "group": {
                    "admins": [
                        {
                            "Id": "62e4b170b686c0cf874cf17c",
                            "CreateAt": "2022-07-30T04:20:00.138Z",
                            "UpdateAt": "2022-07-30T04:20:00.138Z",
                            "uuid": "28dc2172-292a-45c0-9cdd-7c74b7cae5db",
                            "user_id": "2ab2770e-b6e7-476b-969c-2db815e878e6",
                            "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
                            "role": 1,
                            "operator": "system",
                            "is_confirmed": true,
                            "status": 0
                        }
                    ],
                    "assistants": [],
                    "experts": [],
                    "out_experts": [],
                    "teachers": []
                },
                "materials": {
                    "questions": null,
                    "exam_papers": null,
                    "files": null
                },
                "steps": [
                    {
                        "Id": "62e4b170b686c0cf874cf17d",
                        "CreateAt": "2022-07-30T04:20:00.14Z",
                        "UpdateAt": "2022-07-30T04:20:00.14Z",
                        "uuid": "b694e0e4-ba70-43b4-87e9-a36290503839",
                        "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
                        "index": 0,
                        "name": "组建团队",
                        "description": "",
                        "requirement": "",
                        "status": 0,
                        "deadline": 0,
                        "timetable": null,
                        "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
                        "attachments": null
                    },
                    {
                        "Id": "62e4b170b686c0cf874cf17e",
                        "CreateAt": "2022-07-30T04:20:00.14Z",
                        "UpdateAt": "2022-07-30T04:20:00.14Z",
                        "uuid": "a17143e3-e428-4058-9ee7-7c1d7998fd97",
                        "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
                        "index": 1,
                        "name": "测试框架与论证报告",
                        "description": "",
                        "requirement": "",
                        "status": 0,
                        "deadline": 0,
                        "timetable": null,
                        "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
                        "attachments": null
                    },
                    {
                        "Id": "62e4b170b686c0cf874cf17f",
                        "CreateAt": "2022-07-30T04:20:00.141Z",
                        "UpdateAt": "2022-07-30T04:20:00.141Z",
                        "uuid": "fe40481f-ca4b-4c80-8b7f-1da14c246e47",
                        "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
                        "index": 2,
                        "name": "6人访谈",
                        "description": "",
                        "requirement": "",
                        "status": 0,
                        "deadline": 0,
                        "timetable": null,
                        "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
                        "attachments": null
                    },
                    {
                        "Id": "62e4b170b686c0cf874cf180",
                        "CreateAt": "2022-07-30T04:20:00.141Z",
                        "UpdateAt": "2022-07-30T04:20:00.141Z",
                        "uuid": "ec57d848-a037-4b0f-a128-aab83ecc3482",
                        "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
                        "index": 3,
                        "name": "30人测试",
                        "description": "",
                        "requirement": "",
                        "status": 0,
                        "deadline": 0,
                        "timetable": null,
                        "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
                        "attachments": null
                    },
                    {
                        "Id": "62e4b170b686c0cf874cf181",
                        "CreateAt": "2022-07-30T04:20:00.142Z",
                        "UpdateAt": "2022-07-30T04:20:00.142Z",
                        "uuid": "05726d4e-14ad-46d7-b7ec-751c3d546bc0",
                        "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
                        "index": 4,
                        "name": "试题外审",
                        "description": "",
                        "requirement": "",
                        "status": 0,
                        "deadline": 0,
                        "timetable": null,
                        "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
                        "attachments": null
                    },
                    {
                        "Id": "62e4b170b686c0cf874cf182",
                        "CreateAt": "2022-07-30T04:20:00.143Z",
                        "UpdateAt": "2022-07-30T04:20:00.143Z",
                        "uuid": "1acb34c2-88b5-43b0-a96b-27d9444c26c8",
                        "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
                        "index": 5,
                        "name": "300人测试",
                        "description": "",
                        "requirement": "",
                        "status": 0,
                        "deadline": 0,
                        "timetable": null,
                        "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
                        "attachments": null
                    },
                    {
                        "Id": "62e4b170b686c0cf874cf183",
                        "CreateAt": "2022-07-30T04:20:00.144Z",
                        "UpdateAt": "2022-07-30T04:20:00.144Z",
                        "uuid": "0edc10b2-9af9-4254-a50d-91cf6c6b1fe8",
                        "project_id": "5677cb5a-e047-4be4-9d40-718a6c9371ef",
                        "index": 6,
                        "name": "定稿审查",
                        "description": "",
                        "requirement": "",
                        "status": 0,
                        "deadline": 0,
                        "timetable": null,
                        "creator": "2ab2770e-b6e7-476b-969c-2db815e878e6",
                        "attachments": null
                    }
                ]
            }
        };
        this.setState({
            projectBaseInfo: res.data,
            loadingState: false
        });
    }

    dateFilter(time) {
        let date = new Date(time);
        return `${date.getFullYear()}-${date.getMonth().toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    }

    tabCruuent = () => {
        let path_list = this.props.location.pathname.split("/");
        return `${path_list[path_list.length - 1]}_${path_list[path_list.length - 2]}`;
    }

    render() {
        return (
            <div className="project-management-page" data-component="project-management-page" key="project-management-page">
                <PageHeader
                    ghost={false}
                    onBack={() => this.props.history.push("/pendingtasks")}
                    title="项目管理"
                    subTitle={this.state.loadingState ? "加载中" : this.state.projectBaseInfo.basic_info.basic_info.name}
                    extra={[
                        <Button key="2">编辑项目</Button>,
                        <Button key="1">导出成员</Button>,
                    ]}
                    footer={
                        this.state.loadingState ? (
                            <Spin spinning={this.state.loadingState} tip="加载中" />
                        ) : (
                            <Tabs defaultActiveKey={`${this.state.projectBaseInfo.steps[0].uuid}_${this.state.projectBaseInfo.steps[0].name}`} type="card" activeKey={this.tabCruuent()} onChange={(e) => {
                                this.props.history.push(`/projectmanagements/${this.props.match.params.project_id}/${this.props.match.params.role}/${e.split("_")[1]}/${e.split("_")[0]}`);
                            }}>
                                {
                                    this.state.projectBaseInfo.steps.map(item => (
                                        <TabPane key={`${item.uuid}_${item.name}`} tab={item.name}></TabPane>
                                    ))
                                }
                            </Tabs>
                        )
                    }
                >
                    {
                        this.state.loadingState ? (
                            <Spin spinning={this.state.loadingState} tip="加载中..." />
                        ) : (
                            <Descriptions size="small" column={3} style={{width: "auto"}}>
                                <Descriptions.Item label="创建时间">{this.dateFilter(this.state.projectBaseInfo.basic_info.CreateAt)}</Descriptions.Item>
                                <Descriptions.Item label="学科">
                                    {
                                        this.state.projectBaseInfo.basic_info.basic_info.subjects.map((item, index) => (
                                            <span>{`${item}${index === this.state.projectBaseInfo.basic_info.basic_info.subjects.length - 1 ? "" : "、"}`}</span>
                                        ))
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="学段">
                                    {
                                        this.state.projectBaseInfo.basic_info.basic_info.grade_range.map((item, index) => (
                                            <span>{`${item}${index === this.state.projectBaseInfo.basic_info.basic_info.grade_range.length - 1 ? "" : "、"}`}</span>
                                        ))
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="试卷">0</Descriptions.Item>
                                <Descriptions.Item label="试题">0</Descriptions.Item>
                            </Descriptions>
                        )
                    }
                </PageHeader>
                <div className="page-content-box">
                    {
                        this.state.loadingState ? (<></>) : (
                            <Switch>
                                <Redirect from={`/home/project-management/${this.props.match.params.project_id}/${this.props.match.params.role}`} to={`/home/project-management/${this.props.match.params.project_id}/${this.props.match.params.role}/${this.state.projectBaseInfo.steps[0].name}/${this.state.projectBaseInfo.steps[0].uuid}`} exact></Redirect>
                                {
                                    // this.state.projectBaseInfo.steps.map(item => (
                                    //     <Route path={`/projectmanagements/:project_id/:role/${item.name}/:step_id`} component={item.name === "组建团队" ? BuildTeam : Step} exact key={item.Id}></Route>
                                    // ))
                                }
                                {/* <Route component={NotFound} key="404"></Route> */}
                            </Switch>
                        )
                    }
                </div>
            </div>
        );
    }
}


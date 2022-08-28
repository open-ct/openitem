import React, {Component} from "react";
import {Button, Descriptions, Form, Input, InputNumber, Modal, PageHeader, Popconfirm, Space, Spin, Table, message} from "antd";
import {DeleteOutlined, EditOutlined, FileAddOutlined, PlusOutlined} from "@ant-design/icons";
import * as PropositionBackend from "./backend/PropositionBackend";
import "./NewCreatePrper.less";
export class NewCreatePaper extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }
  state = {
    initLoading: false,
    createTime: 0,
    paperViewVisible: false,
    loadingState: false,

    key: null,
    isAddModalVisible: false,
    isEditModalVisible: false,
    addQuestionVisible: false,
    editQuestionVisible: false,
    dataSource: [

    ],

    columns: [
      {title: "标题", dataIndex: "title", key: "title", width: "150px", align: "center", ellipsis: true},
      {title: "类型", dataIndex: "type", key: "type", width: "150px", align: "center", ellipsis: true},
      {title: "描述", dataIndex: "description", key: "description", width: "150px", align: "center", ellipsis: true},
      {title: "总分", dataIndex: "score", key: "score", width: "150px", align: "center", ellipsis: true},
      {
        title: "操作", dataIndex: "action", key: "action", width: "150px", align: "center", ellipsis: true,
        render: (_, record) => (
          <Space size="middle">
            <Button size="small" icon={<FileAddOutlined />} onClick={() => {
              this.setState({
                addQuestionVisible: true,
                key: record.key,
              });
            }}>添加</Button>
            <Button icon={<EditOutlined />} size="small" onClick={() => {
              let dataSource = this.state.dataSource;
              let newData = dataSource.filter(item => {
                return item.key === record.key;
              });
              this.setState({
                key: record.key,
                isEditModalVisible: true,
              });
              this.formRef.current.setFieldsValue(newData[0]);
            }}>
              编辑</Button>
            <Popconfirm title="Sure to delete?" onConfirm={() => {
              this.testpaperPartDelete(record.key);
            }}>
              <Button icon={<DeleteOutlined />} size="small">删除</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
  }
  componentDidMount() {
    let t = new Date();
    console.log(this.props.location.state, "回传");
    this.setState({
      createTime: `${t.getFullYear()}-${t.getMonth().toString().padStart(2, "0")}-${t.getDate().toString().padStart(2, "0")} ${t.getHours().toString().padStart(2, "0")}:${t.getMinutes().toString().padStart(2, "0")}:${t.getSeconds().toString().padStart(2, "0")}`,
      dataSource: this.props.location.state !== undefined ? [].concat(this.props.location.state.dataSource) : [],
    });
  }
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
  testpaperPartDelete = (key) => {
    let data = this.state.dataSource;
    data = data.filter(item => {
      return item.key !== key;
    });
    this.setState({
      dataSource: data,
    });
    message.success("删除成功！");
  }
  questionItemDelete = (key) => {
    let data = this.state.dataSource;
    data = data.map(i => {
      return Object.assign(i, {
        question_list: i.question_list.filter(i => {
          return i.key !== key;
        }),
      });
    });
    this.setState({
      dataSource: data,
    });
    message.success("删除成功！");
  }
  confirm = () => {
    let data = Object.assign({}, {
      author: this.props.match.params.uid,
      info: [].concat(this.state.dataSource),
      props: {
        grade_range: [],
        difficulty: "1",
        subjects: [],
        time_limit: "0",
      },
      source_project: `${this.props.match.params.uid}/${this.props.match.params.project}`,
      comment_record: [],
      title: "无",
    });
    console.log(data, "上传数据");
    PropositionBackend.CreateNewTestpaper(data).then(res => {
      message.success("上传成功");
      window.location.href = "/proposition-paper";
    }).catch(err => {
      message.error(err.message);
    });
  }
  expandedRowRender = (record) => {
    const columns = [
      {title: "序号", dataIndex: "small_question_number", key: "small_question_number", align: "left", width: "150px", ellipsis: true},
      {title: "类型", dataIndex: "type", key: "type", align: "left", width: "150px", ellipsis: true},
      {title: "分值", dataIndex: "score", key: "score", align: "left", width: "150px", ellipsis: true},
      {
        title: "操作", dataIndex: "action", key: "action", align: "left", width: "150px", ellipsis: true,
        render: (_, record) => (
          <Space size="middle">
            <Popconfirm title="Sure to delete?" onConfirm={() => {
              this.questionItemDelete(record.key);
            }}>
              <Button icon={<DeleteOutlined></DeleteOutlined>} size="small">删除</Button>
            </Popconfirm>
            <Button
              icon={<EditOutlined></EditOutlined>}
              size="small"
              onClick={() => {
                this.setState({
                  editQuestionVisible: true,
                  key: record.key,
                });
              }}>
              编辑</Button>
          </Space>
        ),
      },
    ];
    return <Table columns={columns} dataSource={record.question_list} pagination={false} columnWidth="100px" bordered={true} rowClassName="rowName" />;
  };
  render() {
    return (
      <div className="create-paper-page" data-component="create-paper-page">
        <PageHeader
          ghost={false}
          onBack={() => this.props.history.goBack()}
          title="命题组卷"
          subTitle="上传试题"
          extra={[
            <Button key="1" ><Popconfirm okText="确认" cancelText="取消" title="确定要上传试卷吗？" onConfirm={
              this.confirm
            }>上传试卷</Popconfirm></Button>,
          ]}
        >
          {
            this.state.initLoading ? (
              <Spin spinning={true} tip="初始化中"></Spin>
            ) : (
              <Descriptions size="small" column={3}>
                <Descriptions.Item label="创建时间" key="createAt">{this.state.createTime}</Descriptions.Item>
                <Descriptions.Item label="项目" key="peojects">{this.props.match.params.project}</Descriptions.Item>
                <Descriptions.Item label="学科" key="subjects">{this.props.match.params.subject}</Descriptions.Item>

                <Descriptions.Item label="内容纬度" key="content">{
                  this.props.match.params.content.split(",").map((item, index) => (
                    <span key={index}>{item}{index === this.props.match.params.content.split(",").length - 1 ? "" : "、"}</span>
                  ))
                }</Descriptions.Item>
                <Descriptions.Item label="能力纬度" key="ability">
                  {
                    this.props.match.params.ability.split(",").map((item, index) => (
                      <span key={index}>{item}{index === this.props.match.params.ability.split(",").length - 1 ? "" : "、"}</span>
                    ))
                  }
                </Descriptions.Item>
              </Descriptions>
            )
          }
        </PageHeader>
        <Table
          bordered={false}
          columns={this.state.columns}
          dataSource={this.state.dataSource}
          // rowKey={record => record.key}
          pagination={false}
          expandable={
            {
              expandedRowRender: (record) => this.expandedRowRender(record),
            }
          }
          size="middle"
          style={{
            padding: "20px",
          }}
        />
        <Button
          block={true}
          shape={"round"}
          size={"middle"}
          icon={<PlusOutlined />}
          style={{
            borderStyle: "dashed",
          }}
          onClick={() => {
            this.setState({
              isAddModalVisible: true,
            });
          }}
        >添加</Button>
        {/* 添加大题信息 */}
        <Modal
          footer={null}
          title="添加大题"
          visible={this.state.isAddModalVisible}
          onCancel={() => {
            this.setState({
              isAddModalVisible: false,
            });
          }}>
          <Form
            name="addTestpaperPart"
            wrapperCol={{
              span: 16,
            }}
            onFinish={(value) => {
              value.key = this.uuid(32, 36);
              value.question_list = [];
              let data = this.state.dataSource.concat([value]);
              this.setState({
                dataSource: data,
                isAddModalVisible: false,
              });
            }}
          >
            <Form.Item
              label="标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input your title!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="类型"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Please input your type!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="描述"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your description!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="总分"
              name="score"
              rules={[
                {
                  required: true,
                  message: "Please input your score!",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <div style={{marginRight: "10px"}}>
              <Space>
                <Button onClick={() => {
                  this.setState({
                    isAddModalVisible: false,
                  });
                }}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  确认
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* 编辑大题信息 */}
        <Modal
          forceRender={true}
          footer={null}
          title="编辑大题"
          visible={this.state.isEditModalVisible}
          onOk={() => { }}
          onCancel={() => {
            this.setState({
              isEditModalVisible: false,
            });
          }}>
          <Form
            ref={this.formRef}
            name="editTestpaperPart"
            wrapperCol={{
              span: 16,
            }}
            onFinish={(value) => {
              console.log(this.state.dataSource);
              Object.assign(value, {key: this.state.key});
              let data = this.state.dataSource.map((item) => {
                return item.key === value.key ? Object.assign(value, {question_list: item.question_list}) : item;
              });
              this.setState({
                dataSource: data,
                isEditModalVisible: false,
              });
            }}
            onCancel={() => {
              this.setState({
                editQuestionVisible: false,
              });
            }}
          >
            <Form.Item
              label="标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input your title!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="类型"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Please input your type!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="描述"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your description!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="总分"
              name="score"
              rules={[
                {
                  required: true,
                  message: "Please input your score!",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <div style={{marginRight: "10px"}}>
              <Space>
                <Button onClick={() => {
                  this.setState({
                    isEditModalVisible: true,
                  });
                }}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  确认
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* 添加小题信息 */}
        <Modal
          footer={null}
          title="添加小题"
          visible={this.state.addQuestionVisible}
          onCancel={() => {
            this.setState({
              addQuestionVisible: false,
            });
          }}>
          <Form
            // forceRender={true}
            name="editQuestionItem"
            wrapperCol={{
              span: 16,
            }}
            onFinish={(value) => {
              value.key = this.uuid(32, 36);
              let data = this.state.dataSource;
              data.map(i => {
                if (i.key === this.state.key) {
                  if (i.question_list) {
                    i.question_list = i.question_list.concat([value]);
                    return i;
                  } else {
                    i.question_list = new Array(value);
                    return i;
                  }
                } else {return i;}
              });

              this.setState({
                otherKey: value.key,
                dataSource: [].concat(data),
                addQuestionVisible: false,
              });
              const {project, subject, ability, content, type, uid} = this.props.match.params;
              this.props.history.push(`/proposition-paper/upload-questions/${project}/${subject}/${ability}/${content}/${type}/${uid}`, Object.assign({}, {dataSource: this.state.dataSource, key: this.state.key, otherKey: this.state.otherKey}));
            }}
          >
            <Form.Item
              label="序号"
              name="small_question_number"
              rules={[
                {
                  required: true,
                  message: "Please input your num!",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="类型"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Please input your type!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="分值"
              name="score"
              rules={[
                {
                  required: true,
                  message: "Please input your score!",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <div style={{marginRight: "10px"}}>
              <Space>
                <Button onClick={() => {
                  this.setState({
                    isAddModalVisible: false,
                  });
                }}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  确认
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* 编辑小题信息 */}
        <Modal
          footer={null}
          title="编辑小题"
          visible={this.state.editQuestionVisible}
          onCancel={() => {
            this.setState({
              editQuestionVisible: false,
            });
          }}>
          <Form
            // forceRender={true}
            name="editQuestion"
            wrapperCol={{
              span: 16,
            }}
            onFinish={(value) => {
              value.key = this.state.key;
              let data = this.state.dataSource;
              this.setState({
                dataSource: Object.assign({}, data),
                editQuestionVisible: false,
              });
            }}
          >
            <Form.Item
              label="问题序号"
              name="small_question_number"
              rules={[
                {
                  required: true,
                  message: "Please input your num!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="小题名称"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="大题类型"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Please input your type!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <div style={{marginRight: "10px"}}>
              <Space>
                <Button onClick={() => {
                  this.setState({
                    isAddModalVisible: false,
                  });
                }}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  确认
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default NewCreatePaper;

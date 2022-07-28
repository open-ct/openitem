import React from "react";
import { Button, Result, Spin } from "antd";
import { withRouter } from "react-router-dom";
import * as Setting from "../utils/Setting";

class AuthCallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      msg: null,
    };
  }

  componentWillMount() {
    this.login();
  }

  getFromLink() {
    const from = sessionStorage.getItem("from");
    if (from === null) {
      return "/";
    }
    return from;
  }

  login() {
    Setting.signin().then((res) => {
      console.log(res);
      if (res.status === "ok") {
        Setting.showMessage("success", `Logged in successfully`)

        const link = this.getFromLink();
        console.log(link);
        debugger
        // Setting.goToLink(link);
        Setting.goToLink('/home')
      } else {
        this.setState({
          msg: res.msg,
        });
      }
    });
  }

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        {this.state.msg === null ? (
          <Spin
            size="large"
            tip="Signing in..."
            style={{ paddingTop: "10%" }}
          />
        ) : (
          <div style={{ display: "inline" }}>
            <Result
              status="error"
              title="Login Error"
              subTitle={this.state.msg}
              extra={[
                <Button type="primary" key="details">
                  Details
                </Button>,
                <Button key="help">Help</Button>,
              ]}
            />
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(AuthCallback);

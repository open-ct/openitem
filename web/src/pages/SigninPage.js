import React from 'react';
import * as Setting from "../utils/Setting";

class SigninPage extends React.Component {
  componentDidMount(){
    window.location.replace(Setting.getSigninUrl());
  }

  render() {
    return "";
  }
}

export default SigninPage;

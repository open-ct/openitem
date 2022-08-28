import React, {Component} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import CreatePaper from "./NewCreatePaper";
import UploadQuestions from "./UploadQuestions";
import Home from "./PropositionPaperHome";

export default class PropositionPaperHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }
  componentDidMount() {
    this.props.history.push({
      path: "/proposition-paper/home",
      state: {
        account: this.props.account,
      },
    });
  }
  render() {
    return (
      <div className="proposition-paper-page" data-component="proposition-paper-page" style={{width: "100%", height: "100%"}}>
        <Switch>
          <Route path="/proposition-paper/home" component={Home}></Route>
          <Route path="/proposition-paper/create-paper/:project/:subject/:ability/:content/:type/:uid" component={CreatePaper} ></Route>
          <Route path="/proposition-paper/upload-questions/:project/:subject/:ability/:content/:type/:uid" component={UploadQuestions}></Route>
          <Redirect to="/proposition-paper/home" ></Redirect>
        </Switch>
      </div>
    );
  }
}

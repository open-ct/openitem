import React, {Component} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import CreatePaper from "./CreatePaper";
import UploadQuestions from "./UploadQuestions";
import Home from "./PropositionPaperHome";

export default class PropositionPaperHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }
  render() {
    return (
      <div className="proposition-paper-page" data-component="proposition-paper-page" style={{width: "100%", height: "100%"}}>
        <Switch>
          <Redirect from="/proposition-paper" to="/proposition-paper/home" exact></Redirect>
          <Route path="/proposition-paper/home" component={Home} exact></Route>
          <Route path="/proposition-paper/create-paper/:project/:subject/:ability/:content/:type" component={CreatePaper} ></Route>
          <Route path="/proposition-paper/upload-questions/:project/:subject/:ability/:content/:type" component={UploadQuestions}></Route>
        </Switch>
      </div>
    );
  }
}

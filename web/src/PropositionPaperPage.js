import React, {Component} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import CreatePaper from "./CreatePaper";
import UploadQuestions from "./UploadQuestions";
import Home from "./PropositionPaperHome";

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
          classes: props,
        };
      }
    render() {
        return (
            <div className="proposition-paper-page" data-component="proposition-paper-page" style={{width:"100%", height:"100%"}}>
                <Switch>
                    <Redirect from="/propositionpapers" to="/propositionpapers/home" exact></Redirect>
                    <Route path="/propositionpapers/home" component={Home} exact></Route>
                    <Route path="/propositionpapers/create-paper/:project/:subject/:ability/:content/:type" component={CreatePaper} ></Route>
                    <Route path="/propositionpapers/upload-questions/:project/:subject/:ability/:content/:type" component={UploadQuestions}></Route>
                </Switch>
            </div>
        );
    }
}

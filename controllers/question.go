package controllers

import (
	"encoding/json"

	"github.com/open-ct/openitem/object"
)

type CreateNewQuestionRequest struct {
	Body     object.Task `json:"body"`
	Answer   object.Task `json:"answer"`
	Solution object.Task `json:"solution"`
}

// CreateNewQuestion
// @Title CreateNewQuestion
// @Description 创建新的题目（临时题目）
// @Param   json body object.TempQuestion true "新题目信息"
// @Success 200 {string}
// @Failure 400 "invalid body"
// @router /api/qbank/question [post]
func (c *ApiController) CreateNewQuestion() {
	if c.RequireSignedIn() {
		return
	}

	var request CreateNewQuestionRequest
	// var request object.TempQuestion
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &request)

	tempQuestion := object.TempQuestion{
		SourceProject: request.Body.SourceProject,
		Author:        request.Body.Owner,
		Info: object.QuestionInfo{
			Title:    request.Body.Name,
			Type:     request.Body.Type,
			Body:     request.Body.Text,
			Answer:   request.Answer.Text,
			Solution: request.Solution.Text,
		},
		BasicProps:    object.QuestionBasicProps{},
		SpecProps:     object.QuestionSpecProps{},
		ExtraProps:    object.QuestionExtraProps{},
		AdvancedProps: object.QuestionAdvancedProps{},
		ApplyRecord:   object.QuestionApplyRecord{},
	}

	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	resp, err := object.CreateNewTempQuestion(&tempQuestion)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk(resp)
}

// UpdateQuestion @Title UpdateQuestion
// @Description 更新新题目(创建一个新的分支)
// @Param   json body object.TempQuestion true "更新的题目信息"
// @Success 200 {string}
// @Failure 400 "invalid body"
// @router /api/qbank/question [put]
func (c *ApiController) UpdateQuestion() {
	if c.RequireSignedIn() {
		return
	}

	var request object.TempQuestion
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &request)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	resp, err := object.UpdateQuestion(&request)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk(resp)
}

// AddQuestionComment
// @Title AddQuestionComment
// @Description 添加一条题目的评价内容
// @Param   json body object.AddQuestionCommentRequest true "题目评价"
// @Success 200 {string}
// @Failure 400 "invalid body"
// @router /api/qbank/question/comment [post]
func (c *ApiController) AddQuestionComment() {
	if c.RequireSignedIn() {
		return
	}

	var request object.AddQuestionCommentRequest
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &request)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	err = object.AddQuestionComment(&request)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk("ok")
}

// TraceQuestionVersion @Title TraceQuestionVersion
// @Description 查询历史版本
// @Param   qid path string true "question id"
// @Success 200 {[]models.TempQuestion}
// @Failure 400 "invalid qid"
// @router  /api/qbank/question/trace/:qid [get]
func (c *ApiController) TraceQuestionVersion() {
	if c.RequireSignedIn() {
		return
	}

	qid := c.GetString(":qid")
	if qid == "" {
		c.ResponseError("invalid id")
		return
	}

	resp, err := object.TraceQuestionVersion(qid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// FinishTempQuestion
// @Title FinishTempQuestion
// @Description 最终确定题目 (转移到final数据库下)
// @Param   qid path string true "question id"
// @Success 200 {string}
// @Failure 400 "invalid qid"
// @router /api/qbank/question/finish/:qid [get]
func (c *ApiController) FinishTempQuestion() {
	if c.RequireSignedIn() {
		return
	}

	qid := c.GetString(":qid")
	if qid == "" {
		c.ResponseError("invalid id")
		return
	}

	resp, err := object.FinishTempQuestion(qid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// GetUserTempQuestions
// @Title GetUserTempQuestions
// @Description 获取用户创建的题目(temp数据库下)
// @Param   uid path string true "user id"
// @Success 200 {[]object.TempQuestion}
// @Failure 400 "invalid qid"
// @router /api/qbank/question/user_t/:uid [get]
func (c *ApiController) GetUserTempQuestions() {
	if c.RequireSignedIn() {
		return
	}

	uid := c.GetString(":uid")
	if uid == "" {
		c.ResponseError("invalid id")
		return
	}
	resp, err := object.GetUserTempQuestions(uid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// GetUserFinalQuestions
// @Title GetUserFinalQuestions
// @Description 获取用户创建的题目(final数据库下)
// @Param   uid path string true "user id"
// @Success 200 {[]object.FinalQuestion}
// @Failure 400 "invalid qid"
// @router /api/qbank/question/user_f/:uid [get]
func (c *ApiController) GetUserFinalQuestions() {
	if c.RequireSignedIn() {
		return
	}

	uid := c.GetString(":uid")
	if uid == "" {
		c.ResponseError("invalid id")
		return
	}
	resp, err := object.GetUserFinalQuestions(uid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// GetProjectTempQuestions
// @Title GetProjectTempQuestions
// @Description 获取项目下的题目(temp数据库下)
// @Param   uid path string true "project id"
// @Success 200 {[]object.TempQuestion}
// @Failure 400 "invalid qid"
// @router /api/qbank/question/proj_t/:pid [get]
func (c *ApiController) GetProjectTempQuestions() {
	if c.RequireSignedIn() {
		return
	}

	pid := c.GetString(":pid")
	if pid == "" {
		c.ResponseError("invalid id")
		return
	}
	resp, err := object.GetProjectTempQuestions(pid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// GetProjectFinalQuestions
// @Title GetProjectFinalQuestions
// @Description 获取项目下的题目(final数据库下)
// @Param   uid path string true "project id"
// @Success 200 {[]object.FinalQuestion}
// @Failure 400 "invalid qid"
// @router /api/qbank/question/proj_f/:pid [get]
func (c *ApiController) GetProjectFinalQuestions() {
	if c.RequireSignedIn() {
		return
	}

	pid := c.GetString(":pid")
	if pid == "" {
		c.ResponseError("invalid id")
		return
	}
	resp, err := object.GetProjectFinalQuestions(pid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

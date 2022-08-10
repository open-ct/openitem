package controllers

import (
	"encoding/json"

	"github.com/open-ct/openitem/object"
)

// GetOneSubmit
// @Title GetOneSubmit
// @Description 获取一个submit的信息
// @Param   submitId path string true "要获取的submit uuid"
// @Success 200 {object} object.Submit
// @Failure 400 "invalid submit id"
// @router /submit/:submitId [get]
func (c *ApiController) GetOneSubmit() {
	if c.RequireSignedIn() {
		return
	}

	submitId := c.GetString(":submitId")
	if submitId == "" {
		c.ResponseError("invalid id")
		return
	}
	resp, err := object.GetOneSubmit(submitId)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// GetSubmitsInStep @Title GetSubmitInStep
// @Description 获取一个step下的所有submit
// @Param   stepId path string true "step的uuid"
// @Success 200 {object} []object.Submit
// @Failure 400 "invalid step id"
// @router /submits/:stepId [get]
func (c *ApiController) GetSubmitsInStep() {
	if c.RequireSignedIn() {
		return
	}

	stepId := c.GetString(":stepId")
	if stepId == "" {
		c.ResponseError("invalid id")
		return
	}
	resp, err := object.GetStepSubmits(stepId)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// GetUserSubmitInStep
// @Title GetUserSubmitInStep
// @Description 获取某个用户在指定step下的submit
// @Param   json body object.GetUserSubmitsInStepRequest true "用户&step信息"
// @Success 200 {object} []object.Submit
// @Failure 400 "invalid json"
// @router /submits/user [post]
func (c *ApiController) GetUserSubmitInStep() {
	if c.RequireSignedIn() {
		return
	}

	var req object.GetUserSubmitsInStepRequest
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	resp, err := object.GetUserSubmitsInStep(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// MakeOneSubmit
// @Title MakeOneSubmit
// @Description 创建一个新的submit
// @Param   token header string true "user token get at login"
// @Param   json body object.Submit true "新submit信息"
// @Success 200 {object} response.Default
// @Failure 400 "invalid json"
// @router /submit [post]
func (c *ApiController) MakeOneSubmit() {
	if c.RequireSignedIn() {
		return
	}

	var req object.Submit
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	user := c.GetSessionUser()
	req.Submitter = user.Id

	resp, err := object.MakeOneSubmit(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// AppendContentInStep
// @Title AppendContentInStep
// @Description 在一个step中的content下追加新的材料(即用户在上传材料审核的历史记录)
// @Param   json body object.AppendContentInSubmit true "上传的材料信息"
// @Success 200 {object} response.Default
// @Failure 400 "invalid json"
// @router /submit/content [post]
func (c *ApiController) AppendContentInStep() {
	if c.RequireSignedIn() {
		return
	}

	var req object.AppendContentInSubmit
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	resp, err := object.AppendContent(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// WithdrawContentInStep
// @Title WithdrawContentInStep
// @Description 用户撤回某次提交的材料审核
// @Param   json body object.WithdrawContentInSubmit true "撤回的信息"
// @Success 200 {object} response.Default
// @Failure 400 "invalid json"
// @router /submit/content [delete]
func (c *ApiController) WithdrawContentInStep() {
	if c.RequireSignedIn() {
		return
	}

	var req object.WithdrawContentInSubmit
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	resp, err := object.WithdrawContent(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// SetSubmitStatus
// @Title SetSubmitStatus
// @Description 更改提交的状态(即管理员最终审核某次提交是否最终通过)
// @Param   json body object.SetSubmitStatusRequest true "设定的状态"
// @Success 200 true
// @Failure 400 "invalid json"
// @router /submit [put]
func (c *ApiController) SetSubmitStatus() {
	if c.RequireSignedIn() {
		return
	}

	var req object.SetSubmitStatusRequest
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	err = object.SetSubmitStatus(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(true)
}

// DeleteSubmit
// @Title DeleteSubmit
// @Description 删除一次submit
// @Param   submitId path string true "要删除的submit的uuid"
// @Success 200 true
// @Failure 400 "invalid submit id"
// @router /submit/:submitId [delete]
func (c *ApiController) DeleteSubmit() {
	if c.RequireSignedIn() {
		return
	}

	submitId := c.GetString(":submitId")
	if submitId == "" {
		c.ResponseError("invalid id")
		return
	}
	err := object.DeleteSubmit(submitId)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(true)
}

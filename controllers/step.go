package controllers

import (
	"encoding/json"

	"github.com/open-ct/openitem/object"
)

// CreateOneStep
// @Title CreateOneStep
// @Description 在指定项目下创建一个流程
// @Param   json body object.Step true "新建步骤的基本信息结构"
// @Success 200 stepId owner/name
// @Failure 400 "invalid step json body"
// @router /api/review/proj/step [post]
func (c *ApiController) CreateOneStep() {
	if c.RequireSignedIn() {
		return
	}

	var req object.Step
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	user := c.GetSessionUser()
	req.Creator = user.Id

	resp, err := object.CreateOneStep(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// GetOneStepInfo
// @Title GetOneStepInfo
// @Description 获取某一个指定id的step信息
// @Param   stepId path string true "对应step的uuid"
// @Success 200 {object} object.Step
// @Failure 400 "invalid stepID"
// @router /api/review/proj/step/:stepId [get]
func (c *ApiController) GetOneStepInfo() {
	if c.RequireSignedIn() {
		return
	}

	stepId := c.GetString(":stepId")
	if stepId == "" {
		c.ResponseError("invalid id")
		return
	}
	resp, err := object.GetStepInfo(stepId)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk(resp)
}

// GetStepsInProject
// @Title GetStepsInProject
// @Description 获取一个项目下的所有step信息
// @Param   pid path string true "指定的项目uuid"
// @Success 200 {object} []object.Step
// @Failure 400 "invalid project id"
// @router /api/review/proj/steps/:pid [get]
func (c *ApiController) GetStepsInProject() {
	if c.RequireSignedIn() {
		return
	}

	pId := c.GetString(":pid")
	if pId == "" {
		c.ResponseError("invalid id")
		return
	}
	resp, err := object.GetAllStepsInProject(pId)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// UploadStepAttachment
// @Title UploadStepAttachment
// @Description 绑定某个step的附件(这里并不上传文件, 需要调用uploadFile相关接口上传后绑定文件uuid到指定step)
// @Param   json body object.AddStepAttachment true "附件信息"
// @Success 200 true
// @Failure 400 "invalid attachment json"
// @router /api/review/proj/step/attachment [post]
func (c *ApiController) UploadStepAttachment() {
	if c.RequireSignedIn() {
		return
	}

	var req object.AddStepAttachment
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	user := c.GetSessionUser()
	req.Uploader = user.Id

	err = object.UploadStepAttachments(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(true)
}

// UpdateStepInfo
// @Title UpdateStepInfo
// @Description 更新某个step的信息
// @Param   json body object.Step true "要更新的信息"
// @Success 200 {object} response.Default
// @Failure 400 "invalid json"
// @router /api/review/proj/step [put]
func (c *ApiController) UpdateStepInfo() {
	if c.RequireSignedIn() {
		return
	}

	var req object.Step
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	err = object.UpdateStepInfo(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk(true)
}

// SetStepStatus
// @Title SetStepStatus
// @Description 更改流程的进度状态
// @Param   json body object.Step true "新的状态信息"
// @Success 200 true
// @Failure 400 "invalid json body"
// @router /api/review/proj/step/status [put]
func (c *ApiController) SetStepStatus() {
	if c.RequireSignedIn() {
		return
	}

	var req object.Step
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	err = object.SetStepStatus(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk(true)
}

// NextStep
// @Title NextStep
// @Description 进入下一流程
// @Param   json body object.NextStepRequest true "项目信息"
// @Success 200 true
// @Failure 400 "invalid json body"
// @router /api/review/proj/step/nextstep [post]
func (c *ApiController) NextStep() {
	if c.RequireSignedIn() {
		return
	}

	var req object.NextStepRequest
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	err = object.NextStep(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk(true)
}

// SetStepTimePoint
// @Title SetStepTimePoint
// @Description 为step设置时间点
// @Param   json body object.SetStepTimePoint true "时间点信息"
// @Success 200 {object} []object.ProjectTimePoint
// @Failure 400 "invalid json"
// @router /api/review/proj/step/timepoint [put]
func (c *ApiController) SetStepTimePoint() {
	if c.RequireSignedIn() {
		return
	}

	var req object.SetStepTimePointRequest
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	resp, err := object.SetStepTimePoint(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk(resp)
}

// DeleteStepTimePoint
// @Title DeleteStepTimePoint
// @Description 删除step下的某个时间点
// @Param   json body object.DeleteStepTimePointRequest true "要删除的时间点信息"
// @Success 200 true
// @Failure 400 "invalid jsob"
// @router /api/review/proj/step/timepoint [delete]
func (c *ApiController) DeleteStepTimePoint() {
	if c.RequireSignedIn() {
		return
	}

	var req object.DeleteStepTimePointRequest
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	err = object.DeleteStepTimePoint(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk(true)
}

// GetStepStatisticData
// @Title GetStepStatisticData
// @Description 获取一个项目step的统计信息
// @Param   stepId path string true "指定的step的uuid"
// @Success 200 {object} object.StepDataStatistic
// @Failure 400 "invalid project id"
// @router /api/review/proj/step/stat/:stepId [get]
func (c *ApiController) GetStepStatisticData() {
	if c.RequireSignedIn() {
		return
	}

	stepId := c.GetString(":stepId")
	if stepId == "" {
		c.ResponseError("invalid id")
		return
	}
	resp, err := object.GetStepDataStatistic(stepId)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// DeleteStep
// @Title DeleteStep
// @Description 删除step
// @Param   stepId path string true "要删除的的step的uuid"
// @Success 200 true
// @Failure 400 "invalid step id"
// @router /api/review/proj/step/:stepId [delete]
func (c *ApiController) DeleteStep() {
	if c.RequireSignedIn() {
		return
	}

	stepId := c.GetString(":stepId")
	if stepId == "" {
		c.ResponseError("invalid id")
		return
	}
	err := object.DeleteStep(stepId)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk(true)
}

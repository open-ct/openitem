package controllers

import (
	"encoding/json"

	"github.com/open-ct/openitem/object"
)

// a part of project controller

// GetOneAudit
// @Title GetOneAudit
// @Description 获取项目管理员/负责人等对一个submit下的content做出的审核
// @Param   auditId path string true "audit id owner/name"
// @Success 200 {object} &object.Audit
// @Failure 400 "invalid audit id"
// @router /audit/:auditId [get]
func (c *ApiController) GetOneAudit() {
	if c.RequireSignedIn() {
		return
	}

	auditId := c.GetString(":auditId")
	if auditId == "" {
		c.ResponseError("invalid id")
		return
	}
	resp, err := object.GetOneAudit(auditId)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// GetAuditsInSubmit
// @Title GetAuditsInSubmit
// @Description 获取一个submit下的所有audit
// @Param   submitId path string true "submit id"
// @Success 200 {object} &[]object.Audit
// @Failure 400 "invalid submit uuid"
// @router /audits/:submitId [get]
func (c *ApiController) GetAuditsInSubmit() {
	if c.RequireSignedIn() {
		return
	}

	submitId := c.GetString(":submitId")
	if submitId == "" {
		c.ResponseError("invalid id")
		return
	}
	resp, err := object.GetSubmitAudits(submitId)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// CreateOneAudit
// @Title VreateOneAudit
// @Description 项目负责人创建一个材料审核记录
// @Param   json body object.Audit true "审核信息"
// @Success 200 {object} object.Audit
// @Failure 400 "invalid json"
// @router /audit [post]
func (c *ApiController) CreateOneAudit() {
	if c.RequireSignedIn() {
		return
	}

	var req object.Audit
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	user := c.GetSessionUser()
	req.Owner = user.Id
	req.Auditor = user.Id

	resp, err := object.MakeOneAudit(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// CorrectAudit
// @Title CorrectAudit
// @Description 负责人修改审核信息
// @Param   json body object.Audit true "修改后的审核信息"
// @Success 200 {object} object.Audit
// @Failure 400 "invalid json"
// @router /audit [put]
func (c *ApiController) CorrectAudit() {
	if c.RequireSignedIn() {
		return
	}

	var req object.Audit
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	user := c.GetSessionUser()
	req.Owner = user.Id
	req.Auditor = user.Id

	resp, err := object.CorrectAudit(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// DeleteAudit
// @Title DeleteAudit
// @Description 删除一条审核记录
// @Param   token header string true "user token get at login"
// @Param   auditId path string true "要深处的审核记录Id"
// @Success 200 {object} true
// @Failure 400 "invalid audit id"
// @router /audit [delete]
func (c *ApiController) DeleteAudit() {
	if c.RequireSignedIn() {
		return
	}

	auditId := c.GetString(":auditId")
	if auditId == "" {
		c.ResponseError("invalid id")
		return
	}
	err := object.DeleteAudit(auditId)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(true)
}

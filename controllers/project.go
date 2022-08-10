package controllers

import (
	"encoding/json"

	"github.com/open-ct/openitem/object"
)

// CreateEmptyProject
// @Title CreateEmptyProject
// @Description 创建一个空项目(不创建相关流程和任务)
// @Param   json body object.Project true "基本的项目信息, 创建人(creator)一项不需要填写,会根据token自动解析填充"
// @Success 200 projectId owner/name
// @Failure 400 "[request login] please login"
// @router /api/review/proj/ [post]
func (c *ApiController) CreateEmptyProject() {
	if c.RequireSignedIn() {
		c.ResponseError("[request login] please login")
		return
	}

	var req object.Project
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	projectUuid, err := object.CreateEmptyProject(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk(projectUuid)
}

// CreatTemplateProject
// @Title CreatTemplateProject
// @Description 创建一个模板项目(创建标准的7个流程和任务)
// @Param   json body object.Project true "基本的项目信息, 创建人(creator)一项不需要填写,会根据token自动解析填充"
// @Success 200 projectId owner/name
// @Failure 400 "[request login] please login"
// @router /api/review/proj/template [post]
func (c *ApiController) CreatTemplateProject() {
	var req object.Project
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	// get user id from token
	if c.RequireSignedIn() {
		return
	}
	user := c.GetSessionUser()
	req.Owner = user.Id

	projectUuid, err := object.CreateTemplateProject(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk(projectUuid)
}

// UpdateProjectInfo
// @Title UpdateProjectInfo
// @Description 更新项目相关信息
// @Param   json body object.Project true 要更新的项目信息数据
// @Success 200 ok
// @Failure 400 "invalid body"
// @router /api/review/proj/ [put]
func (c *ApiController) UpdateProjectInfo() {
	if c.RequireSignedIn() {
		return
	}
	var req object.Project
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	err = object.UpdateProjectInfo(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk("ok")
}

// GetBasicInfo
// @Title GetBasicInfo
// @Description 获取项目的基本信息数据
// @Param   pid path string true "项目的id owner/name"
// @Success 200 {object} object.Project
// @Failure 400 "invalid project id"
// @router /api/review/proj/basic/:pid [get]
func (c *ApiController) GetBasicInfo() {
	if c.RequireSignedIn() {
		return
	}

	pid := c.GetString(":pid")
	if pid == "" {
		c.ResponseError("invalid project id")
		return
	}
	proj, err := object.GetProjectBasicInfo(pid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(proj)
}

// GetDetailedInfo
// @Title GetDetailedInfo
// @Description 获取项目的详细信息数据(basic info 基本信息, group-人员情况, steps-项目所有流程信息, materials-项目使用的参考材料)
// @Param   pid path string true "项目的id owner/name"
// @Success 200 {object} object.Project
// @Failure 400 "invalid project id"
// @router /api/review/proj/detailed/:pid [get]
func (c *ApiController) GetDetailedInfo() {
	if c.RequireSignedIn() {
		return
	}

	pid := c.GetString(":pid")
	if pid == "" {
		c.ResponseError("invalid project id")
		return
	}
	proj, err := object.GetProjectDetailedInfo(pid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(proj)
}

// GetUserAssignments
// @Title GetUserAssignment
// @Description 获取某一个用户的所有项目参与情况(即参与各个项目的角色分配情况)
// @Param   uid path string true "user id"
// @Success 200 {object} response.Default
// @Failure 400 "invalid user id"
// @router /api/review/proj/user/:uid [get]
func (c *ApiController) GetUserAssignments() {
	if c.RequireSignedIn() {
		return
	}

	uid := c.GetString(":uid")
	if uid == "" {
		c.ResponseError("invalid project id")
		return
	}
	assigns, err := object.GetUserAssignments(uid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(assigns)
}

package controllers

import (
	"encoding/json"

	"github.com/open-ct/openitem/object"
)

// MakeOneAssignment
// @Title MakeOneAssignment
// @Description create a user assignment for a project (创建一个人员分配记录: 项目-用户-角色) json字段说明: operator-进行角色分配的管理员id(根据token自行填充), project_id-该项分配记录对应的项目id, user_id-要进行分配的用户id, role-要分配的角色(1-项目管理员, 2-专家, 3-学科助理, 4-命题教师, 5-外审人员)
// @Param   json body object.MakeOneAssignmentRequest true "assignment information"
// @Success 200 {object} response.Default
// @Failure 400 "invalid token(body)"
// @router /api/review/proj/assign [post]
func (c *ApiController) MakeOneAssignment() {
	if c.RequireSignedIn() {
		return
	}

	var newAssign object.MakeOneAssignmentRequest
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &newAssign)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	user := c.GetSessionUser()

	newAssign.Operator = user.Id
	resp, err := object.MakeOneAssignment(&newAssign)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// GetProjectAssignments @Title GetProjectAssignment
// @Description 获取一个项目的所有人员分配情况
// @Param   pid path string true "project id owner/name"
// @Success 200 {object} response.Default
// @Failure 400 "invalid project id"
// @router /api/review/proj/assign/:pid [get]
func (c *ApiController) GetProjectAssignments() {
	if c.RequireSignedIn() {
		return
	}

	pid := c.GetString(":pid")
	if pid == "" {
		c.ResponseError("invalid id")
		return
	}
	assigns, err := object.GetProjectAssignment(pid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(assigns)
}

// DeleteAssignment @Title DeleteAssignment
// @Description 删除一条角色分配
// @Param   aid path string true "uuid of assignment to delete"
// @Success 200 true
// @Failure 400 "invalid uuid"
// @router /api/review/proj/assign/:aid [delete]
func (c *ApiController) DeleteAssignment() {
	if c.RequireSignedIn() {
		return
	}

	aid := c.GetString(":aid")
	if aid == "" {
		c.ResponseError("invalid id")
		return
	}
	err := object.RemoveAssignment(aid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(true)
}

// ChangeAssignment @Title ChangeAssignment
// @Description 更改一个角色分配; 字段说明: operator-进行更改的管理员id(根据token解析), assignment_id-更改的assign id, new_role-新的角色分配,
// @Param   json body object.ChangeAssignmentRequest true "new role to change"
// @Success 200 true
// @Failure 400 "invalid bodu"
// @router /api/review/proj/assign [patch]
func (c *ApiController) ChangeAssignment() {
	if c.RequireSignedIn() {
		return
	}

	var update object.ChangeAssignmentRequest
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &update)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	user := c.GetSessionUser()
	update.Operator = user.Id

	err = object.ChangeAssignment(&update)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(true)
}

// MakeOneTpAssignment
// @Title MakeOneTpAssignment
// @Description 分配试卷流程处理员
// @Param   json body object.MakeOneTpAssignmentRequest true "assignment information"
// @Success 200 {object} response.Default
// @Failure 400 "invalid token(body)"
// @router /api/review/proj/tpassign [post]
func (c *ApiController) MakeOneTpAssignment() {
	if c.RequireSignedIn() {
		return
	}

	var newAssign object.MakeOneTpAssignmentRequest
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &newAssign)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	user := c.GetSessionUser()

	newAssign.Operator = user.Id
	resp, err := object.MakeOneTpAssignment(&newAssign)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// GetTpAssignment
// @Title GetTpAssignment
// @Description 分配试卷流程处理员
// @Param   tid path string true "uuid of testpaper"
// @Success 200 {object} response.Default
// @Failure 400 "invalid token(body)"
// @router /api/review/proj/tpassign/:tid [get]
func (c *ApiController) GetTpAssignment() {
	if c.RequireSignedIn() {
		return
	}

	tid := c.GetString(":tid")
	if tid == "" {
		c.ResponseError("invalid id")
		return
	}

	resp, err := object.GetTestpaperAssignment(tid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

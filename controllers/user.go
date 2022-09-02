package controllers

import "github.com/open-ct/openitem/casdoor"

// GetUsers
// @Title GetUsers
// @Description 获取组织中的所有人员
// @Success 200 {object} []*auth.User
// @router /api/get-users [get]
func (c *ApiController) GetUsers() {
	if c.RequireSignedIn() {
		return
	}

	c.Data["json"] = casdoor.GetUsers()
	c.ServeJSON()
}

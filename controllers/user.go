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

// GetUserByName
// @Title GetUserByName
// @Description 根据用户名获取用户信息
// @Success 200 {object} auth.User
// @router /api/get-user/:name [get]
func (c *ApiController) GetUserByName() {
	if c.RequireSignedIn() {
		return
	}

	name := c.GetString(":name")

	c.Data["json"] = casdoor.GetUserByName(name)
	c.ServeJSON()
}

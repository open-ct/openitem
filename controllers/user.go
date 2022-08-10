package controllers

import "github.com/open-ct/openitem/casdoor"

func (c *ApiController) GetUsers() {
	c.Data["json"] = casdoor.GetUsers()
	c.ServeJSON()
}

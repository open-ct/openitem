package controllers

import (
	"encoding/json"

	"github.com/open-ct/openitem/casdoor"
	"github.com/open-ct/openitem/object"
)

type QueryRequest struct {
	IdList []string `json:"id_list"`
}

// GetProjectList
// @Title GetUserList
// @Description 获取项目列表
// @Param   json body QueryRequest true "要获取的id 列表"
// @Success 200 {object} []object.Project
// @Failure 400 "parse id list error"
// @router /api/review/query/proj [post]
func (c *ApiController) GetProjectList() {
	if c.RequireSignedIn() {
		return
	}

	queryRequset := new(QueryRequest)
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &queryRequset)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	resp := object.QueryProjects(queryRequset.IdList)
	c.ResponseOk(resp)
}

// GetTempQuestionList
// @Title GetTempQuestionList
// @Description 根据id列表获取temp-question信息
// @Param   json body models.QueryListRequest true "要获取的id 列表"
// @Success 200 {object} []models.TempQuestion
// @Failure 400 "parse id list error"
// @router /api/qbank/query/t_question [post]
func (c *ApiController) GetTempQuestionList() {
	if c.RequireSignedIn() {
		return
	}

	queryRequset := new(QueryRequest)
	err := json.Unmarshal(c.Ctx.Input.RequestBody, queryRequset)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	resp := object.QueryTempQuestions(queryRequset.IdList)
	c.ResponseOk(resp)
}

// GetUserList
// @Title GetUserList
// @Description 根据id列表获取user信息
// @Param   json body QueryRequest true "要获取的id 列表"
// @Success 200 {object} response.Default
// @Failure 400 "parse id list error"
// @router /api/review/query/user [post]
func (c *ApiController) GetUserList() {
	if c.RequireSignedIn() {
		return
	}

	queryRequset := new(QueryRequest)
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &queryRequset)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	resp := casdoor.QueryUsers(queryRequset.IdList)
	c.ResponseOk(resp)
}

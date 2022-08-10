package controllers

import (
	"encoding/json"

	"github.com/open-ct/openitem/object"
)

// CreateNewTestpaper
// @Title CreateNewTestpaper
// @Description 创建新的题目（临时题目）
// @Param   json body object.TempTestpaper true "新试卷信息"
// @Success 200 {string}
// @Failure 400 "invalid body"
// @router /api/qbank/testpaper/ [post]
func (c *ApiController) CreateNewTestpaper() {
	if c.RequireSignedIn() {
		return
	}

	var request object.TempTestpaper
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &request)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	resp, err := object.CreateNewTestpaper(&request)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk(resp)
}

// UpdateTestpaper
// @Title UpdateTestpaper
// @Description 更新新题目(创建一个新的分支)
// @Param   json body models.UpdateTestpaperRequest true "更新的试卷信息or内容"
// @Success 200 {string}
// @Failure 400 "invalid body"
// @router /api/qbank/testpaper/ [put]
func (c *ApiController) UpdateTestpaper() {
	if c.RequireSignedIn() {
		return
	}

	var request object.TempTestpaper
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &request)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	resp, err := object.UpdateTestpaper(&request)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk(resp)
}

// AddTestpaperComment
// @Title AddTestpaperComment
// @Description 添加一条题目的评价内容
// @Param   json body object.AddTestpaperCommentRequest true "新建一个试卷评估记录"
// @Success 200 {string}
// @Failure 400 "invalid body"
// @router /api/qbank/testpaper/comment [post]
func (c *ApiController) AddTestpaperComment() {
	if c.RequireSignedIn() {
		return
	}

	var request object.AddTestpaperCommentRequest
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &request)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	err = object.AddTestpaperComment(&request)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk("ok")
}

// TraceTestpaperVersion
// @Title TraceTestpaperVersion
// @Description 查询试卷的历史版本(向前查询)
// @Param   qid path string true "temp test-paper id"
// @Success 200 {[]object.TempTestpaper}
// @Failure 400 "invalid qid"
// @router /api/qbank/testpaper/trace/:qid [get]
func (c *ApiController) TraceTestpaperVersion() {
	if c.RequireSignedIn() {
		return
	}

	tid := c.GetString(":tid")
	if tid == "" {
		c.ResponseError("invalid id")
		return
	}

	resp, err := object.TraceTestpaperVersion(tid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// FinishTempTestpaper
// @Title FinishTempTestpaper
// @Description 最终确定题目 (试卷完成评审, 转移到final数据库下)
// @Param   qid path string true "test-paper id"
// @Success 200 {string}
// @Failure 400 "invalid qid"
// @router /api/qbank/testpaper/finish/:qid [get]
func (c *ApiController) FinishTempTestpaper() {
	if c.RequireSignedIn() {
		return
	}

	tid := c.GetString(":tid")
	if tid == "" {
		c.ResponseError("invalid id")
		return
	}

	resp, err := object.FinishTempTestpaper(tid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// GetUserTempTestpaper
// @Title GetUserTempTestpaper
// @Description 获取用户创建的试卷(temp数据库下)
// @Param   uid path string true "user id"
// @Success 200 {[]object.TempTestpaper}
// @Failure 400 "invalid qid"
// @router /api/qbank/testpaper/user_t/:uid [get]
func (c *ApiController) GetUserTempTestpaper() {
	if c.RequireSignedIn() {
		return
	}

	uid := c.GetString(":uid")
	if uid == "" {
		c.ResponseError("invalid id")
		return
	}

	resp, err := object.GetUserTempTestpaper(uid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// GetUserFinalTestpaper
// @Title GetUserFinalTestpaper
// @Description 获取用户创建的试卷(final数据库下)
// @Param   uid path string true "user id"
// @Success 200 {[]object.FinalTestpaper}
// @Failure 400 "invalid qid"
// @router /api/qbank/testpaper/user_f/:uid [get]
func (c *ApiController) GetUserFinalTestpaper() {
	if c.RequireSignedIn() {
		return
	}

	uid := c.GetString(":uid")
	if uid == "" {
		c.ResponseError("invalid id")
		return
	}

	resp, err := object.GetUserFinalTestpaper(uid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// GetProjectTempTestpaper
// @Title GetProjectTempTestpaper
// @Description 获取项目下的试卷(temp数据库下)
// @Param   uid path string true "project id"
// @Success 200 {[]object.TempTestpaper}
// @Failure 400 "invalid qid"
// @router /api/qbank/testpaper/proj_t/:pid [get]
func (c *ApiController) GetProjectTempTestpaper() {
	if c.RequireSignedIn() {
		return
	}

	pid := c.GetString(":pid")
	if pid == "" {
		c.ResponseError("invalid id")
		return
	}

	resp, err := object.GetProjectTempTestpaper(pid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

// GetProjectFinalTestpaper
// @Title GetProjectFinalTestpaper
// @Description 获取项目下的试卷(final数据库下)
// @Param   uid path string true "project id"
// @Success 200 {[]object.FinalTestpaper}
// @Failure 400 "invalid qid"
// @router /api/qbank/testpaper/proj_f/:pid [get]
func (c *ApiController) GetProjectFinalTestpaper() {
	if c.RequireSignedIn() {
		return
	}

	pid := c.GetString(":pid")
	if pid == "" {
		c.ResponseError("invalid id")
		return
	}

	resp, err := object.GetProjecgtFinalTestpaper(pid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(resp)
}

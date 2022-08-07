package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"path"
	"strings"

	"github.com/open-ct/openitem/object"
)

// UploadFile
// @Title UploadFile
// @Description 文件上传, 使用post form格式上传, 会自动解析token获得对应的上传者id
// @Param   file formData file true "文件名"
// @Param   description formData string false "文件注释和说明"
// @Param   tags formData string false "文件标签(文件类型即为文件的后缀名, 自动解析)"
// @Param   source_project formData string true "上传文件对应的项目id, 查询使用"
// @Success 200 {object} object.FileItem
// @Failure 400 "invalid file"
// @router / [post]
func (c *ApiController) UploadFile() {
	if c.RequireSignedIn() {
		return
	}

	file, fileHeader, err := c.GetFile("file")
	if err != nil {
		log.Printf("[file] get file from post-request error: %s", err.Error())
		c.ResponseError("get file failed")
		return
	}
	defer file.Close()

	fmt.Println(c.GetString("description"), c.GetString("tags"))
	fileDescription := c.GetString("description")
	fileTags := strings.Split(c.GetString("tags"), ",")
	fileSourceProject := c.GetString("source_project")

	user := c.GetSessionUser()

	uploadRequest := object.FileItem{
		Owner:         user.Id,
		Name:          fileHeader.Filename,
		Type:          path.Ext(fileHeader.Filename),
		SourceProject: fileSourceProject,
		Description:   fileDescription,
		Tags:          fileTags,
	}
	fileRecord, err := object.CreateNewFileRecord(&uploadRequest)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	err = c.SaveToFile("file", fileRecord.Path)
	if err != nil {
		log.Printf("[upload file] error: %s", err.Error())
		// delete the file record
		object.DeleteFile(fmt.Sprintf("%s/%s", uploadRequest.Owner, uploadRequest.Name))
		c.ResponseError("上传文件错误", fileRecord)
		return
	}

	c.ResponseOk(fileRecord)
}

// DownloadFile
// @Title DownloadFile
// @Description download a file by file id(根据文件id下载文件)
// @Param   fid path string true "file uuid"
// @Success 200 {object} object.FileItem
// @Failure 400 "invalid file uuid"
// @router /:fid [get]
func (c *ApiController) DownloadFile() {
	if c.RequireSignedIn() {
		return
	}

	fid := c.GetString(":fid")
	if fid == "" {
		c.ResponseError("invalid file id")
		return
	}
	fileInfo, err := object.GetFileInfo(fid)
	if err == nil {
		c.Ctx.Output.Download(fileInfo.Path, fileInfo.Name)
		return
	}
	c.ResponseOk(fileInfo)
	return
}

// GetFileInfo
// @Title GetFileInfo
// @Description 只获取文件信息, 不执行下载
// @Param   fid path string true "file uuid owner/name"
// @Success 200 {object} response.Default
// @Failure 400 "invalid file uuid"
// @router /info/:fid [get]
func (c *ApiController) GetFileInfo() {
	if c.RequireSignedIn() {
		return
	}

	fid := c.GetString(":fid")
	if fid == "" {
		c.ResponseError("invalid file id")
		return
	}
	fileInfo, err := object.GetFileInfo(fid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk(fileInfo)
}

// SearchFiles
// @Title SearchFiles
// @Description 条件搜素文件, 搜索结果 (待完善)
// @Param   json body object.FileItem true "搜索条件"
// @Success 200 {object} []object.FileItem
// @Failure 400 "invalid conditions (parse body failed)"
// @router /search [post]
func (c *ApiController) SearchFiles() {
	if c.RequireSignedIn() {
		return
	}

	var req object.FileItem
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &req)
	if err != nil {
		log.Printf("[file search] parse search conditions error: %s", err.Error())
		c.ResponseError("parse search conditions error")
		return
	}
	searchResult, err := object.SearchFiles(&req)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}

	c.ResponseOk(searchResult)
}

// DeleteFile
// @Title DeleteFile
// @Description 删除文件上传记录(不在磁盘存储中删除文件) login"
// @Param   fid path string true "the file's id you want to delete owner/name"
// @Success 200 true
// @Failure 400 "invalid file id"
// @router /:fid [delete]
func (c *ApiController) DeleteFile() {
	if c.RequireSignedIn() {
		return
	}

	fid := c.GetString(":fid")
	if fid == "" {
		c.ResponseError("invalid file id")
		return
	}
	err := object.DeleteFile(fid)
	if err != nil {
		c.ResponseError(err.Error())
		return
	}
	c.ResponseOk(true)
}

package object

import (
	"fmt"
	"log"
	"time"

	"github.com/casdoor/casdoor-go-sdk/auth"
	"github.com/open-ct/openitem/util"
)

type FileItem struct {
	Uuid          string   `xorm:"notnull pk" json:"uuid"`
	Name          string   `json:"name"`
	Type          string   `json:"type"`
	SourceProject string   `json:"source_project"`
	Description   string   `json:"description"`
	Tags          []string `xorm:"mediumtext" json:"tags"`
	Path          string   `json:"path"`
	Owner         string   `json:"owner"`

	CreateAt  time.Time `xorm:"created" json:"create_at"`
	UpdatedAt time.Time `xorm:"updated" json:"updated_at"`
}

func AddFile(fileItem *FileItem) error {
	_, err := adapter.engine.Insert(fileItem)
	if err != nil {
		panic(err)
	}

	return nil
}

func UploadFileToStorage(req *FileItem, fileBytes []byte) (string, string) {
	tag := "file"
	parent := "UploadFile"
	fullFilePath := fmt.Sprintf("openitem/file/%s/%s/%s", req.Owner, "uploadfile", req.Name)
	fileUrl, objectKey, err := auth.UploadResource(req.Owner, tag, parent, fullFilePath, fileBytes)
	if err != nil {
		panic(err)
	}

	file := FileItem{
		Uuid:          util.GenUuidV4(),
		Name:          req.Name,
		Type:          req.Type,
		SourceProject: req.SourceProject,
		Description:   req.Description,
		Tags:          req.Tags,
		Path:          fileUrl,
		Owner:         req.Owner,
	}

	err = AddFile(&file)
	if err != nil {
		log.Printf("[File upload (insert new file record failed)] %s", err.Error())
		return "", err.Error()
	}

	insertedId := file.Uuid

	log.Printf("[Insert] %s", insertedId)
	return fileUrl, objectKey
}

// GetFileInfo get file information by file-uuid
func GetFileInfo(fileUuid string) (*FileItem, error) {
	var fileInfo FileItem

	_, err := adapter.engine.ID(fileUuid).Get(&fileInfo)
	if err != nil {
		log.Printf("err: %s", err.Error())
		return nil, err
	}
	return &fileInfo, nil
}

func SearchFiles(searchReq *FileItem) (*[]FileItem, error) {
	// operations
	var files []FileItem
	var fileItem FileItem

	if searchReq.Name != "" {
		fileItem.Name = searchReq.Name
	}
	if searchReq.Type != "" {
		fileItem.Type = searchReq.Type
	}

	err := adapter.engine.Find(&files, fileItem)
	if err != nil {
		log.Printf("[Search File] %s\n", err.Error())
		return nil, err
	}

	return &files, nil
}

// DeleteFile delete the file-record in mongodb (keep on disk currently)
func DeleteFile(fileID string) error {
	_, err := adapter.engine.ID(fileID).Delete(&FileItem{})
	if err != nil {
		log.Printf("[File Delete] %s\n", err.Error())
		return err
	}
	return nil
}

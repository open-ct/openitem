package object

import (
	"fmt"
	"log"
	"time"

	"github.com/astaxie/beego"
	"github.com/open-ct/openitem/util"
	"xorm.io/core"
)

type FileItem struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

	Type          string   `json:"type"`
	SourceProject string   `json:"source_project"`
	Description   string   `json:"description"`
	Tags          []string `xorm:"mediumtext" json:"tags"`
	Path          string   `json:"path"`

	CreateAt  time.Time `xorm:"created" json:"create_at"`
	UpdatedAt time.Time `xorm:"updated" json:"updated_at"`
}

// fileStoreConfig: define the location of files to save.
type fileStoreConfig struct {
	RootPath   string
	NameFormat string
}

var fileStore fileStoreConfig

func init() {
	// 加载文件存储目录
	fileStoreRootPath := beego.AppConfig.String("filerootpath")
	fileStore.RootPath = fileStoreRootPath
}

func getFile(owner string, name string) *FileItem {
	fileItem := FileItem{Owner: owner, Name: name}
	existed, err := adapter.engine.Get(&fileItem)
	if err != nil {
		panic(err)
	}

	if existed {
		return &fileItem
	} else {
		return nil
	}
}

func GetFile(id string) *FileItem {
	owner, name := util.GetOwnerAndNameFromId(id)
	return getFile(owner, name)
}

func AddFile(fileItem *FileItem) error {
	_, err := adapter.engine.Insert(fileItem)
	if err != nil {
		panic(err)
	}

	return nil
}

func CreateNewFileRecord(req *FileItem) (*FileItem, error) {
	fileUuid := fmt.Sprintf("%s-%s", req.Owner, req.Name)
	file := FileItem{
		Owner:       req.Owner, // record the uploader's id
		Name:        req.Name,
		CreatedTime: time.Now().Format("2006-01-02 15:04:05"),

		Type:          req.Type,
		SourceProject: req.SourceProject,
		Description:   req.Description,
		Tags:          req.Tags,
		Path:          genFilesPath(fileUuid, req.Type),
	}

	err := AddFile(&file)
	if err != nil {
		log.Printf("[File upload (insert new file record failed)] %s", err.Error())
		return nil, err
	}

	insertedId := fmt.Sprintf("%s/%s", req.Owner, req.Name)

	log.Printf("[Insert] %s", insertedId)
	return &file, nil
}

// GetFileInfo get file information by file-uuid
func GetFileInfo(fileUuid string) (*FileItem, error) {
	var fileInfo FileItem

	owner, name := util.GetOwnerAndNameFromId(fileUuid)

	_, err := adapter.engine.ID(core.PK{owner, name}).Get(&fileInfo)
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
	owner, name := util.GetOwnerAndNameFromId(fileID)

	_, err := adapter.engine.ID(core.PK{owner, name}).Delete(&FileItem{})
	if err != nil {
		log.Printf("[File Delete] %s\n", err.Error())
		return err
	}
	return nil
}

// genFilesPath generate the files saving-path and saving-filename.
func genFilesPath(fileID string, fileType string) string {
	t := time.Now()
	dateString := fmt.Sprintf("%d-%d-%d", t.Year(), t.Month(), t.Day())
	todayPath := fileStore.RootPath + dateString
	// 如果没有目录, 需要创建
	if !util.IsDirExists(todayPath) {
		fmt.Println("dir not exist")
		util.CreateDateDir(fileStore.RootPath)
	}
	return todayPath + "/" + fileID + fileType
}

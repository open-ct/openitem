package object

import (
	"github.com/open-ct/openitem/util"
	"time"
	"xorm.io/core"
)

type FileItem struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

	CreateAt      time.Time `xorm:"created" json:"create_at"`
	UpdatedAt     time.Time `xorm:"updated" json:"updated_at"`
	DeletedAt     time.Time `xorm:"deleted" json:"deleted_at"`
	Type          string    `json:"type"`
	SourceProject string    `json:"source_project"`
	Description   string    `json:"description"`
	Tags          []string  `xorm:"mediumtext" json:"tags"`
	Path          string    `json:"path"`
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

func UpdateFile(id string, fileItem *FileItem) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	if getFile(owner, name) == nil {
		return false
	}

	_, err := adapter.engine.ID(core.PK{owner, name}).AllCols().Update(fileItem)
	if err != nil {
		panic(err)
	}

	// return affected != 0
	return true
}

func AddFile(fileItem *FileItem) bool {
	affected, err := adapter.engine.Insert(fileItem)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func DeleteFile(fileItem *FileItem) bool {
	affected, err := adapter.engine.ID(core.PK{fileItem.Owner, fileItem.Name}).Delete(&FileItem{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

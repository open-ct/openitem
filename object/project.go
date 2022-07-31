package object

import (
	"github.com/open-ct/openitem/util"
	"time"
	"xorm.io/core"
)

type Project struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

	CreateAt  time.Time        `xorm:"created" json:"create_at"`
	UpdatedAt time.Time        `xorm:"updated" json:"updated_at"`
	DeletedAt time.Time        `xorm:"deleted" json:"deleted_at"`
	Uuid      string           `xorm:"varchar(256) unique" json:"uuid"`
	Creator   string           `xorm:"varchar(256) index" json:"creator"`
	Status    int              `json:"status"`
	BasicInfo ProjectBasicInfo `xorm:"mediumtext" json:"basic_info"`
}

type ProjectBasicInfo struct {
	Name        string   `xorm:"index" json:"name"`
	Description string   `json:"description"`
	Requirement string   `json:"requirement"`
	Target      string   `json:"target"`
	GradeRange  []string `xorm:"mediumtext" json:"grade_range"`
	Subjects    []string `xorm:"mediumtext" json:"subjects"`
	Summary     string   `json:"summary"`
}

func getProject(owner string, name string) *Project {
	project := Project{Owner: owner, Name: name}
	existed, err := adapter.engine.Get(&project)
	if err != nil {
		panic(err)
	}

	if existed {
		return &project
	} else {
		return nil
	}
}

func GetProject(id string) *Project {
	owner, name := util.GetOwnerAndNameFromId(id)
	return getProject(owner, name)
}

func UpdateProject(id string, project *Project) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	if getProject(owner, name) == nil {
		return false
	}

	_, err := adapter.engine.ID(core.PK{owner, name}).AllCols().Update(project)
	if err != nil {
		panic(err)
	}

	// return affected != 0
	return true
}

func AddProject(project *Project) bool {
	affected, err := adapter.engine.Insert(project)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func DeleteProject(project *Project) bool {
	affected, err := adapter.engine.ID(core.PK{project.Owner, project.Name}).Delete(&Project{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

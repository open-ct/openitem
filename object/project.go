package object

import (
	"time"
	"xorm.io/builder"
)

type Project struct {
	Id        int64
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

func GetProject(uuid string) *Project {
	project := Project{Uuid: uuid}
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

func UpdateProject(uuid string, project *Project) bool {
	if GetProject(uuid) == nil {
		return false
	}

	_, err := adapter.engine.Where(builder.Eq{"uuid": uuid}).Update(project)
	if err != nil {
		panic(err)
	}

	return true
}

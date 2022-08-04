package object

import (
	"github.com/open-ct/openitem/util"
	"time"
	"xorm.io/core"
)

type Step struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

	ProjectId   string             `json:"project_id"`
	Index       int                `json:"index"`
	Description string             `json:"description"`
	Requirement string             `json:"requirement"`
	Status      int                `json:"status"`
	Deadline    int64              `json:"deadline"`
	Timetable   []ProjectTimePoint `xorm:"mediumtext" json:"timetable"`
	Creator     string             `json:"creator"`
	Attachments []string           `xorm:"mediumtext" json:"attachments"` // uuid of files

	CreateAt  time.Time `xorm:"created" json:"create_at"`
	UpdatedAt time.Time `xorm:"updated" json:"updated_at"`
	DeletedAt time.Time `xorm:"deleted" json:"deleted_at"`
}

func getStep(owner string, name string) *Step {
	step := Step{Owner: owner, Name: name}
	existed, err := adapter.engine.Get(&step)
	if err != nil {
		panic(err)
	}

	if existed {
		return &step
	} else {
		return nil
	}
}

func GetStep(id string) *Step {
	owner, name := util.GetOwnerAndNameFromId(id)
	return getStep(owner, name)
}

func UpdateStep(id string, step *Step) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	if getStep(owner, name) == nil {
		return false
	}

	_, err := adapter.engine.ID(core.PK{owner, name}).AllCols().Update(step)
	if err != nil {
		panic(err)
	}

	// return affected != 0
	return true
}

func AddStep(step *Step) bool {
	affected, err := adapter.engine.Insert(step)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func DeleteStep(step *Step) bool {
	affected, err := adapter.engine.ID(core.PK{step.Owner, step.Name}).Delete(&Step{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

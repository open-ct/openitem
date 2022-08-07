package object

import (
	"time"

	"github.com/open-ct/openitem/util"
	"xorm.io/core"
)

type Submit struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"created_time"`

	StepId      string    `json:"step_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Submitter   string    `json:"submitter"`
	Contents    []Content `xorm:"mediumtext" json:"contents"`
	Status      int       `json:"status"`

	CreateAt  time.Time `xorm:"created" json:"create_at"`
	UpdatedAt time.Time `xorm:"updated" json:"updated_at"`
	DeletedAt time.Time `xorm:"deleted" json:"deleted_at"`
}

type Content struct {
	Uuid    string `json:"uuid"`
	Type    int    `json:"type"`
	ItemId  string `json:"item_id"`
	Version string `json:"version"`
	Comment string `json:"comment"`
}

func getSubmit(owner string, name string) *Submit {
	submit := Submit{Owner: owner, Name: name}
	existed, err := adapter.engine.Get(&submit)
	if err != nil {
		panic(err)
	}

	if existed {
		return &submit
	} else {
		return nil
	}
}

func GetSubmit(id string) *Submit {
	owner, name := util.GetOwnerAndNameFromId(id)
	return getSubmit(owner, name)
}

func UpdateSubmit(id string, submit *Submit) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	if getSubmit(owner, name) == nil {
		return false
	}

	_, err := adapter.engine.ID(core.PK{owner, name}).AllCols().Update(submit)
	if err != nil {
		panic(err)
	}

	// return affected != 0
	return true
}

func AddSubmit(submit *Submit) bool {
	affected, err := adapter.engine.Insert(submit)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func DeleteSubmit(submit *Submit) bool {
	affected, err := adapter.engine.ID(core.PK{submit.Owner, submit.Name}).Delete(&Submit{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

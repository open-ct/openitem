package object

import (
	"github.com/open-ct/openitem/util"
	"time"
	"xorm.io/core"
)

type Audit struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

	CreateAt      time.Time `xorm:"created" json:"create_at"`
	UpdatedAt     time.Time `xorm:"updated" json:"updated_at"`
	DeletedAt     time.Time `xorm:"deleted" json:"deleted_at"`
	SubmitContent string    `json:"submit_content"`
	Result        int       `json:"result"`
	Comment       string    `json:"comment"`
	Auditor       string    `json:"auditor"`
}

func getAudit(owner string, name string) *Audit {
	audit := Audit{Owner: owner, Name: name}
	existed, err := adapter.engine.Get(&audit)
	if err != nil {
		panic(err)
	}

	if existed {
		return &audit
	} else {
		return nil
	}
}

func GetAudit(id string) *Audit {
	owner, name := util.GetOwnerAndNameFromId(id)
	return getAudit(owner, name)
}

func UpdateAudit(id string, audit *Audit) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	if getAudit(owner, name) == nil {
		return false
	}

	_, err := adapter.engine.ID(core.PK{owner, name}).AllCols().Update(audit)
	if err != nil {
		panic(err)
	}

	// return affected != 0
	return true
}

func AddAudit(audit *Audit) bool {
	affected, err := adapter.engine.Insert(audit)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func DeleteAudit(audit *Audit) bool {
	affected, err := adapter.engine.ID(core.PK{audit.Owner, audit.Name}).Delete(&Project{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

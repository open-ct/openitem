package object

import (
	"log"
	"time"

	"github.com/open-ct/openitem/util"
	"xorm.io/builder"
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

func GetOneAudit(auditId string) (*Audit, error) {
	var audit Audit

	owner, name := util.GetOwnerAndNameFromId(auditId)
	_, err := adapter.engine.ID(core.PK{owner, name}).Get(&audit)
	if err != nil {
		log.Println("find audit info err: " + err.Error())
		return nil, err
	}
	return &audit, nil
}

func GetSubmitAudits(submitId string) (*[]Audit, error) {
	var submit Submit

	owner, name := util.GetOwnerAndNameFromId(submitId)
	_, err := adapter.engine.ID(core.PK{owner, name}).Get(&submit)
	if err != nil {
		log.Println("address submit info err: " + err.Error())
		return nil, err
	}
	var audits []Audit
	for _, content := range submit.Contents {
		var audit Audit
		_, err := adapter.engine.Where(builder.Eq{"submit_content": content.Uuid}).Get(&audit)
		if err != nil {
			continue
		} else {
			audits = append(audits, audit)
		}
	}
	return &audits, nil
}

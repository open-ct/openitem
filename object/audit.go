package object

import (
	"fmt"
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

	SubmitContent string `json:"submit_content"`
	Result        int    `json:"result"`
	Comment       string `json:"comment"`
	Auditor       string `json:"auditor"`

	CreateAt  time.Time `xorm:"created" json:"create_at"`
	UpdatedAt time.Time `xorm:"updated" json:"updated_at"`
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

func AddAudit(audit *Audit) error {
	_, err := adapter.engine.Insert(audit)
	if err != nil {
		return err
	}

	return nil
}

func GetOneAudit(auditId string) (*Audit, error) {
	var audit Audit

	owner, name := util.GetOwnerAndNameFromId(auditId)
	_, err := adapter.engine.ID(core.PK{owner, name}).Get(&audit)

	if err != nil {
		log.Printf("find audit info err: %s\n", err.Error())
		return nil, err
	}
	return &audit, nil
}

func GetSubmitAudits(submitId string) (*[]Audit, error) {
	var submit Submit

	owner, name := util.GetOwnerAndNameFromId(submitId)
	_, err := adapter.engine.ID(core.PK{owner, name}).Get(&submit)
	if err != nil {
		log.Printf("address submit info err: %s\n", err.Error())
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

func MakeOneAudit(req *Audit) (*Audit, error) {
	newAudit := Audit{
		Owner:       req.Owner,
		Name:        req.Name,
		CreatedTime: time.Now().Format("2006-01-02 15:04:05"),

		SubmitContent: req.SubmitContent,
		Result:        req.Result,
		Comment:       req.Comment,
		Auditor:       req.Auditor,
	}

	err := AddAudit(&newAudit)
	if err != nil {
		log.Printf("[create new audit failed] %s\n", err.Error())
		return nil, err
	}

	insertedId := fmt.Sprintf("%s/%s", newAudit.Owner, newAudit.Name)

	log.Printf("[Insert] %s\n", insertedId)
	return &newAudit, nil
}

func CorrectAudit(req *Audit) (*Audit, error) {
	audit := Audit{
		Result:  req.Result,
		Comment: req.Comment,
		Auditor: req.Auditor,
	}

	_, err := adapter.engine.ID(core.PK{req.Owner, req.Name}).Update(&audit)
	if err != nil {
		log.Printf("[update new audit failed] %s\n", err.Error())
		return nil, err
	}
	var newAudit Audit
	_, err = adapter.engine.ID(core.PK{req.Owner, req.Name}).Get(&newAudit)
	if err != nil {
		return nil, err
	}

	return &newAudit, nil
}

func DeleteAudit(auditId string) error {
	owner, name := util.GetOwnerAndNameFromId(auditId)

	_, err := adapter.engine.ID(core.PK{owner, name}).Delete(&Audit{})
	if err != nil {
		return err
	}
	return nil
}

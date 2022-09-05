package object

import (
	"github.com/open-ct/openitem/util"
	"log"
	"time"
)

type TpAssignment struct {
	Uuid        string `xorm:"varchar(100) notnull pk" json:"uuid"`
	UserId      string `json:"user_id"`
	ProjectId   string `json:"project_id"`
	TestpaperId string `json:"testpaper_id"`
	Role        string `json:"role"`
	Operator    string `json:"operator"`

	CreateAt  time.Time `xorm:"created" json:"create_at"`
	UpdatedAt time.Time `xorm:"updated" json:"updated_at"`
}

type MakeOneTpAssignmentRequest struct {
	Operator    string `json:"operator"`
	ProjectId   string `json:"project_id"`
	TestpaperId string `json:"testpaper_id"`
	UserId      string `json:"user_id"`
	Role        string `json:"role"`
}

func MakeOneTpAssignment(req *MakeOneTpAssignmentRequest) (string, error) {
	newAssign := TpAssignment{
		Uuid:        util.GenUuidV4(),
		UserId:      req.UserId,
		ProjectId:   req.ProjectId,
		TestpaperId: req.TestpaperId,
		Role:        req.Role,
		Operator:    req.Operator,
	}
	_, err := adapter.engine.Insert(&newAssign)
	if err != nil {
		log.Printf("[TpAssignment] %s\n", err.Error())
		return "", err
	}
	log.Printf("Created new tpassignment: %s", newAssign.Uuid)
	return newAssign.Uuid, nil
}

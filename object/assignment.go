package object

import (
	"log"
	"time"

	"github.com/open-ct/openitem/util"
	"xorm.io/builder"
)

type Assignment struct {
	Uuid        string `xorm:"notnull pk" json:"uuid"`
	UserId      string `json:"user_id" bson:"user_id"`
	ProjectId   string `json:"project_id" bson:"project_id"`
	Role        int    `json:"role" bson:"role"`
	Operator    string `json:"operator" bson:"operator"`
	IsConfirmed bool   `json:"is_confirmed" bson:"is_confirmed"`
	Status      int    `json:"status" bson:"status"`

	CreateAt  time.Time `xorm:"created" json:"create_at"`
	UpdatedAt time.Time `xorm:"updated" json:"updated_at"`
}

type MakeOneAssignmentRequest struct {
	Operator  string `json:"operator"`
	ProjectId string `json:"project_id"`
	UserId    string `json:"user_id"`
	Role      int    `json:"role"`
}

type ChangeAssignmentRequest struct {
	Operator     string `json:"operator"`
	AssignmentId string `json:"assignment_id"`
	NewRole      int    `json:"new_role"`
}

func GetUserAssignments(uid string) (*[]Assignment, error) {
	var assignments []Assignment

	err := adapter.engine.Where(builder.Eq{"user_id": uid}).Find(&assignments)
	if err != nil {
		log.Printf("[assignment] find user's assign error: %s\n", err.Error())
		return nil, err
	}
	return &assignments, nil
}

func GetProjectAssignment(pid string) (map[string][]Assignment, error) {
	var assignments []Assignment

	err := adapter.engine.Where(builder.Eq{"project_id": pid}).Find(&assignments)
	if err != nil {
		log.Printf("[assignment] find project's assign error: %s\n", err.Error())
		return nil, err
	}
	// classify roles
	result := make(map[string][]Assignment)
	result["admins"] = []Assignment{}
	result["experts"] = []Assignment{}
	result["assistants"] = []Assignment{}
	result["teachers"] = []Assignment{}
	result["out_experts"] = []Assignment{}
	for _, assignment := range assignments {
		if assignment.Role == 1 {
			result["admins"] = append(result["admins"], assignment)
			continue
		}
		if assignment.Role == 2 {
			result["experts"] = append(result["experts"], assignment)
			continue
		}
		if assignment.Role == 3 {
			result["assistants"] = append(result["assistants"], assignment)
			continue
		}
		if assignment.Role == 4 {
			result["teachers"] = append(result["teachers"], assignment)
			continue
		}
		if assignment.Role == 5 {
			result["out_experts"] = append(result["out_experts"], assignment)
			continue
		}
	}
	return result, nil
}

func MakeOneAssignment(req *MakeOneAssignmentRequest) (string, error) {
	newAssign := Assignment{
		Uuid:        util.GenUuidV4(),
		UserId:      req.UserId,
		ProjectId:   req.ProjectId,
		Role:        req.Role,
		Operator:    req.Operator,
		IsConfirmed: false,
		Status:      0,
	}
	_, err := adapter.engine.Insert(&newAssign)
	if err != nil {
		log.Printf("[Assignment] %s\n", err.Error())
		return "", err
	}
	log.Printf("Created new assignment: %s", newAssign.Uuid)
	return newAssign.Uuid, nil
}

func RemoveAssignment(aid string) error {
	_, err := adapter.engine.ID(aid).Delete(&Assignment{})
	if err != nil {
		log.Printf("[delete assign] delete role error: %s\n", err.Error())
		return err
	}
	return nil
}

func ChangeAssignment(req *ChangeAssignmentRequest) error {

	_, err := adapter.engine.ID(req.AssignmentId).Update(
		&Assignment{
			Role:        req.NewRole,
			Operator:    req.Operator,
			IsConfirmed: false,
		},
	)
	if err != nil {
		log.Printf("[change assign] change role error: %s\n", err.Error())
		return err
	}
	return nil
}

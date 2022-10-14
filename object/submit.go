package object

import (
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/open-ct/openitem/util"
	"xorm.io/builder"
	"xorm.io/core"
)

type Submit struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"created_time"`

	StepId      string       `json:"step_id"`
	TestpaperId string       `json:"testpaper_id"`
	Title       string       `json:"title"`
	Description string       `json:"description"`
	Submitter   string       `json:"submitter"`
	Contents    []Content    `xorm:"mediumtext" json:"contents"`
	Status      string       `json:"status"`
	File        []FileRecord `json:"file"`

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

type GetUserSubmitsInStepRequest struct {
	UserId string `json:"user_id"`
	StepId string `json:"step_id"`
}

type AppendContentInSubmit struct {
	SubmitId string `json:"submit_id"`
	Type     int    `json:"type"`
	ItemId   string `json:"item_id"`
	Version  string `json:"version"`
	Comment  string `json:"comment"`
}

type WithdrawContentInSubmit struct {
	SubmitId     string `json:"submit_id"`
	ContentIndex int    `json:"content_index"`
	ContentId    string `json:"content_id"`
}

type SetSubmitStatusRequest struct {
	SubmitId  string `json:"submit_id"`
	NewStatus string `json:"new_status"`
}

type UpdateFileRequest struct {
	SubmitId   string       `json:"submit_id"`
	NewFileUrl []FileRecord `json:"new_file_url"`
}

type FileRecord struct {
	FileName string `json:"file_name"`
	FileUrl  string `json:"file_url"`
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

func AddSubmit(submit *Submit) error {
	_, err := adapter.engine.Insert(submit)
	if err != nil {
		panic(err)
	}

	return nil
}

func GetOneSubmit(subId string) (*Submit, error) {
	var submit Submit

	owner, name := util.GetOwnerAndNameFromId(subId)
	_, err := adapter.engine.ID(core.PK{owner, name}).Get(&submit)
	if err != nil {
		log.Printf("find submit info err: %s\n", err.Error())
		return nil, err
	}
	return &submit, nil
}

func GetStepSubmits(stepId string) (*[]Submit, error) {
	var submits []Submit

	err := adapter.engine.Where(builder.Eq{"step_id": stepId}).Find(&submits)
	if err != nil {
		log.Printf("find submits info err: %s\n", err.Error())
		return nil, err
	}
	return &submits, nil
}

func GetUserSubmitsInStep(req *GetUserSubmitsInStepRequest) (*[]Submit, error) {
	var submits []Submit

	err := adapter.engine.Where(builder.Eq{"submitter": req.UserId, "step_id": req.StepId}).Find(&submits)
	if err != nil {
		log.Printf("find submits info err: %s\n", err.Error())
		return nil, err
	}
	return &submits, nil
}

func MakeOneSubmit(req *Submit) (*Submit, error) {
	newSubmit := Submit{
		Owner:       req.Owner,
		Name:        req.Name,
		CreatedTime: time.Now().Format("2006-01-02 15:04:05"),

		StepId:      req.StepId,
		TestpaperId: fmt.Sprintf("%s", "测试试卷"),
		Title:       req.Title,
		Description: req.Description,
		Submitter:   req.Submitter,
		Status:      fmt.Sprintf("%s", "未审核"),
		File:        req.File,
	}

	err := AddSubmit(&newSubmit)
	if err != nil {
		log.Printf("[create new submit failed] %s\n", err.Error())
		return nil, err
	}

	insertedSubmitId := fmt.Sprintf("%s/%s", newSubmit.Owner, newSubmit.Name)

	log.Printf("[Insert] %s", insertedSubmitId)
	return &newSubmit, nil
}

func UpdateSubmitFile(req *UpdateFileRequest) error {
	owner, name := util.GetOwnerAndNameFromId(req.SubmitId)
	_, err := adapter.engine.ID(core.PK{owner, name}).Cols("file").Update(&Submit{File: req.NewFileUrl})
	if err != nil {
		return err
	}

	return nil
}

func AppendContent(req *AppendContentInSubmit) (*[]Content, error) {
	var submit Submit

	owner, name := util.GetOwnerAndNameFromId(req.SubmitId)
	_, err := adapter.engine.ID(core.PK{owner, name}).Get(&submit)
	if err != nil {
		log.Printf("Address submit error: %s\n", err.Error())
		return nil, err
	}
	contents := submit.Contents
	newContent := Content{
		Uuid:    util.GenUuidV4(),
		Type:    req.Type,
		ItemId:  req.ItemId,
		Version: req.Version,
		Comment: req.Comment,
	}
	contents = append(contents, newContent)

	_, err = adapter.engine.ID(core.PK{owner, name}).Cols("contents").Update(&Submit{Contents: contents})
	if err != nil {
		log.Printf("append a content error: %s\n", err.Error())
		return nil, err
	}
	return &contents, nil
}

func WithdrawContent(req *WithdrawContentInSubmit) (*[]Content, error) {
	var submit Submit

	owner, name := util.GetOwnerAndNameFromId(req.SubmitId)
	_, err := adapter.engine.ID(core.PK{owner, name}).Get(&submit)
	if err != nil {
		log.Printf("Address submit error: %s\n", err.Error())
		return nil, err
	}
	contents := submit.Contents
	for index, content := range contents {
		if index == req.ContentIndex || content.Uuid == req.ContentId {
			contents = append(contents[:index], contents[index+1:]...)
			break
		}
		if index == len(contents)-1 {
			return &contents, errors.New("SubmitWithdrawFail")
		}
	}

	_, err = adapter.engine.ID(core.PK{owner, name}).Cols("contents").Update(&Submit{Contents: contents})
	if err != nil {
		log.Printf("delete content error: %s\n", err.Error())
		return &submit.Contents, err
	}
	return &contents, nil
}

func SetSubmitStatus(req *SetSubmitStatusRequest) error {
	owner, name := util.GetOwnerAndNameFromId(req.SubmitId)

	_, err := adapter.engine.ID(core.PK{owner, name}).Cols("status").Update(&Submit{Status: req.NewStatus})
	if err != nil {
		log.Printf("set submit status error: %s\n" + err.Error())
		return err
	}
	return nil
}

func DeleteSubmit(submitId string) error {
	owner, name := util.GetOwnerAndNameFromId(submitId)

	_, err := adapter.engine.ID(core.PK{owner, name}).Delete(&Submit{})
	if err != nil {
		log.Printf("delete submit error: %s\n", err.Error())
		return err
	}

	return nil
}

func GetProjectSubmit(pid string) ([]Submit, error) {
	var steps []Step

	err := adapter.engine.Where(builder.Eq{"project_id": pid}).Find(&steps)
	if err != nil {
		return nil, err
	}

	var submits []Submit

	for _, step := range steps {
		var tempSubmits []Submit
		err := adapter.engine.Where(builder.Eq{"step_id": step.Uuid}).Find(&tempSubmits)
		if err != nil {
			return nil, err
		}
		submits = append(submits, tempSubmits...)
	}

	return submits, nil
}

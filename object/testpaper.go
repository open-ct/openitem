package object

import (
	"github.com/open-ct/openitem/util"
	"log"
	"time"
	"xorm.io/builder"
	"xorm.io/core"
)

type QuestionItem struct {
	QuestionId string `json:"question_id"`
	Score      int    `json:"score"`
	Comment    string `json:"comment"`
}

type TestpaperPart struct {
	Title        string         `json:"title"`
	Description  string         `json:"description"`
	QuestionList []QuestionItem `xorm:"mediumtext" json:"question_list"`
	Score        int            `json:"score"`
}

type TestpaperProps struct {
	GradeRange []string `xorm:"mediumtext not null pk" json:"grade_range"`
	Subjects   []string `xorm:"mediumtext not null pk" json:"subjects"`
	Difficulty string   `xorm:"not null pk" json:"difficulty"`
	TimeLimit  string   `xorm:"not null pkpk" json:"time_limit"`
}

type TestpaperComment struct {
	TimePoint time.Time `json:"time_point"`
	Comment   string    `json:"comment"`
	Author    string    `json:"author"`
}

type TempTestpaper struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

	IsRoot        bool               `json:"is_root"`
	Base          string             `json:"base"`
	SourceProject string             `json:"source_project"`
	Author        string             `json:"author"`
	Title         string             `json:"title"`
	Info          []TestpaperPart    `xorm:"mediumtext" json:"info"`
	Props         TestpaperProps     `xorm:"mediumtext json" json:"props"`
	CommentRecord []TestpaperComment `xorm:"mediumtext" json:"comment_record"`

	CreateAt  time.Time `xorm:"created" json:"create_at"`
	UpdatedAt time.Time `xorm:"updated" json:"updated_at"`
	DeletedAt time.Time `xorm:"deleted" json:"deleted_at"`
}

type FinalTestpaper struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

	SourceProject string          `json:"source_project"`
	Author        string          `json:"author"`
	Title         string          `json:"title"`
	Info          []TestpaperPart `xorm:"mediumtext" json:"info"`
	Props         TestpaperProps  `xorm:"mediumtext json" json:"props"`

	CreateAt  time.Time `xorm:"created" json:"create_at"`
	UpdatedAt time.Time `xorm:"updated" json:"updated_at"`
	DeletedAt time.Time `xorm:"deleted" json:"deleted_at"`
}

func AddTempTestpaper(tempTestpaper *TempTestpaper) error {
	_, err := adapter.engine.Insert(tempTestpaper)
	if err != nil {
		return err
	}

	return nil
}

func AddFinalTestpaper(finalTestpaper *FinalTestpaper) error {
	_, err := adapter.engine.Insert(finalTestpaper)
	if err != nil {
		return err
	}

	return nil
}

func CreateNewTestpaper(request *NewTestpaperRequest) (string, error) {
	newTestPaper := TempTestpaper{
		Owner:       request.Owner,
		Name:        request.Name,
		CreatedTime: time.Now().Format("2006-01-02 15:04:05"),

		IsRoot:        true,
		Base:          request.Owner + "/" + request.Name,
		SourceProject: request.SourceProject,
		Author:        request.Author,
		Title:         request.Title,
		Info:          request.Info,
		Props:         request.Props,
	}

	err := AddTempTestpaper(&newTestPaper)
	if err != nil {
		log.Println("insert new temp-tes-paper error: " + err.Error())
		return "", err
	}

	tempTestpaperId := request.Owner + "/" + request.Name

	log.Printf("new temp-test-paper created: %s\n", tempTestpaperId)
	return tempTestpaperId, nil
}

func UpdateTestpaper(request *UpdateTestpaperRequest) (string, error) {
	var oldTestPaper TempTestpaper

	owner, name := util.GetOwnerAndNameFromId(request.BaseTestpaper)

	_, err := adapter.engine.ID(core.PK{owner, name}).Get(&oldTestPaper)

	if err != nil {
		log.Println("base test-paper cannot find")
		return "", err
	}

	updatedTestPaper := TempTestpaper{
		Owner:       request.Owner,
		Name:        request.Name,
		CreatedTime: time.Now().Format("2006-01-02 15:04:05"),

		IsRoot:        false,
		Base:          request.BaseTestpaper,
		SourceProject: oldTestPaper.SourceProject,
		Author:        request.Author,
		Title:         request.NewTitle,
		Info:          request.NewInfo,
		Props:         request.NewProps,
	}

	err = AddTempTestpaper(&updatedTestPaper)
	if err != nil {
		log.Println("updated temp-tes-paper error: " + err.Error())
		return "", err
	}

	updatedId := updatedTestPaper.Owner + "/" + updatedTestPaper.Name
	log.Printf("temp-test-paper updated: %s\n", updatedId)

	return updatedId, nil
}

func AddTestpaperComment(requset *AddTestpaperCommentRequest) error {
	newComment := TestpaperComment{
		TimePoint: time.Now(),
		Comment:   requset.Comment,
		Author:    requset.Author,
	}
	var commentTestPaper TempTestpaper

	owner, name := util.GetOwnerAndNameFromId(requset.TestpaperId)
	_, err := adapter.engine.ID(core.PK{owner, name}).Get(&commentTestPaper)

	if err != nil {
		log.Println("cannot address the test-paper: " + err.Error())
		return err
	}

	newComments := append(commentTestPaper.CommentRecord, newComment)
	newTempTestpaper := TempTestpaper{CommentRecord: newComments}

	_, err = adapter.engine.ID(core.PK{owner, name}).Cols("comment_record").Update(&newTempTestpaper)

	if err != nil {
		log.Println("add new comment error: " + err.Error())
		return err
	}
	return nil
}

func TraceTestpaperVersion(tid string) ([]TempTestpaper, error) {
	var endPointTestPaper TempTestpaper

	owner, name := util.GetOwnerAndNameFromId(tid)

	_, err := adapter.engine.ID(core.PK{owner, name}).Get(&endPointTestPaper)
	if err != nil {
		log.Println("cannot get the end test-paper: " + err.Error())
		return nil, err
	}

	var testPapers []TempTestpaper
	testPapers = append(testPapers, endPointTestPaper)
	isEnd := endPointTestPaper.IsRoot
	currentBaseId := endPointTestPaper.Base

	for !isEnd {
		var currentNode TempTestpaper

		currentOwner, currentName := util.GetOwnerAndNameFromId(currentBaseId)

		_, err := adapter.engine.ID(core.PK{currentOwner, currentName}).Get(&currentNode)
		if err != nil {
			log.Println("find middle node cannot find: " + err.Error())
			return testPapers, err
		}
		testPapers = append(testPapers, currentNode)
		currentBaseId = currentNode.Base
		isEnd = currentNode.IsRoot == true
	}
	return testPapers, nil
}

func FinishTempTestpaper(tid string) (string, error) {
	var finishedTestPaper TempTestpaper
	owner, name := util.GetOwnerAndNameFromId(tid)

	_, err := adapter.engine.ID(core.PK{owner, name}).Get(&finishedTestPaper)
	if err != nil {
		log.Println("error to find finished error: " + err.Error())
		return "", nil
	}

	newFinalPaper := FinalTestpaper{
		Owner:       finishedTestPaper.Owner,
		Name:        finishedTestPaper.Name,
		CreatedTime: time.Now().Format("2006-01-02 15:04:05"),

		SourceProject: finishedTestPaper.SourceProject,
		Author:        finishedTestPaper.Author,
		Title:         finishedTestPaper.Title,
		Info:          finishedTestPaper.Info,
		Props:         finishedTestPaper.Props,
	}

	err = AddFinalTestpaper(&newFinalPaper)

	if err != nil {
		log.Println("conver to final-test-paper failed: " + err.Error())
		return "", err
	}

	finalTestpaperId := finishedTestPaper.Owner + "/" + finishedTestPaper.Name

	log.Printf("convert to final successfully: %s\n", finalTestpaperId)
	return finalTestpaperId, nil
}

func GetUserTempTestpaper(uid string) ([]TempTestpaper, error) {
	var testPapers []TempTestpaper

	err := adapter.engine.Where(builder.Eq{"author": uid}).Find(&testPapers)
	if err != nil {
		log.Println("find user's temp-test-paper error: " + err.Error())
		return nil, err
	}
	return testPapers, nil
}

func GetUserFinalTestpaper(uid string) ([]FinalTestpaper, error) {
	var testPapers []FinalTestpaper

	err := adapter.engine.Where(builder.Eq{"author": uid}).Find(&testPapers)
	if err != nil {
		log.Println("find user's final-test-paper error: " + err.Error())
		return nil, err
	}
	return testPapers, nil
}

func GetProjectTempTestpaper(pid string) ([]TempTestpaper, error) {
	var testPapers []TempTestpaper

	err := adapter.engine.Where(builder.Eq{"source_project": pid}).Find(&testPapers)
	if err != nil {
		log.Println("find project's temp-test-paper error: " + err.Error())
		return nil, err
	}
	return testPapers, nil
}

func GetProjecgtFinalTestpaper(pid string) ([]FinalTestpaper, error) {
	var testPapers []FinalTestpaper

	err := adapter.engine.Where(builder.Eq{"source_project": pid}).Find(&testPapers)
	if err != nil {
		log.Println("find project's final-test-paper error: " + err.Error())
		return nil, err
	}
	return testPapers, nil
}

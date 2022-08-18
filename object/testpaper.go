package object

import (
	"log"
	"time"

	"github.com/open-ct/openitem/util"
	"xorm.io/builder"
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
	GradeRange []string `xorm:"mediumtext notnull pk" json:"grade_range"`
	Subjects   []string `xorm:"mediumtext notnull pk" json:"subjects"`
	Difficulty string   `xorm:"notnull pk" json:"difficulty"`
	TimeLimit  string   `xorm:"notnull pk" json:"time_limit"`
}

type TestpaperComment struct {
	TimePoint time.Time `json:"time_point"`
	Comment   string    `json:"comment"`
	Author    string    `json:"author"`
}

type TempTestpaper struct {
	Uuid          string             `xorm:"varchar(100) notnull pk" json:"uuid"`
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
	Uuid          string          `xorm:"varchar(100) notnull pk" json:"uuid"`
	SourceProject string          `json:"source_project"`
	Author        string          `json:"author"`
	Title         string          `json:"title"`
	Info          []TestpaperPart `xorm:"mediumtext" json:"info"`
	Props         TestpaperProps  `xorm:"mediumtext json" json:"props"`

	CreateAt  time.Time `xorm:"created" json:"create_at"`
	UpdatedAt time.Time `xorm:"updated" json:"updated_at"`
	DeletedAt time.Time `xorm:"deleted" json:"deleted_at"`
}

type AddTestpaperCommentRequest struct {
	TestpaperId string `json:"testpaper_id"`
	Comment     string `json:"comment"`
	Author      string `json:"author"`
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

func CreateNewTestpaper(request *TempTestpaper) (string, error) {
	newTestPaper := TempTestpaper{
		Uuid:          util.GenUuidV4(),
		IsRoot:        true,
		SourceProject: request.SourceProject,
		Author:        request.Author,
		Title:         request.Title,
		Info:          request.Info,
		Props:         request.Props,
	}
	newTestPaper.Base = newTestPaper.Uuid

	err := AddTempTestpaper(&newTestPaper)
	if err != nil {
		log.Println("insert new temp-tes-paper error")
		return "", err
	}

	tempTestpaperId := newTestPaper.Uuid

	log.Printf("new temp-test-paper created: %s\n", tempTestpaperId)
	return tempTestpaperId, nil
}

func UpdateTestpaper(request *TempTestpaper) (string, error) {
	var oldTestPaper TempTestpaper

	_, err := adapter.engine.ID(request.Base).Get(&oldTestPaper)

	if err != nil {
		log.Println("base test-paper cannot find")
		return "", err
	}

	updatedTestPaper := TempTestpaper{
		Uuid:          util.GenUuidV4(),
		IsRoot:        false,
		Base:          request.Base,
		SourceProject: oldTestPaper.SourceProject,
		Author:        request.Author,
		Title:         request.Title,
		Info:          request.Info,
		Props:         request.Props,
	}

	err = AddTempTestpaper(&updatedTestPaper)
	if err != nil {
		log.Printf("updated temp-tes-paper error: %s\n", err.Error())
		return "", err
	}

	updatedId := updatedTestPaper.Uuid
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

	_, err := adapter.engine.ID(requset.TestpaperId).Get(&commentTestPaper)

	if err != nil {
		log.Printf("cannot address the test-paper: %s\n", err.Error())
		return err
	}

	newComments := append(commentTestPaper.CommentRecord, newComment)
	newTempTestpaper := TempTestpaper{CommentRecord: newComments}

	_, err = adapter.engine.ID(requset.TestpaperId).Cols("comment_record").Update(&newTempTestpaper)

	if err != nil {
		log.Printf("add new comment error: %s\n", err.Error())
		return err
	}
	return nil
}

func TraceTestpaperVersion(tid string) ([]TempTestpaper, error) {
	var endPointTestPaper TempTestpaper

	_, err := adapter.engine.ID(tid).Get(&endPointTestPaper)
	if err != nil {
		log.Printf("cannot get the end test-paper: %s\n", err.Error())
		return nil, err
	}

	var testPapers []TempTestpaper
	testPapers = append(testPapers, endPointTestPaper)
	isEnd := endPointTestPaper.IsRoot
	currentBaseId := endPointTestPaper.Base

	for !isEnd {
		var currentNode TempTestpaper

		_, err := adapter.engine.ID(currentBaseId).Get(&currentNode)
		if err != nil {
			log.Printf("find middle node cannot find: %s\n", err.Error())
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

	_, err := adapter.engine.ID(tid).Get(&finishedTestPaper)
	if err != nil {
		log.Printf("error to find finished error: %s\n", err.Error())
		return "", nil
	}

	newFinalPaper := FinalTestpaper{
		Uuid:          util.GenUuidV4(),
		SourceProject: finishedTestPaper.SourceProject,
		Author:        finishedTestPaper.Author,
		Title:         finishedTestPaper.Title,
		Info:          finishedTestPaper.Info,
		Props:         finishedTestPaper.Props,
	}

	err = AddFinalTestpaper(&newFinalPaper)

	if err != nil {
		log.Printf("conver to final-test-paper failed: %s\n", err.Error())
		return "", err
	}

	finalTestpaperId := newFinalPaper.Uuid

	log.Printf("convert to final successfully: %s\n", finalTestpaperId)
	return finalTestpaperId, nil
}

func GetUserTempTestpaper(uid string) ([]TempTestpaper, error) {
	var testPapers []TempTestpaper

	err := adapter.engine.Where(builder.Eq{"author": uid}).Find(&testPapers)
	if err != nil {
		log.Printf("find user's temp-test-paper error: %s\n", err.Error())
		return nil, err
	}
	return testPapers, nil
}

func GetUserFinalTestpaper(uid string) ([]FinalTestpaper, error) {
	var testPapers []FinalTestpaper

	err := adapter.engine.Where(builder.Eq{"author": uid}).Find(&testPapers)
	if err != nil {
		log.Printf("find user's final-test-paper error: %s\n", err.Error())
		return nil, err
	}
	return testPapers, nil
}

func GetProjectTempTestpaper(pid string) ([]TempTestpaper, error) {
	var testPapers []TempTestpaper

	err := adapter.engine.Where(builder.Eq{"source_project": pid}).Find(&testPapers)
	if err != nil {
		log.Printf("find project's temp-test-paper error: %s\n", err.Error())
		return nil, err
	}
	return testPapers, nil
}

func GetProjecgtFinalTestpaper(pid string) ([]FinalTestpaper, error) {
	var testPapers []FinalTestpaper

	err := adapter.engine.Where(builder.Eq{"source_project": pid}).Find(&testPapers)
	if err != nil {
		log.Printf("find project's final-test-paper error: %s\n", err.Error())
		return nil, err
	}
	return testPapers, nil
}

func DeleteTempTestpaper(tid string) error {
	_, err := adapter.engine.ID(tid).Delete(&TempTestpaper{})
	if err != nil {
		log.Printf("[delete temptestpaper] delete temptestpaper error: %s\n", err.Error())
		return err
	}
	return nil
}

func DeleteFinalTestpaper(tid string) error {
	_, err := adapter.engine.ID(tid).Delete(&FinalTestpaper{})
	if err != nil {
		log.Printf("[delete finaltestpaper] delete finaltestpaper error: %s\n", err.Error())
		return err
	}
	return nil
}

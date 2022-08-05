package object

import (
	"errors"
	"log"
	"time"
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
	Owner       string `xorm:"varchar(100) notnull pk"`
	Name        string `xorm:"varchar(100) notnull pk"`
	CreatedTime string `xorm:"varchar(100)"`

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
	GradeRange    []string        `xorm:"mediumtext" json:"grade_range"`
	Subjects      []string        `xorm:"mediumtext" json:"subjects"`
	Difficulty    string          `json:"difficulty"`
	TimeLimit     string          `json:"time_limit"`

	time.Time `xorm:"created" json:"create_at"`
	UpdatedAt time.Time `xorm:"updated" json:"updated_at"`
	DeletedAt time.Time `xorm:"deleted" json:"deleted_at"`
}

func AddTempTestpaper(tempTestpaper *TempTestpaper) bool {
	affected, err := adapter.engine.Insert(tempTestpaper)
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func CreateNewTestpaper(request *NewTestpaperRequest) (string, error) {
	newTestPaper := TempTestpaper{
		Owner:       request.Owner,
		Name:        request.Name,
		CreatedTime: time.Now().Format("2006-01-02 15:04:05"),

		IsRoot:        true,
		Base:          "root",
		SourceProject: request.SourceProject,
		Author:        request.Author,
		Title:         request.Title,
		Info:          request.Info,
		Props:         request.Props,
	}

	ok := AddTempTestpaper(&newTestPaper)
	if !ok {
		log.Println("insert new temp-tes-paper error")
		return "", errors.New("insert new temp-tes-paper error")
	}

	tempTestpaperId := request.Owner + "/" + request.Name

	log.Printf("new temp-test-paper created: %s", tempTestpaperId)
	return tempTestpaperId, nil
}

package object

import (
	"log"
	"time"

	"github.com/open-ct/openitem/util"
	"xorm.io/builder"
)

type QuestionInfo struct {
	Title    string `json:"title"`
	Type     string `json:"type"`
	Body     string `json:"body"`
	Answer   string `json:"answer"`
	Solution string `json:"solution"`
}

type QuestionBasicProps struct {
	Encode              string   `json:"encode"`
	Subject             string   `json:"subject"`
	DetailsDimension    string   `json:"details_dimension"`
	SubDetailsDimension string   `json:"sub_details_dimension"`
	AbilityDimension    string   `json:"ability_dimension"`
	SubAbilityDimension string   `json:"sub_ability_dimension"`
	Description         string   `json:"description"`
	SubjectRequirements string   `json:"subject_requirements"`
	Details             string   `json:"details"`
	Keywords            []string `json:"keywords"`
}

type QuestionSpecProps struct {
	Topic       string `json:"topic"`
	ArticleType string `json:"article_type"`
	Length      string `json:"length"`
}

type QuestionExtraProps struct {
	IsScene              bool   `json:"is_scene"`
	IsQuestionGroup      bool   `json:"is_question_group"`
	ReadingMaterialTopic string `json:"reading_material_topic"`
	MaterialLength       int    `json:"material_length"`
}

type QuestionAdvancedProps struct {
	CttLevel  float64 `json:"ctt_level"`
	CttDiff_1 float64 `json:"ctt_diff_1"`
	CttDiff_2 float64 `json:"ctt_diff_2"`
	IrtLevel  float64 `json:"irt_level"`
}

type QuestionComment struct {
	TimePoint time.Time `json:"time_point"`
	Comment   string    `json:"comment"`
	Author    string    `json:"author"`
}

type QuestionApplyRecord struct {
	GradeFits        string   `json:"grade_fits"`
	TestYear         string   `json:"test_year"`
	TestRegion       []string `json:"test_region"`
	ParticipantCount int      `json:"participant_count"`
	TestCount        int      `json:"test_count"`
}

type Task struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

	Preface string   `xorm:"mediumtext" json:"preface"`
	Text    string   `xorm:"mediumtext" json:"text"`
	Type    string   `xorm:"varchar(100)" json:"type"`
	Canvas  string   `xorm:"mediumtext" json:"canvas"`
	Basic   string   `xorm:"mediumtext" json:"basic"`
	Video   string   `xorm:"mediumtext" json:"video"`
	Slides  string   `xorm:"mediumtext" json:"slides"`
	Sketch  string   `xorm:"mediumtext" json:"sketch"`
	Frame   string   `xorm:"mediumtext" json:"frame"`
	Three   string   `xorm:"mediumtext" json:"three"`
	Game    string   `xorm:"mediumtext" json:"game"`
	Deck    string   `xorm:"mediumtext" json:"deck"`
	Extras  []string `xorm:"varchar(1000)" json:"extras"`

	Options []string `xorm:"varchar(100)" json:"options"`
	Answer  []string `xorm:"varchar(100)" json:"answer"`

	SourceProject string `json:"source_project"` // 项目来源
}

type TempQuestion struct {
	Uuid          string                `xorm:"varchar(100) notnull pk"  json:"uuid"`
	IsRoot        bool                  `json:"is_root"` // 临时题目是否是根
	Base          string                `json:"base"`    // 若不是root, 需要设置上级题目, 进行版本管理
	Next          string                `json:"next"`
	SourceProject string                `json:"source_project"` // 项目来源
	Author        string                `json:"author"`
	IsNew         bool                  `json:"is_new"`
	FinalBase     string                `json:"final_base"`
	Info          QuestionInfo          `xorm:"mediumtext json" json:"info"`
	BasicProps    QuestionBasicProps    `xorm:"mediumtext json" json:"basic_props"`
	SpecProps     QuestionSpecProps     `xorm:"mediumtext json" json:"spec_props"`
	ExtraProps    QuestionExtraProps    `xorm:"mediumtext json" json:"extra_props"`
	AdvancedProps QuestionAdvancedProps `xorm:"mediumtext json" json:"advanced_props"`
	ApplyRecord   QuestionApplyRecord   `xorm:"mediumtext json" json:"apply_record"`
	CommentRecord []QuestionComment     `xorm:"mediumtext" json:"comment_record"`
	ChangeLog     string                `json:"change_log"`

	CreateAt  time.Time `xorm:"created" json:"create_at"`
	UpdatedAt time.Time `xorm:"updated" json:"updated_at"`
	DeletedAt time.Time `xorm:"deleted" json:"deleted_at"`
}

type FinalQuestion struct {
	Uuid          string                `xorm:"varchar(100) notnull pk"  json:"uuid"`
	SourceProject string                `json:"source_project"` // 来源项目id
	FinalVersion  string                `json:"final_version"`  // 录入final的最后一个版本
	Author        string                `json:"author"`
	Info          QuestionInfo          `xorm:"mediumtext json" json:"info"`
	BasicProps    QuestionBasicProps    `xorm:"mediumtext json" json:"basic_props"`
	SpecProps     QuestionSpecProps     `xorm:"mediumtext json" json:"spec_props"`
	ExtraProps    QuestionExtraProps    `xorm:"mediumtext json" json:"extra_props"`
	AdvancedProps QuestionAdvancedProps `xorm:"mediumtext json" json:"advanced_props"`
	ApplyRecord   QuestionApplyRecord   `xorm:"mediumtext json" json:"apply_record"`

	CreateAt  time.Time `xorm:"created" json:"create_at"`
	UpdatedAt time.Time `xorm:"updated" json:"updated_at"`
	DeletedAt time.Time `xorm:"deleted" json:"deleted_at"`
}

type AddQuestionCommentRequest struct {
	QuestionId string `json:"question_id"`
	Comment    string `json:"comment"`
	Author     string `json:"author"`
}

func AddTempQuestion(tempQuestion *TempQuestion) error {
	_, err := adapter.engine.Insert(tempQuestion)
	if err != nil {
		panic(err)
	}

	return nil
}

func DeleteTempQuestion(tempQuestion *TempQuestion) bool {
	affected, err := adapter.engine.ID(tempQuestion.Uuid).Delete(&TempQuestion{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func AddFinalQuestion(finalQuestion *FinalQuestion) error {
	_, err := adapter.engine.Insert(finalQuestion)
	if err != nil {
		panic(err)
	}

	return nil
}

func DeleteFinalQuestion(finalQuestion *FinalQuestion) bool {
	affected, err := adapter.engine.ID(finalQuestion.Uuid).Delete(&FinalQuestion{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func CreateNewTempQuestion(request *TempQuestion) (string, error) {
	newTempQuestion := TempQuestion{
		Uuid:          util.GenUuidV4(),
		IsRoot:        true,
		SourceProject: request.SourceProject,
		Author:        request.Author,
		Next:          "null",
		IsNew:         true,
		FinalBase:     "",
		Info:          request.Info,
		BasicProps:    request.BasicProps,
		SpecProps:     request.SpecProps,
		ExtraProps:    request.ExtraProps,
		AdvancedProps: request.AdvancedProps,
		ApplyRecord:   request.ApplyRecord,
		ChangeLog:     request.ChangeLog,
		CommentRecord: nil,
	}
	newTempQuestion.Base = newTempQuestion.Uuid

	err := AddTempQuestion(&newTempQuestion)
	if err != nil {
		log.Printf("insert new temp-question error: %s\n", err.Error())
		return "", err
	}

	tempTestQuestionId := newTempQuestion.Uuid

	log.Printf("new temp-question created: %s\n", tempTestQuestionId)
	return tempTestQuestionId, nil
}

func UpdateQuestion(request *TempQuestion) (string, error) {
	var oldQuestion TempQuestion

	_, err := adapter.engine.ID(request.Base).Get(&oldQuestion)
	if err != nil {
		log.Println("base question cannot find")
		return "", err
	}

	newTempQuestion := TempQuestion{
		Uuid:          util.GenUuidV4(),
		IsRoot:        false,
		Base:          request.Base,
		Next:          "null",
		SourceProject: oldQuestion.SourceProject,
		Author:        oldQuestion.Author,
		IsNew:         oldQuestion.IsNew,
		FinalBase:     oldQuestion.FinalBase,
		Info:          request.Info,
		BasicProps:    request.BasicProps,
		SpecProps:     request.SpecProps,
		ExtraProps:    request.ExtraProps,
		AdvancedProps: request.AdvancedProps,
		ApplyRecord:   request.ApplyRecord,
		ChangeLog:     request.ChangeLog,
		CommentRecord: nil,
	}

	err = AddTempQuestion(&newTempQuestion)
	if err != nil {
		log.Printf("update a temp-question error: %s\n", err.Error())
		return "", err
	}

	updatedId := newTempQuestion.Uuid

	_, err = adapter.engine.ID(request.Base).Cols("next").Update(&TempQuestion{Next: updatedId})
	if err != nil {
		return "", err
	}

	log.Printf("temp-question updated: %s\n", updatedId)
	return updatedId, nil
}

func UpdateFinalQuestion(request *TempQuestion) error {
	newFinalQuestion := FinalQuestion{
		FinalVersion:  request.Uuid,
		Info:          request.Info,
		BasicProps:    request.BasicProps,
		SpecProps:     request.SpecProps,
		ExtraProps:    request.ExtraProps,
		AdvancedProps: request.AdvancedProps,
		ApplyRecord:   request.ApplyRecord,
	}

	_, err := adapter.engine.ID(request.FinalBase).Update(&newFinalQuestion)
	if err != nil {
		return err
	}

	return nil
}

func TraceQuestionVersion(qid string) ([]TempQuestion, error) {
	var endPointQuestion TempQuestion

	_, err := adapter.engine.ID(qid).Get(&endPointQuestion)
	if err != nil {
		log.Printf("find base questions failed, qid: [%s] %s\n", qid, err.Error())
		return nil, err
	}

	var questions []TempQuestion
	questions = append(questions, endPointQuestion)
	isEnd := endPointQuestion.IsRoot
	currentBaseId := endPointQuestion.Base

	for !isEnd {
		var currentNode TempQuestion

		_, err := adapter.engine.ID(currentBaseId).Get(&currentNode)
		if err != nil {
			log.Printf("find middle-node questions failed, qid: [%s] %s\n", currentBaseId, err.Error())
			return questions, err
		}
		questions = append(questions, currentNode)
		isEnd = currentNode.IsRoot == true
		currentBaseId = currentNode.Base
	}
	return questions, nil
}

func AddQuestionComment(request *AddQuestionCommentRequest) error {
	newComment := QuestionComment{
		TimePoint: time.Now(),
		Comment:   request.Comment,
		Author:    request.Author,
	}
	var commentQuestion TempQuestion

	_, err := adapter.engine.ID(request.QuestionId).Get(&commentQuestion)
	if err != nil {
		log.Printf("cannot address the question: %s for %s\n", request.QuestionId, err.Error())
		return err
	}
	newComments := append(commentQuestion.CommentRecord, newComment)
	newTempQuestion := TempQuestion{CommentRecord: newComments}

	_, err = adapter.engine.ID(request.QuestionId).Cols("comment_record").Update(&newTempQuestion)
	if err != nil {
		log.Printf("add new comment error: %s\n", err.Error())
		return err
	}
	return nil
}

func FinishTempQuestion(qid string) (string, error) {
	var tempQuestion TempQuestion

	_, err := adapter.engine.ID(qid).Get(&tempQuestion)
	if err != nil {
		log.Printf("cannot address the question: %s for %s\n", qid, err.Error())
		return "", err
	}
	finalQuestion := FinalQuestion{
		Uuid:          util.GenUuidV4(),
		SourceProject: tempQuestion.SourceProject,
		FinalVersion:  qid,
		Author:        tempQuestion.Author,
		Info:          tempQuestion.Info,
		BasicProps:    tempQuestion.BasicProps,
		SpecProps:     tempQuestion.SpecProps,
		ExtraProps:    tempQuestion.ExtraProps,
		AdvancedProps: tempQuestion.AdvancedProps,
		ApplyRecord:   tempQuestion.ApplyRecord,
	}

	err = AddFinalQuestion(&finalQuestion)
	if err != nil {
		log.Printf("conver to final-question failed: %s\n", err.Error())
		return "", err
	}

	finalQuestionId := finalQuestion.Uuid

	log.Printf("convert to final successfully: %s\n", finalQuestionId)
	return finalQuestionId, nil
}

func GetUserTempQuestions(uid string) ([]TempQuestion, error) {
	var questions []TempQuestion

	err := adapter.engine.Where(builder.Eq{"author": uid, "next": "null"}).Find(&questions)
	if err != nil {
		log.Printf("find user's temp-question error: %s\n", err.Error())
		return nil, err
	}
	return questions, nil
}

func GetUserFinalQuestions(uid string) ([]FinalQuestion, error) {
	var questions []FinalQuestion

	err := adapter.engine.Where(builder.Eq{"author": uid}).Find(&questions)
	if err != nil {
		log.Printf("find user's final-question error: %s\n", err.Error())
		return nil, err
	}
	return questions, nil
}

func GetProjectTempQuestions(pid string) ([]TempQuestion, error) {
	var questions []TempQuestion

	err := adapter.engine.Where(builder.Eq{"source_project": pid, "next": "null"}).Find(&questions)
	if err != nil {
		log.Printf("find project's temp-question error: %s\n", err.Error())
		return nil, err
	}
	return questions, nil
}

func GetProjectFinalQuestions(pid string) ([]FinalQuestion, error) {
	var questions []FinalQuestion

	err := adapter.engine.Where(builder.Eq{"source_project": pid}).Find(&questions)
	if err != nil {
		log.Printf("find project's final-question error: %s\n", err.Error())
		return nil, err
	}
	return questions, nil
}

// QueryTempQuestions 进行批量查询的方法
func QueryTempQuestions(idList []string) map[string]TempQuestion {
	questionsMap := make(map[string]TempQuestion)
	for _, id := range idList {
		var question TempQuestion

		_, err := adapter.engine.ID(id).Get(&question)
		if err != nil {
			log.Printf("get temp-question error: [%s] %s\n", id, err.Error())
			continue
		}
		questionsMap[id] = question
	}
	return questionsMap
}

func SearchQuestion(bodyString string) ([]FinalQuestion, error) {
	var questions []FinalQuestion

	err := adapter.engine.Where("info like ?", "%\\\"body\\\":\\\"%"+bodyString+"%\\\"%").Find(&questions)
	if err != nil {
		log.Printf("search final-question error: %s\n", err.Error())
		return nil, err
	}

	return questions, nil
}

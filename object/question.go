package object

import (
	"fmt"
	"log"
	"time"

	"github.com/open-ct/openitem/util"
	"xorm.io/builder"
	"xorm.io/core"
)

type QuestionInfo struct {
	Title    string `json:"title" bson:"title"`
	Type     string `json:"type" bson:"type"`
	Body     string `json:"body" bson:"body"`
	Answer   string `json:"answer" bson:"answer"`
	Solution string `json:"solution" bson:"solution"`
}

type QuestionBasicProps struct {
	Encode              string   `json:"encode" bson:"encode"`
	Subject             string   `json:"subject" bson:"subject"`
	DetailsDimension    string   `json:"details_dimension" bson:"details_dimension"`
	SubDetailsDimension string   `json:"sub_details_dimension" bson:"sub_details_dimension"`
	AbilityDimension    string   `json:"ability_dimension" bson:"ability_dimension"`
	SubAbilityDimension string   `json:"sub_ability_dimension" bson:"sub_ability_dimension"`
	Description         string   `json:"description" bson:"description"`
	SubjectRequirements string   `json:"subject_requirements" bson:"subject_requirements"`
	Details             string   `json:"details" bson:"details"`
	Keywords            []string `json:"keywords" bson:"keywords"`
}

type QuestionSpecProps struct {
	Topic       string `json:"topic" bson:"topic"`
	ArticleType string `json:"article_type" bson:"article_type"`
	Length      string `json:"length" bson:"length"`
}

type QuestionExtraProps struct {
	IsScene              bool   `json:"is_scene" bson:"is_scene"`
	IsQuestionGroup      bool   `json:"is_question_group" bson:"is_question_group"`
	ReadingMaterialTopic string `json:"reading_material_topic" bson:"reading_material_topic"`
	MaterialLength       int    `json:"material_length" bson:"material_length"`
}

type QuestionAdvancedProps struct {
	CttLevel  float64 `json:"ctt_level" bson:"ctt_level"`
	CttDiff_1 float64 `json:"ctt_diff_1" bson:"ctt_diff_1"`
	CttDiff_2 float64 `json:"ctt_diff_2" bson:"ctt_diff_2"`
	IrtLevel  float64 `json:"irt_level" bson:"irt_level"`
}

type QuestionComment struct {
	TimePoint time.Time `json:"time_point" bson:"time_point"`
	Comment   string    `json:"comment" bson:"comment"`
	Author    string    `json:"author" bson:"author"`
}

type QuestionApplyRecord struct {
	GradeFits        string   `json:"grade_fits" bson:"grade_fits"`
	TestYear         string   `json:"test_year" bson:"test_year"`
	TestRegion       []string `json:"test_region" bson:"test_region"`
	ParticipantCount int      `json:"participant_count" bson:"participant_count"`
	TestCount        int      `json:"test_count" bson:"test_count"`
}

type TempQuestion struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

	IsRoot        bool                  `json:"is_root"`        // 临时题目是否是根
	Base          string                `json:"base"`           // 若不是root, 需要设置上级题目, 进行版本管理
	SourceProject string                `json:"source_project"` // 项目来源
	Author        string                `json:"author"`
	Info          QuestionInfo          `xorm:"mediumtext json" json:"info"`
	BasicProps    QuestionBasicProps    `xorm:"mediumtext json" json:"basic_props"`
	SpecProps     QuestionSpecProps     `xorm:"mediumtext json" json:"spec_props"`
	ExtraProps    QuestionExtraProps    `xorm:"mediumtext json" json:"extra_props"`
	AdvancedProps QuestionAdvancedProps `xorm:"mediumtext json" json:"advanced_props"`
	ApplyRecord   QuestionApplyRecord   `xorm:"mediumtext json" json:"apply_record"`
	CommentRecord []QuestionComment     `xorm:"mediumtext" json:"comment_record"`

	CreateAt  time.Time `xorm:"created" json:"create_at"`
	UpdatedAt time.Time `xorm:"updated" json:"updated_at"`
	DeletedAt time.Time `xorm:"deleted" json:"deleted_at"`
}

type FinalQuestion struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`

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
	Author     string `json:"'author'"`
}

func getTempQuestion(owner string, name string) *TempQuestion {
	tempQuestion := TempQuestion{Owner: owner, Name: name}
	existed, err := adapter.engine.Get(&tempQuestion)
	if err != nil {
		panic(err)
	}

	if existed {
		return &tempQuestion
	} else {
		return nil
	}
}

func GetTempQuestion(id string) *TempQuestion {
	owner, name := util.GetOwnerAndNameFromId(id)
	return getTempQuestion(owner, name)
}

func UpdateTempQuestion(id string, tempQuestion *TempQuestion) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	if getTempQuestion(owner, name) == nil {
		return false
	}

	_, err := adapter.engine.ID(core.PK{owner, name}).AllCols().Update(tempQuestion)
	if err != nil {
		panic(err)
	}

	// return affected != 0
	return true
}

func AddTempQuestion(tempQuestion *TempQuestion) error {
	_, err := adapter.engine.Insert(tempQuestion)
	if err != nil {
		panic(err)
	}

	return nil
}

func DeleteTempQuestion(tempQuestion *TempQuestion) bool {
	affected, err := adapter.engine.ID(core.PK{tempQuestion.Owner, tempQuestion.Name}).Delete(&TempQuestion{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func getFinalQuestion(owner string, name string) *FinalQuestion {
	finalQuestion := FinalQuestion{Owner: owner, Name: name}
	existed, err := adapter.engine.Get(&finalQuestion)
	if err != nil {
		panic(err)
	}

	if existed {
		return &finalQuestion
	} else {
		return nil
	}
}

func GetFinalQuestion(id string) *FinalQuestion {
	owner, name := util.GetOwnerAndNameFromId(id)
	return getFinalQuestion(owner, name)
}

func UpdateFinalQuestion(id string, finalQuestion *FinalQuestion) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	if getFinalQuestion(owner, name) == nil {
		return false
	}

	_, err := adapter.engine.ID(core.PK{owner, name}).AllCols().Update(finalQuestion)
	if err != nil {
		panic(err)
	}

	// return affected != 0
	return true
}

func AddFinalQuestion(finalQuestion *FinalQuestion) error {
	_, err := adapter.engine.Insert(finalQuestion)
	if err != nil {
		panic(err)
	}

	return nil
}

func DeleteFinalQuestion(finalQuestion *FinalQuestion) bool {
	affected, err := adapter.engine.ID(core.PK{finalQuestion.Owner, finalQuestion.Name}).Delete(&FinalQuestion{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

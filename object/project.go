package object

import (
	"fmt"
	"log"
	"time"

	"github.com/open-ct/openitem/util"
	"xorm.io/builder"
	"xorm.io/core"
)

type Project struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"created_time"`

	Creator   string           `xorm:"varchar(256) index" json:"creator"`
	Status    int              `json:"status"`
	BasicInfo ProjectBasicInfo `xorm:"mediumtext json" json:"basic_info"`

	CreateAt  time.Time `xorm:"created" json:"create_at"`
	UpdatedAt time.Time `xorm:"updated" json:"updated_at"`
	DeletedAt time.Time `xorm:"deleted" json:"deleted_at"`
}

type ProjectBasicInfo struct {
	Name        string   `xorm:"index" json:"name"`
	Description string   `json:"description"`
	Requirement string   `json:"requirement"`
	Target      string   `json:"target"`
	GradeRange  []string `xorm:"mediumtext" json:"grade_range"`
	Subjects    []string `xorm:"mediumtext" json:"subjects"`
	Summary     string   `json:"summary"`
}

type ProjectGroup struct {
	Admins     []string `json:"admin" bson:"admin"`
	Experts    []string `json:"expert" bson:"expert"`
	Assistants []string `json:"assistant" bson:"assistant"`
	Teachers   []string `json:"teachers" bson:"teachers"`
	OutExperts []string `json:"out_experts" bson:"out_experts"`
}

type ProjectMaterials struct {
	Questions  []string `json:"questions" bson:"questions"`
	ExamPapers []string `json:"exam_papers" bson:"exam_papers"`
	Files      []string `json:"files" bson:"files"`
}

// ProjectTimeTable describe the timeline of a project
type ProjectTimeTable struct {
	TimePoints []ProjectTimePoint `json:"time_points" bson:"time_points"`
}

type ProjectTimePoint struct {
	Title     string    `json:"title" bson:"title"`
	StartTime time.Time `json:"start_time" bson:"start_time"`
	EndTime   time.Time `json:"end_time" bson:"end_time"`
	Notice    string    `json:"notice" bson:"notice"`
	Comment   string    `json:"comment" bson:"comment"`
}

type ProjectFullInfo struct {
	BasicInfo Project          `json:"basic_info" bson:"basic_info"`
	Group     ProjectGroup     `json:"group" bson:"group"`
	TimeTable ProjectTimeTable `json:"time_table" bson:"time_table"`
	Materials ProjectMaterials `json:"materials" bson:"materials"`
	Steps     []Step           `json:"steps" bson:"steps"`
	Submits   []Submit         `json:"submits" bson:"submits"`
	Audits    []Audit          `json:"audits" bson:"audits"`
}

func getProject(owner string, name string) *Project {
	project := Project{Owner: owner, Name: name}
	existed, err := adapter.engine.Get(&project)
	if err != nil {
		panic(err)
	}

	if existed {
		return &project
	} else {
		return nil
	}
}

func GetProject(id string) *Project {
	owner, name := util.GetOwnerAndNameFromId(id)
	return getProject(owner, name)
}

func UpdateProject(id string, project *Project) bool {
	owner, name := util.GetOwnerAndNameFromId(id)
	if getProject(owner, name) == nil {
		return false
	}

	_, err := adapter.engine.ID(core.PK{owner, name}).AllCols().Update(project)
	if err != nil {
		panic(err)
	}

	// return affected != 0
	return true
}

func AddProject(project *Project) error {
	_, err := adapter.engine.Insert(project)
	if err != nil {
		panic(err)
	}

	return nil
}

func DeleteProject(project *Project) bool {
	affected, err := adapter.engine.ID(core.PK{project.Owner, project.Name}).Delete(&Project{})
	if err != nil {
		panic(err)
	}

	return affected != 0
}

func CreateEmptyProject(req *Project) (string, error) {
	newProject := Project{
		Owner:       req.Owner,
		Name:        req.Name,
		CreatedTime: time.Now().Format("2006-01-02 15:04:05"),

		Creator: req.Owner,
		Status:  0,
		BasicInfo: ProjectBasicInfo{
			Name:        req.Name,
			Description: req.BasicInfo.Description,
			Requirement: req.BasicInfo.Requirement,
			Target:      req.BasicInfo.Target,
			GradeRange:  req.BasicInfo.GradeRange,
			Subjects:    req.BasicInfo.Subjects,
			Summary:     req.BasicInfo.Summary,
		},
	}

	err := AddProject(&newProject)
	if err != nil {
		log.Printf("create new project: %s\n", err.Error())
		return "", err
	}

	// create the assignment: creator is an admin of the project
	assign := Assignment{
		Uuid:        util.GenUuidV4(),
		UserId:      req.Owner,
		ProjectId:   fmt.Sprintf("%s/%s", req.Owner, req.Name),
		Role:        1,
		Operator:    "system",
		IsConfirmed: true,
		Status:      0,
	}

	_, err = adapter.engine.Insert(&assign)
	if err != nil {
		log.Printf("[Mongo] Create project's assignment error: %s\n", err.Error())
		// delete project
		adapter.engine.ID(core.PK{newProject.Owner, newProject.Name}).Delete(&Project{})
		return "", err
	}

	insertedId := fmt.Sprintf("%s/%s", req.Owner, req.Name)

	log.Printf("[Project] New project has been created pid:%s\n", insertedId)
	return insertedId, nil
}

func CreateTemplateProject(req *Project) (string, error) {
	newProject := Project{
		Owner:       req.Owner,
		Name:        req.Name,
		CreatedTime: time.Now().Format("2006-01-02 15:04:05"),

		Creator: req.Owner,
		Status:  0,
		BasicInfo: ProjectBasicInfo{
			Name:        req.Name,
			Description: req.BasicInfo.Description,
			Requirement: req.BasicInfo.Requirement,
			Target:      req.BasicInfo.Target,
			GradeRange:  req.BasicInfo.GradeRange,
			Subjects:    req.BasicInfo.Subjects,
			Summary:     req.BasicInfo.Summary,
		},
	}
	err := AddProject(&newProject)
	if err != nil {
		log.Printf("create new project: %s\n", err.Error())
		return "", err
	}

	// create the assignment: creator is an admin of the project
	assign := Assignment{
		Uuid:        util.GenUuidV4(),
		UserId:      req.Owner,
		ProjectId:   fmt.Sprintf("%s/%s", req.Owner, req.Name),
		Role:        1,
		Operator:    "system",
		IsConfirmed: true,
		Status:      0,
	}

	_, err = adapter.engine.Insert(&assign)
	if err != nil {
		log.Printf("Create project's assignment error: %s\n", err.Error())
		// delete project
		adapter.engine.ID(core.PK{newProject.Owner, newProject.Name}).Delete(&Project{})
		return "", err
	}

	// create 7 standard steps
	// use transaction
	callback := func() (interface{}, error) {
		session := adapter.engine.NewSession()
		defer session.Close()

		stepName := []string{
			"组建团队", "测试框架与论证报告", "6人访谈", "30人测试", "试题外审", "300人测试", "定稿审查",
		}
		for i := 0; i < 7; i++ {
			statusString := "未开始"
			if i == 0 {
				statusString = "未通过"
			}

			step := Step{
				Uuid: util.GenUuidV4(),
				Name: stepName[i],

				ProjectId: fmt.Sprintf("%s/%s", newProject.Owner, newProject.Name),
				StepIndex: i,
				Status:    statusString,
				Creator:   req.Owner,
			}

			_, err := session.Insert(step)
			if err != nil {
				return nil, err
			}

			insertedStepId := step.Uuid

			log.Printf("[create step] template steps successfully %s\n", insertedStepId)
		}

		err := session.Commit()
		if err != nil {
			return nil, err
		}

		return nil, nil
	}
	_, err = callback()
	if err != nil {
		log.Printf("Create project's template step error: %s\n", err.Error()) // delete project
		adapter.engine.ID(core.PK{newProject.Owner, newProject.Name}).Delete(&Project{})
		adapter.engine.ID(assign.Uuid).Delete(&Assignment{})
		return "", err
	}

	insertedProjectId := fmt.Sprintf("%s/%s", newProject.Owner, newProject.Name)

	log.Printf("[Project] New project and assignment and stand steps has been created pid:%s\n", insertedProjectId)
	return insertedProjectId, nil
}

func UpdateProjectInfo(req *Project) error {
	var updateProject Project

	if req.Name != "" {
		updateProject.Name = req.Name
	}
	if req.BasicInfo.Description != "" {
		updateProject.BasicInfo.Description = req.BasicInfo.Description
	}
	if req.BasicInfo.Requirement != "" {
		updateProject.BasicInfo.Requirement = req.BasicInfo.Requirement
	}
	if req.BasicInfo.Target != "" {
		updateProject.BasicInfo.Target = req.BasicInfo.Target
	}
	if req.BasicInfo.Summary != "" {
		updateProject.BasicInfo.Summary = req.BasicInfo.Summary
	}
	if len(req.BasicInfo.Subjects) != 0 {
		updateProject.BasicInfo.Subjects = req.BasicInfo.Subjects
	}
	if len(req.BasicInfo.GradeRange) != 0 {
		updateProject.BasicInfo.GradeRange = req.BasicInfo.GradeRange
	}

	_, err := adapter.engine.ID(core.PK{req.Owner, req.Name}).Update(&updateProject)
	if err != nil {
		log.Printf("[project] update project info: %s\n", err.Error())
		return err
	}
	return nil
}

func GetProjectBasicInfo(pid string) (*Project, error) {
	var p Project

	owner, name := util.GetOwnerAndNameFromId(pid)
	_, err := adapter.engine.ID(core.PK{owner, name}).Get(&p)
	if err != nil {
		log.Printf("[project] get project info: %s\n", err.Error())
		return nil, err
	}
	return &p, nil
}

func GetProjectDetailedInfo(pid string) (map[string]interface{}, error) {
	projectInfo := make(map[string]interface{})
	basicInfo, err := GetProjectBasicInfo(pid)
	if err != nil {
		return nil, err
	}
	projectInfo["basic_info"] = basicInfo

	// get group
	projectGroup, err := GetProjectAssignment(pid)
	if err != nil {
		return nil, err
	}
	projectInfo["group"] = projectGroup

	// get steps & all references
	var projectSteps []Step

	err = adapter.engine.Where(builder.Eq{"project_id": pid}).Asc("step_index").Find(&projectSteps)
	if err != nil {
		return nil, err
	}
	projectInfo["steps"] = projectSteps
	// find in submit
	var projectMaterials ProjectMaterials
	for _, step := range projectSteps {
		var submits []Submit

		stepId := step.Uuid
		err = adapter.engine.Where(builder.Eq{"step_id": stepId}).Find(&submits)
		if err != nil {
			return nil, err
		}
		for _, submit := range submits {
			for _, content := range submit.Contents {
				if content.Type == 0 {
					projectMaterials.Files = append(projectMaterials.Files, content.ItemId)
				}
				if content.Type == 1 {
					projectMaterials.Questions = append(projectMaterials.Questions, content.ItemId)
				}
				if content.Type == 2 {
					projectMaterials.ExamPapers = append(projectMaterials.ExamPapers, content.ItemId)
				}
			}
		}
	}
	projectInfo["materials"] = projectMaterials

	nowStep, _ := getProjectStep(pid)
	projectInfo["now_step"] = nowStep

	return projectInfo, nil
}

// QueryProjects get project list
func QueryProjects(ids []string) map[string]Project {
	projs := make(map[string]Project)
	for _, id := range ids {
		var p Project

		owner, name := util.GetOwnerAndNameFromId(id)
		_, err := adapter.engine.ID(core.PK{owner, name}).Get(&p)
		if err != nil {
			continue
		}
		projs[id] = p
	}
	return projs
}

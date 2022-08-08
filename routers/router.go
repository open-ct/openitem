package routers

import (
	"github.com/astaxie/beego"

	"github.com/open-ct/openitem/controllers"
)

func init() {
	initAPI()
}

func initAPI() {
	ns :=
		beego.NewNamespace("/api",
			beego.NSInclude(
				&controllers.ApiController{},
			),
		)
	beego.AddNamespace(ns)

	beego.Router("/api/signin", &controllers.ApiController{}, "POST:Signin")
	beego.Router("/api/signout", &controllers.ApiController{}, "POST:Signout")
	beego.Router("/api/get-account", &controllers.ApiController{}, "GET:GetAccount")

	beego.Router("/api/get-global-datasets", &controllers.ApiController{}, "GET:GetGlobalDatasets")
	beego.Router("/api/get-datasets", &controllers.ApiController{}, "GET:GetDatasets")
	beego.Router("/api/get-dataset", &controllers.ApiController{}, "GET:GetDataset")
	beego.Router("/api/update-dataset", &controllers.ApiController{}, "POST:UpdateDataset")
	beego.Router("/api/add-dataset", &controllers.ApiController{}, "POST:AddDataset")
	beego.Router("/api/delete-dataset", &controllers.ApiController{}, "POST:DeleteDataset")

	// project
	beego.Router("/api/review/proj", &controllers.ApiController{}, "POST:CreateEmptyProject")
	beego.Router("/api/review/proj/template", &controllers.ApiController{}, "POST:CreatTemplateProject")
	beego.Router("/api/review/proj", &controllers.ApiController{}, "PUT:UpdateProjectInfo")
	beego.Router("/api/review/proj/basic", &controllers.ApiController{}, "GET:GetBasicInfo")
	beego.Router("/api/review/proj/detailed", &controllers.ApiController{}, "GET:GetDetailedInfo")
	// audit
	beego.Router("/api/review/proj/audit", &controllers.ApiController{}, "GET:GetOneAudit")
	beego.Router("/api/review/proj/audits", &controllers.ApiController{}, "GET:GetAuditsInSubmit")
	beego.Router("/api/review/proj/audit", &controllers.ApiController{}, "POST:CreateOneAudit")
	beego.Router("/api/review/proj/audit", &controllers.ApiController{}, "PUT:CorrectAudit")
	beego.Router("/api/review/proj/audit", &controllers.ApiController{}, "DELETE:DeleteAudit")
	// step
	beego.Router("/api/review/proj/step", &controllers.ApiController{}, "POST:CreateOneStep")
	beego.Router("/api/review/proj/step", &controllers.ApiController{}, "GET:GetOneStepInfo")
	beego.Router("/api/review/proj/steps", &controllers.ApiController{}, "GET:GetStepsInProject")
	beego.Router("/api/review/proj/step/attachment", &controllers.ApiController{}, "POST:UploadStepAttachment")
	beego.Router("/api/review/proj/step", &controllers.ApiController{}, "PUT:UpdateStepInfo")
	beego.Router("/api/review/proj/step/status", &controllers.ApiController{}, "PUT:SetStepStatus")
	beego.Router("/api/review/proj/step/timepoint", &controllers.ApiController{}, "PUT:SetStepTimePoint")
	beego.Router("/api/review/proj/step/timepoint", &controllers.ApiController{}, "DELETE:DeleteStepTimePoint")
	beego.Router("/api/review/proj/step/stat", &controllers.ApiController{}, "GET:GetStepStatisticData")
	beego.Router("/api/review/proj/step", &controllers.ApiController{}, "DELETE:DeleteStep")
}

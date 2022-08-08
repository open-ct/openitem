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
}

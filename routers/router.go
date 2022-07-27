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

	beego.Router("/api/get-top-posts", &controllers.ApiController{}, "POST:GetTopPosts")
}

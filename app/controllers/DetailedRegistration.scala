package controllers

import play.api.mvc._
import play.api._
import play.api.data._
import play.api.data.Forms._
import models.DetailedRegForm
import models.User


object DetailedRegistration extends Controller {
  val detailed_regForm = Form(
    mapping(
      "schoolName" -> nonEmptyText)(DetailedRegForm.apply)(DetailedRegForm.unapply))

  def users = Action {
    Ok(views.html.detailed_reg(detailed_regForm))
  }

  def addInfo = Action { implicit request =>
    detailed_regForm.bindFromRequest.fold(
      errors => BadRequest(views.html.detailed_reg(errors)),
      detailed_regForm => {
        User.addInfo(detailed_regForm,request.session.get("userId").get.toInt)
        Redirect(routes.DetailedRegistration.users)

      })
  }
}
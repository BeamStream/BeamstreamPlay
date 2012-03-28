package controllers

import play.api.mvc._
import play.api._
import play.api.data._
import play.api.data.Forms._
import models.DetailedRegForm
import models.User
import models.Stream


object DetailedRegistration extends Controller {
  
  /*
   * Map the field values from html
   */
  val detailed_regForm = Form(
    mapping(
      "schoolName" -> nonEmptyText)(DetailedRegForm.apply)(DetailedRegForm.unapply))

  def users = Action {
    Ok(views.html.detailed_reg(detailed_regForm))
  }
  
  /*
   * Sends the field values to User Model for adding the info of a User
   */

  def addInfo = Action { implicit request =>
    detailed_regForm.bindFromRequest.fold(
      errors => BadRequest(views.html.detailed_reg(errors)),
      detailed_regForm => {
        User.addInfo(detailed_regForm,request.session.get("userId").get.toInt)
        Redirect(routes.MessageController.messages)

      })
  }
}
package controllers

import models.BasicRegForm
import models.Stream
import models.User
import play.api.data.Forms._
import play.api.data._
import play.api.mvc._
import play.api._
import utils.SendEmail
import models.TokenDAO
import com.mongodb.casbah.commons.MongoDBObject

object BasicRegistration extends Controller {

  val basicRegForm = Form(
    mapping(
      "userName" -> nonEmptyText,
      "password" -> nonEmptyText,
      "orgName" -> nonEmptyText,
      "firstName" -> nonEmptyText,
      "lastName" -> nonEmptyText,
      "email" -> nonEmptyText,
      "location" -> nonEmptyText,
      "iam" -> nonEmptyText,
      "useCurrentLocation" -> optional(checked("")))(BasicRegForm.apply)(BasicRegForm.unapply))

  def basicRegistration(iam: String, emailId: String, token: String) = Action { implicit request =>
    val findToken = TokenDAO.find(MongoDBObject("tokenString" -> token)).toList
    (findToken.size == 0) match {
      case false => Ok(views.html.basic_reg(basicRegForm, emailId, iam, "", ""))
      case true => Ok("Token Not Valid")
    }

  }

  def basicRegistrationViaSocialSites(email: String, userName: String, firstName: String) = Action { implicit request =>
    Ok(views.html.basic_reg(basicRegForm, email, "1", userName, firstName))
  }
  
  

  def newUser = Action { implicit request =>
       //println("Getting the values from post request [" + request.body+"]")
    basicRegForm.bindFromRequest.fold(
      errors => BadRequest(views.html.basic_reg(errors, "", "", "", "")),
      basicRegForm => {

        val IdOfUserCreted = User.createNewUser(basicRegForm)
        val RegistrationSession = request.session + ("userId" -> IdOfUserCreted.toString)
        Redirect(routes.MessageController.messages).withSession(RegistrationSession)
      })

  }

  def emailSent = Action { implicit request =>

    SendEmail.sendEmail((request.flash.get("email")).get.toString, (request.flash.get("iam")).get.toString)
    Ok(views.html.emailpopup())

  }

}
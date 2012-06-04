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
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }

object BasicRegistration extends Controller {

  implicit val formats = DefaultFormats

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
    Ok(views.html.basic_reg(basicRegForm, emailId, iam, "", ""))
    //    val findToken = TokenDAO.find(MongoDBObject("tokenString" -> token)).toList
    //    (findToken.size == 0) match {
    //      case false => Ok(views.html.basic_reg(basicRegForm, emailId, iam, "", ""))
    //      case true => Ok("Token Not Valid")
    //    }

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
    val userInformationMap = request.body.asFormUrlEncoded.get
    val tempUserInformationJson = userInformationMap("data").toList(0)
    val userInformationJson = net.liftweb.json.parse(tempUserInformationJson)

    val iam = (userInformationJson \ "iam").extract[String]
    val emailId = (userInformationJson \ "email").extract[String]
    println(emailId)
    println(iam)
    
    SendEmail.sendEmail(emailId,iam)
   
    Ok
  }

}
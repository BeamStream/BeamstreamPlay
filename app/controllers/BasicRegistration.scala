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
import models.ResulttoSent
import models.ResulttoSent
import models.ResulttoSentForBasicRegistration

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

  /*
  * Basic Registration Permissions for a User     
  */

  //(iam: String, emailId: String, token: String)
  def basicRegistration = Action { implicit request =>

    val tokenJSON = request.body.asFormUrlEncoded.get
    val tokenString = tokenJSON("token").toList(0)

    val findToken = TokenDAO.find(MongoDBObject("tokenString" -> tokenString)).toList

    val successJson = write(new ResulttoSent("Success", "Allow To SignUp"))
    val failureJson = write(new ResulttoSent("Failure", "Do Not Allow To SignUp"))

    (findToken.size == 0) match {
      case false => Ok(successJson).as("application/json")

      case true => Ok(failureJson).as("application/json")
    }

  }

  def basicRegistrationViaSocialSites(email: String, userName: String, firstName: String) = Action { implicit request =>
    Ok(views.html.basic_reg(basicRegForm, email, "1", userName, firstName))
  }

  def newUser = Action { implicit request =>

    basicRegForm.bindFromRequest.fold(
      errors => BadRequest(views.html.basic_reg(errors, "", "", "", "")),
      basicRegForm => {

        val IdOfUserCreted = User.createNewUser(basicRegForm)
        val RegistrationSession = request.session + ("userId" -> IdOfUserCreted.toString)
        Redirect(routes.MessageController.messages).withSession(RegistrationSession)
      })

  }
  /*
   * Send the verification mail to the User
   */

  def emailSent = Action { implicit request =>

    val userInformationMap = request.body.asFormUrlEncoded.get
    val tempUserInformationJson = userInformationMap("data").toList(0)
    val userInformationJson = net.liftweb.json.parse(tempUserInformationJson)

    val iam = (userInformationJson \ "iam").extract[String]
    val emailId = (userInformationJson \ "email").extract[String]
    println(emailId)
    println(iam)
    SendEmail.sendEmail(emailId, iam)

    val jsonResponseToSent = new ResulttoSent("Success", "Email Sent Successfully")
    val finalJson = write(jsonResponseToSent)

    Ok(finalJson).as("application/json")
  }

}
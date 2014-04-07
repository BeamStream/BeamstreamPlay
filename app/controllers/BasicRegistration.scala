package controllers

import java.text.SimpleDateFormat
import org.bson.types.ObjectId
import actors.UtilityActor
import models.ResulttoSent
import models.User
import models.UserType
import net.liftweb.json.Serialization.write
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.ObjectIdSerializer
import utils.PasswordHashingUtil
import utils.TokenEmailUtil
import java.util.Date
import play.api.mvc.AnyContent

object BasicRegistration extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter: SimpleDateFormat = new SimpleDateFormat("dd/MM/yyyy")
  } + new ObjectIdSerializer

  /**
   * ***************************************************** Re architecture ******************************
   */

  /**
   * SignUp Page Rendering (V)
   */
  def signUpPage: Action[AnyContent] = Action { implicit request =>
    (request.session.get("userId")) match {
      case None =>
        Ok(views.html.signup())
      case Some(user) =>
        val userFound = User.getUserProfile(new ObjectId(request.session.get("userId").getOrElse("")))
        userFound match {
          case Some(user) => {
            user.classes.isEmpty match {
              case true => Redirect("/class")
              case false => Redirect("/stream")
            }
          }
          case None => Redirect("/signOut")
        }
    }
  }

  /**
   * Registering a new User to Beamstream
   */

  def signUpUser: Action[AnyContent] = Action { implicit request =>
    val userInfoJsonMap = request.body.asJson.get
    val iam = (userInfoJsonMap \ "iam").as[String]
    val emailId = (userInfoJsonMap \ "mailId").as[String]
    val password = (userInfoJsonMap \ "password").as[String]
    val confirmPassword = (userInfoJsonMap \ "confirmPassword").as[String]
    val encryptedPassword = (new PasswordHashingUtil).encryptThePassword(password)
    val encryptedConfirmPassword = (new PasswordHashingUtil).encryptThePassword(confirmPassword)
    val canUserRegister = User.canUserRegisterWithThisEmail(emailId)

    canUserRegister match {
      case true =>
        (encryptedPassword == encryptedConfirmPassword) match {
          case true =>
            val userToCreate = new User(new ObjectId, UserType.apply(iam.toInt), emailId, "", "", "", Option(encryptedPassword), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
            val IdOfUserCreted = User.createUser(userToCreate)
            val createdUser = User.getUserProfile(IdOfUserCreted.get)
            UtilityActor.sendMailAfterUserSignsUp(IdOfUserCreted.get.toString, TokenEmailUtil.securityToken, emailId)
            Ok(write(new ResulttoSent("Success", "SignUp Successful"))).as("application/json")
          case false => Ok(write(new ResulttoSent("Failure", "Password Do Not Match"))).as("application/json")
        }
      case false =>
        Ok(write(new ResulttoSent("Failure", "This User Email Is Already Taken"))).as("application/json")
    }

  }
}

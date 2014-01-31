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


object BasicRegistration extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("dd/MM/yyyy")
  } + new ObjectIdSerializer

  /**
   * ***************************************************** Re architecture ******************************
   */

  /**
   * SignUp Page Rendering (V)
   */
  def signUpPage = Action { implicit request =>
    Ok(views.html.signup())
  }

  /**
   * Registering a new User to Beamstream 
   */

  def signUpUser = Action { implicit request =>
    val userInfoJsonMap = request.body.asJson.get
    val iam = (userInfoJsonMap \ "iam").as[String]
    val emailId = (userInfoJsonMap \ "mailId").as[String]
    val password = (userInfoJsonMap \ "password").as[String]
    val confirmPassword = (userInfoJsonMap \ "confirmPassword").as[String]
    val encryptedPassword = (new PasswordHashingUtil).encryptThePassword(password)
    val encryptedConfirmPassword = (new PasswordHashingUtil).encryptThePassword(confirmPassword)
    val canUserRegister = User.canUserRegisterWithThisEmail(emailId)

    (canUserRegister == true) match {
      case true =>
        (encryptedPassword == encryptedConfirmPassword) match {
          case true =>
            val userToCreate = new User(new ObjectId, UserType.apply(iam.toInt), emailId, "", "", "", Option(encryptedPassword), "", "", "", "", Nil, Nil,Nil, None, None)
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

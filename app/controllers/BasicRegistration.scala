package controllers

import models.Stream
import models.User
import play.api.mvc._
import play.api._
import utils.SendEmailUtility
import models.TokenDAO
import com.mongodb.casbah.commons.MongoDBObject
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import models.ResulttoSent
import models.UserType
import org.bson.types.ObjectId
import java.text.SimpleDateFormat
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import models.UserDAO
import com.mongodb.WriteConcern
import play.cache.Cache
import utils.PasswordHashingUtil
import utils.onlineUserCache
import actors.UtilityActor
import utils.tokenEmailUtil

object BasicRegistration extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("dd/MM/yyyy")
  } + new ObjectIdSerializer

  /**
   * Basic Registration Permissions for a User  via Token authentication
   */

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

  /**
   * ***************************************************** Re architecture ******************************
   */

  /**
   * SignUp Page Rendering (RA)
   */
  def signUpPage = Action { implicit request =>
    try {
      Ok(views.html.signup())
    } catch {
      case ex => InternalServerError(write("Oops there was errors")).as("application/json")
    }
  }

  /**
   * Registering a new User to Beamstream (RA)
   */

  def signUpUser = Action { implicit request =>

    try {
      val userInfoJsonMap = request.body.asJson.get
      val iam = (userInfoJsonMap \ "iam").as[String]
      val emailId = (userInfoJsonMap \ "mailId").as[String]
      val password = (userInfoJsonMap \ "password").as[String]
      val confirmPassword = (userInfoJsonMap \ "confirmPassword").as[String]
      val encryptedPassword = (new PasswordHashingUtil).encryptThePassword(password)
      val encryptedConfirmPassword = (new PasswordHashingUtil).encryptThePassword(confirmPassword)
      val canUserRegister = User.canUserRegister(emailId)

      (canUserRegister == true) match {
        case true =>
          (encryptedPassword == encryptedConfirmPassword) match {
            case true =>
              val userToCreate = new User(new ObjectId, UserType.apply(iam.toInt), emailId, "", "", "", "", Option(encryptedPassword), "", "", "", "", "", None, Nil, Nil, Nil, Nil, Nil,None)
              val IdOfUserCreted = User.createUser(userToCreate)
              val createdUser = User.getUserProfile(IdOfUserCreted)
              UtilityActor.sendMailAfterUserSignsUp(IdOfUserCreted.toString, tokenEmailUtil.securityToken, emailId)
              Ok(write(new ResulttoSent("Success", "SignUp Successful"))).as("application/json")
            case false => Ok(write(new ResulttoSent("Failure", "Password Do Not Match"))).as("application/json")
          }
        case false =>
          Ok(write(new ResulttoSent("Failure", "This User Email Is Already Taken"))).as("application/json")
      }
    } catch {
      case ex => InternalServerError(write("Oops there was errors during Signup")).as("application/json")
    }
  }
}
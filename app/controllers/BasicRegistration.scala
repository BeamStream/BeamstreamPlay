package controllers

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
import models.UserType
import org.bson.types.ObjectId
import java.text.SimpleDateFormat
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import models.UserDAO
import com.mongodb.WriteConcern
import play.cache.Cache
import utils.PasswordHashing
import utils.PasswordHashing
import utils.onlineUserCache

object BasicRegistration extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("dd/MM/yyyy")
  } + new ObjectIdSerializer

  /*
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

  /*
   * Registering a new User to Beamstream
   */

  def newUser = Action { implicit request =>
    try {
      val userJSONMap = request.body.asFormUrlEncoded.get
      val userJson = userJSONMap("data").toList(0)
      val parsedUserJson = net.liftweb.json.parse(userJson)
      val id = (parsedUserJson \ "id").extract[String]
      val iam = (parsedUserJson \ "iam").extract[String]
      val emailId = (parsedUserJson \ "email").extract[String]
      val schoolName = (parsedUserJson \ "schoolName").extract[String]
      val userName = (parsedUserJson \ "userName").extract[String]
      val password = (parsedUserJson \ "password").extract[String]
      val confirmPassword = (parsedUserJson \ "confirmPassword").extract[String]
      val firstName = (parsedUserJson \ "firstName").extract[String]
      val lastName = (parsedUserJson \ "lastName").extract[String]
      val location = (parsedUserJson \ "location").extract[String]
      val profile = (parsedUserJson \ "profile").extract[String]
      val alias = (parsedUserJson \ "alias").extract[String]
      val useCurrentLocation = (parsedUserJson \ "useCurrentLocation").extract[Boolean]

      //      val encryptedPassword =   utils.ConversionUtility.encryptPassword(password)
      //      val encryptedConfirmPassword = utils.ConversionUtility.encryptPassword(confirmPassword)

      val encryptedPassword = (new PasswordHashing).encryptThePassword(password)
      val encryptedConfirmPassword = (new PasswordHashing).encryptThePassword(confirmPassword)

      //val user = User.findUserbyId(new ObjectId(id))

      (id == "1") match {

        case true =>

          val canUserRegister = User.isAlreadyRegistered(emailId, userName)
          (canUserRegister == true) match {

            case true =>

              (encryptedPassword == encryptedConfirmPassword) match {
                case true =>
                  val userToCreate = new User(new ObjectId, UserType.apply(iam.toInt), emailId, firstName, lastName, userName, alias, encryptedPassword, schoolName, location, profile, List(), List(), List(), List(), List())
                  val IdOfUserCreted = User.createUser(userToCreate)
                  val RegistrationSession = request.session + ("userId" -> IdOfUserCreted.toString)
                  val createdUser = User.findUserbyId(IdOfUserCreted)
                  val noOfOnLineUsers = onlineUserCache.setOnline(IdOfUserCreted.toString)
                  println("Online Users" + noOfOnLineUsers)
                  Ok(write(List(createdUser))).withSession(RegistrationSession)
                case false => Ok(write(new ResulttoSent("Failure", "Password Do Not Match"))).as("application/json")
              }

            case false =>
              Ok(write(new ResulttoSent("Failure", "This User Email or Name Is Already Taken"))).as("application/json")
          }

        case false =>
          (encryptedPassword == encryptedConfirmPassword) match {
            case true =>
              val user = User.getUserProfile(new ObjectId(id))
              UserDAO.update(MongoDBObject("_id" -> new ObjectId(id)), user.copy(
                userType = UserType.apply(iam.toInt), email = emailId, firstName = firstName, lastName = lastName, userName = userName, alias = alias, password = encryptedPassword, orgName = schoolName,
                location = location, socialProfile = profile), false, false, new WriteConcern)
              Ok(write(List(User.getUserProfile(new ObjectId(id))))).as("application/json")
            case false => Ok(write(new ResulttoSent("Failure", "Password Do Not Match"))).as("application/json")
          }
      }
    } catch {
      case ex => Ok(write(new ResulttoSent("Failure", "There Was Some Problem During Registration"))).as("application/json")
    }
  }

  /*
   * Send the verification mail to the User
   */

  def emailSent = Action { implicit request =>
    try {
      val userInformationMap = request.body.asFormUrlEncoded.get
      val tempUserInformationJson = userInformationMap("data").toList(0)
      val userInformationJson = net.liftweb.json.parse(tempUserInformationJson)
      val iam = (userInformationJson \ "iam").extract[String]
      val emailId = (userInformationJson \ "email").extract[String]

      val canUserRegister = User.isAlreadyRegistered(emailId, "")

      (canUserRegister == true) match {
        case true =>
          SendEmail.sendEmail(emailId, iam)
          val jsonResponseToSent = new ResulttoSent("Success", "Email Sent Successfully")
          val finalJson = write(jsonResponseToSent)
          Ok(finalJson).as("application/json")

        case false =>
          Ok(write(new ResulttoSent("Failure", "Already registered")))

      }
    } catch {
      case ex => Ok(write(new ResulttoSent("Failure", "Email Sending Failed")))
    }
  }

}
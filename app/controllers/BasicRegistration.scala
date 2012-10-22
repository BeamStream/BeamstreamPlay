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
import models.onlineUserCache

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
    
    val encryptedPassword=utils.ConversionUtility.encryptPassword(password)
    val encryptedConfirmPassword=utils.ConversionUtility.encryptPassword(confirmPassword)

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
                println("Online Users Reg. Part:" + noOfOnLineUsers)
                Ok(write(List(createdUser))).withSession(RegistrationSession)
              case false => Ok(write(new ResulttoSent("Failure", "Password Do Not Match"))).as("application/json")
            }

          case false =>
            Ok(write(new ResulttoSent("Failure", "This User Email or Name Is Already Taken"))).as("application/json")
        }

      case false =>
        (encryptedPassword == encryptedConfirmPassword) match {
          case true =>
            val updatedUser = new User(new ObjectId(id), UserType.apply(iam.toInt), emailId, firstName, lastName, userName, alias, encryptedPassword, schoolName, location, profile, List(), List(), List(), List(), List())
            UserDAO.update(MongoDBObject("_id" -> new ObjectId(id)), updatedUser, false, false, new WriteConcern)
            Ok(write(List(updatedUser))).as("application/json")
          case false => Ok(write(new ResulttoSent("Failure", "Password Do Not Match"))).as("application/json")
        }
    }
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

    //TODO : User would be able to use the organization emailid  

    //    (User.validateEmail(emailId)) match {
    //      case false =>
    //      
    //        val failureJsonResponseToSent = new ResulttoSent("Failure", "Use emails assosiated with schools and organizations")
    //          println(write(failureJsonResponseToSent))
    //        Ok(write(failureJsonResponseToSent)).as("application/json")
    //
    //      case true =>
    //        SendEmail.sendEmail(emailId, iam)
    //        val jsonResponseToSent = new ResulttoSent("Success", "Email Sent Successfully")
    //        val finalJson = write(jsonResponseToSent)
    //        Ok(finalJson).as("application/json")
    //
    //    }
  }

}
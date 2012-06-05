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
import models.UserType
import org.bson.types.ObjectId

object BasicRegistration extends Controller {

  implicit val formats = DefaultFormats

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

  def basicRegistrationViaSocialSites(email: String, userName: String, firstName: String) = Action { implicit request =>
    // Ok(views.html.basic_reg(basicRegForm, email, "1", userName, firstName))
    Ok
  }

  /*
   * Registering a new User to Beamstream
   */

  def newUser = Action { implicit request =>

    val userJSONMap = request.body.asFormUrlEncoded.get
    val userJson = userJSONMap("data").toList(0)
    val parsedUserJson=net.liftweb.json.parse(userJson)
    
    val iam = (parsedUserJson \ "iam").extract[String]
    val emailId= (parsedUserJson \ "email").extract[String]
    val schoolName=(parsedUserJson \ "schoolName").extract[String]
    val userName=(parsedUserJson \ "userName").extract[String]
    val password=(parsedUserJson \ "password").extract[String]
    val firstName=(parsedUserJson \ "firstName").extract[String]
    val lastName=(parsedUserJson \ "lastName").extract[String]
    val location=(parsedUserJson \ "zipCode").extract[String]
    val useCurrentLocation=(parsedUserJson \ "location").extract[Boolean]
    
    val user=new User(new ObjectId,UserType.apply(iam.toInt),emailId,firstName,lastName,userName,"",password,schoolName,location,List(),List(),List())
    println(user)
   // println(iam+""+emailId+""+schoolName+""+userName+""+password+""+firstName+""+lastName+""+location+""+useCurrentLocation)

    //    basicRegForm.bindFromRequest.fold(
    //      errors => BadRequest(views.html.basic_reg(errors, "", "", "", "")),
    //      basicRegForm => {
    //
    //        val IdOfUserCreted = User.createNewUser(basicRegForm)
    //        val RegistrationSession = request.session + ("userId" -> IdOfUserCreted.toString)
    //        Redirect(routes.MessageController.messages).withSession(RegistrationSession)
    //      })

    Ok
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

    SendEmail.sendEmail(emailId, iam)

    val jsonResponseToSent = new ResulttoSent("Success", "Email Sent Successfully")
    val finalJson = write(jsonResponseToSent)

    Ok(finalJson).as("application/json")
  }

}
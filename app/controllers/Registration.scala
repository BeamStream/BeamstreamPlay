package controllers

import java.text.SimpleDateFormat
import java.util.Date
import org.bson.types.ObjectId
import models.Degree
import models.DegreeExpected
import models.Graduated
import models.RegistrationResults
import models.Token
import models.User
import models.UserSchool
import models.Year
import net.liftweb.json.Serialization.write
import play.api.libs.json.JsValue
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.ObjectIdSerializer
import utils.OnlineUserCache

object Registration extends Controller {
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /**
   * Registration after Mail (V)
   */
  def registration = Action { implicit request =>
    val token = request.queryString("token").toList(0)
    val userId = request.queryString("userId").toList(0)
    (Token.findToken(token).isEmpty) match {
      case false => Ok(views.html.registration(userId, None))
      case true => Ok("Token has been expired")
    }
  }

  /**
   * renders the login page
   * @return
   */
  def loginPage = Action {
    Ok(views.html.login())
  }

  /**
   * User Registration In Detail (V)
   */
  def registerUser = Action { implicit request =>

    val jsonReceived = request.body.asJson.get

    val userUpdate = updateUser(jsonReceived)
    (userUpdate == true) match {
      case true =>

        val userId = (jsonReceived \ "userId").as[String]
        val associatedSchoolId = (jsonReceived \ "associatedSchoolId").as[String]
        val schoolName = (jsonReceived \ "schoolName").as[String]
        val major = (jsonReceived \ "major").as[String]
        val gradeLevel = (jsonReceived \ "gradeLevel").as[String]
        val degreeProgram = (jsonReceived \ "degreeProgram").as[String]
        val otherDegree = (jsonReceived \ "otherDegree").asOpt[String]
        val graduate = (jsonReceived \ "graduate").as[String]
        val degreeExpected = (jsonReceived \ "degreeExpected").asOpt[String]

        val degreeExpectedSeason = (degreeExpected != None) match {
          case true => Option(DegreeExpected.withName(degreeExpected.get))
          case false => None
        }

        val graduationDate = (jsonReceived \ "graduationDate").asOpt[String]
        val graduationDateFound = (graduationDate != None) match {

          case true => Option(new Date(graduationDate.get))
          case false => None
        }

        val userSchool = new UserSchool(new ObjectId, new ObjectId(associatedSchoolId), schoolName, Year.withName(gradeLevel), Degree.withName(degreeProgram), major, Graduated.withName(graduate),
          graduationDateFound, degreeExpectedSeason, None)
        UserSchool.createSchool(userSchool)
        User.addInfo(List(userSchool), new ObjectId(userId))
        val userCreated = User.getUserProfile(new ObjectId(userId))
        OnlineUserCache.setOnline(userId)
        Ok(write(RegistrationResults(userCreated.get, userSchool))).as("application/json").withSession("userId" -> userId)

      case false => InternalServerError(write("There was errors while registering you")).as("application/json")
    }
  }

  /**
   * User Registration In Detail (V)
   */
  def editUserInfo(userId: String) = Action { implicit request =>

    val jsonReceived = request.body.asJson.get

    val userUpdate = updateUser(jsonReceived)
    (userUpdate == true) match {
      case true =>
        val associatedSchoolId = (jsonReceived \ "associatedSchoolId").as[String]
        val schoolName = (jsonReceived \ "schoolName").as[String]
        val major = (jsonReceived \ "major").as[String]
        val gradeLevel = (jsonReceived \ "gradeLevel").as[String]
        val degreeProgram = (jsonReceived \ "degreeProgram").as[String]
        val otherDegree = (jsonReceived \ "otherDegree").asOpt[String]
        val graduate = (jsonReceived \ "graduate").as[String]
        val degreeExpected = (jsonReceived \ "degreeExpected").asOpt[String]

        val degreeExpectedSeason = (degreeExpected != None) match {
          case true => Option(DegreeExpected.withName(degreeExpected.get))
          case false => None
        }

        val graduationDate = (jsonReceived \ "graduationDate").asOpt[String]
        val graduationDateFound = (graduationDate != None) match {

          case true => Option(new Date(graduationDate.get))
          case false => None
        }

        val userSchoolId = (jsonReceived \ "userSchoolId").as[String]

        val userSchool = new UserSchool(new ObjectId(userSchoolId), new ObjectId(associatedSchoolId), schoolName, Year.withName(gradeLevel), Degree.withName(degreeProgram), major, Graduated.withName(graduate),
          graduationDateFound, degreeExpectedSeason, None)
        UserSchool.updateUserSchool(userSchool)
        val userCreated = User.getUserProfile(new ObjectId(userId))
        OnlineUserCache.setOnline(userId)
        Ok(write(RegistrationResults(userCreated.get, userSchool))).as("application/json").withSession("userId" -> userId)
      case false => Ok(write("Something gone wrong")).as("application/json")
    }
  }

  /**
   * Update User (V)
   */
  private def updateUser(jsonReceived: JsValue): Boolean = {
    val userId = (jsonReceived \ "userId").as[String]
    val firstName = (jsonReceived \ "firstName").as[String]
    val email = (jsonReceived \ "mailId").asOpt[String]
    val lastName = (jsonReceived \ "lastName").as[String]
    val userName = (jsonReceived \ "username").as[String]
    val location = (jsonReceived \ "location").as[String]
    val about = (jsonReceived \ "aboutYourself").as[String]
    val cellNumber = (jsonReceived \ "cellNumber").as[String]
    val emailId = (email != None) match {
      case true => email.get
      case false => User.getUserProfile(new ObjectId(userId)).get.email
    }
    User.updateUser(new ObjectId(userId), firstName, lastName, userName, emailId, location, about, cellNumber)
    true
  }
}

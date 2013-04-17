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
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.ObjectIdSerializer
import utils.onlineUserCache

object Registration extends Controller {
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /**
   * Registration after Mail (RA)
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
   * User Registration In Detail (RA)
   */
  def registerUser = Action { implicit request =>
    try {
      val jsonReceived = request.body.asJson.get
      println(jsonReceived)
      var degreeExpectedSeason: Option[DegreeExpected.Value] = None
      var graduationDateFound: Option[Date] = None
      val userId = (jsonReceived \ "userId").as[String]
      val firstName = (jsonReceived \ "firstName").as[String]
      val lastName = (jsonReceived \ "lastName").as[String]
      val associatedSchoolId = (jsonReceived \ "associatedSchoolId").as[String]
      val schoolName = (jsonReceived \ "schoolName").as[String]
      val major = (jsonReceived \ "major").as[String]
      val gradeLevel = (jsonReceived \ "gradeLevel").as[String]
      val degreeProgram = (jsonReceived \ "degreeProgram").as[String]
      val otherDegree = (jsonReceived \ "otherDegree").asOpt[String]
      val graduate = (jsonReceived \ "graduate").as[String]
      val degreeExpected = (jsonReceived \ "degreeExpected").asOpt[String]
      if (degreeExpected != None) { degreeExpectedSeason = Option(DegreeExpected.withName(degreeExpected.get)) }
      val graduationDate = (jsonReceived \ "graduationDate").asOpt[String]
      if (graduationDate != None) { graduationDateFound = Option(new Date(graduationDate.get)) }
      val location = (jsonReceived \ "location").as[String]
      val about = (jsonReceived \ "aboutYourself").as[String]
      val cellNumber = (jsonReceived \ "cellNumber").as[String]
      User.updateUser(new ObjectId(userId), firstName, lastName, location, about, cellNumber)

      val userSchool = new UserSchool(new ObjectId, new ObjectId(associatedSchoolId), schoolName, Year.withName(gradeLevel), Degree.withName(degreeProgram), major, Graduated.withName(graduate),
        graduationDateFound, degreeExpectedSeason, otherDegree)
      UserSchool.createSchool(userSchool)
      User.addInfo(List(userSchool), new ObjectId(userId))
      val userCreated = User.getUserProfile(new ObjectId(userId))
      onlineUserCache.setOnline(userId)
      Ok(write(RegistrationResults(userCreated.get, userSchool))).as("application/json").withSession("userId" -> userId)
    } catch {
      case exception => InternalServerError(write("Oops there were errors during registration")).as("application/json")
    }
  }
}

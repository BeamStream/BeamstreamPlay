package controllers
import play.api.mvc._
import models.Token
import models.User
import org.bson.types.ObjectId
import models.School
import models.UserSchool
import models.Year
import models.Degree
import models.Graduated
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }

object Registration extends Controller {
  implicit val formats = DefaultFormats

  /**
   * Regsitration after Mail (RA)
   */
  def registration(token: String, userId: String) = Action {
    (Token.findToken(token).isEmpty) match {
      case false => Ok(views.html.registration(userId))
      case true => Ok("Token has been expired")
    }
  }

  /**
   * User Registration In Detail (RA)
   */
  def registerUser = Action { implicit request =>
    try {
      val jsonReceived = request.body.asJson.get
      val userId = (jsonReceived \ "userId").as[String]
      val firstName = (jsonReceived \ "firstName").as[String]
      val lastName = (jsonReceived \ "lastName").as[String]
      val schoolName = (jsonReceived \ "schoolName").as[String]
      val major = (jsonReceived \ "major").as[String]
      val gradeLevel = (jsonReceived \ "gradeLevel").as[String]
      val degreeProgram = (jsonReceived \ "degreeProgram").as[String]
      val graduate = (jsonReceived \ "graduate").as[String]
      val location = (jsonReceived \ "location").as[String]
      val about = (jsonReceived \ "aboutYourself").as[String]
      val cellNumber = (jsonReceived \ "cellNumber").as[String]
      User.updateUser(new ObjectId(userId), firstName, lastName, location, about, cellNumber)

      val schoolId = School.addNewSchool(new School(new ObjectId, schoolName, ""))
      val userSchool = new UserSchool(new ObjectId, schoolId, Year.withName(gradeLevel), Degree.withName(degreeProgram), major, Graduated.withName(graduate),
        None, None, "", List())
      UserSchool.createSchool(userSchool)
      User.addInfo(List(userSchool), new ObjectId(userId))
      Ok(write("Registration Successful")).as("application/json")
    } catch {
      case ex => Ok(write("Oops there were errors during registration")).as("application/json")
    }
  }
}

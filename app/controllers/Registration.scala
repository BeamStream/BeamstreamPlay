package controllers
import play.api.mvc._
import models.Token
import models.User
import org.bson.types.ObjectId
object Registration extends Controller {

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
//    try {
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

      Ok("Updated")
//    } catch {
//      case ex => Ok("Oops some error occurred")
//    }
  }
}

package controllers
import play.api.mvc._
import models.ResulttoSent
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import models.BetaUser
import org.bson.types.ObjectId
import models.UserType
import actors.UtilityActor
import play.api.data._
import play.api.data.Forms._

object JoinBeamStream extends Controller {

  implicit val formats = DefaultFormats

  /**
   *  Beta User Page Rendering (RA)
   */

  def betaUserRegistration = Action {
    try {
      Ok(views.html.betaUser())
    } catch {
      case ex => Ok("Oops..There was some errors")
    }

  }

  /**
   *  Beta Users Registration (RA)
   */
  def regsisterToBeamStreamBeta = Action { implicit request =>
    try {
      val userInfoJsonMap = request.body.asJson.get
      val emailId = (userInfoJsonMap \ "mailId").as[String]

      // Create Beta User
      val userToCreate = new BetaUser(new ObjectId, emailId)

      val betaUsersFound = BetaUser.findBetaUserbyEmail(emailId)
      (!betaUsersFound.isEmpty) match {
        case true => Ok(write(new ResulttoSent("Success", "You've been already added to the Beamstream's beta users list"))).as("application/json")
        case false =>
          BetaUser.addBetaUser(userToCreate)
          UtilityActor.sendMailWhenBetaUserRegisters(userToCreate.emailId)
          val successJson = write(new ResulttoSent("Success", "Allow To Register"))
          Ok(successJson).as("application/json")
      }
    } catch {
      case ex => Ok("Oops..There was some errors")
    }
  }

}  
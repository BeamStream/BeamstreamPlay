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
   *  Beta User Page Rendering
   */

  def betaUserRegistration = Action {
    Ok(views.html.betaUser("Beamstream Application."))
  }

  /**
   *  Beta Users Registration
   */
  def regsisterToBeamStreamBeta = Action { implicit request =>
    val userInfoJsonMap = request.body.asJson.get
    val emailId = (userInfoJsonMap \ "mailId").as[String]

    // Create Beta User
    val userToCreate = new BetaUser(new ObjectId, emailId)

    val betaUsersFound = BetaUser.findBetaUserbyEmail(emailId)
    (!betaUsersFound.isEmpty) match {
      case true => Ok(write(new ResulttoSent("Success", "You've been already added to the Beamstream's beta users list")))
      case false =>
        BetaUser.addBetaUser(userToCreate)
        UtilityActor.sendMailWhenBetaUserRegisters(userToCreate.emailId)
        //Ok(write(new ResulttoSent("Success", "Congratulations! You've been added to the Beamstream's beta users list")))
        val successJson = write(new ResulttoSent("Success", "Allow To Register"))
        Ok(successJson).as("application/json")
    }
  }
}  
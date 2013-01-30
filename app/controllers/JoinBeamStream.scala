package controllers
import play.api.mvc.Controller
import play.api.mvc.Action
import models.ResulttoSent
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import models.BetaUser
import org.bson.types.ObjectId
import models.UserType
import actors.UtilityActor

object JoinBeamStream extends Controller {

  implicit val formats = DefaultFormats

  /**
   *  Beta Users Registration
   */
  def regsisterToBeamStreamBeta = Action { implicit request =>
    val userInfoJsonMap = request.body.asFormUrlEncoded.get
    val emailId = userInfoJsonMap("email").toList(0)
    val userToCreate = new BetaUser(new ObjectId, emailId)

    val betaUsersFound = BetaUser.findBetaUserbyEmail(emailId)
    (!betaUsersFound.isEmpty) match {
      case true => Ok(write(new ResulttoSent("Success", "You've been already added to the Beamstream's beta users list")))
      case false =>
        BetaUser.addBetaUser(userToCreate)
        UtilityActor.sendMailWhenBetaUserRegisters(userToCreate.emailId)
        Ok(write(new ResulttoSent("Success", "Congratulations! You've been added to the Beamstream's beta users list")))
    }

  }

}
package controllers
import play.api.mvc.Controller
import play.api.mvc.Action
import models.ResulttoSent
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import models.BetaUser
import org.bson.types.ObjectId
import models.UserType

object JoinBeamStream extends Controller {

  implicit val formats = DefaultFormats

  def regsisterToBeamStreamBeta = Action { implicit request =>
    val userInfoJsonMap = request.body.asFormUrlEncoded.get

    val iam = userInfoJsonMap("iam").toList(0)
    val email = userInfoJsonMap("email").toList(0)
    val userToCreate = new BetaUser(new ObjectId, UserType.apply(iam.toInt), email)

    val betaUsersFound = BetaUser.findBetaUserbyEmail(email)
    (!betaUsersFound.isEmpty) match {
      case true => Ok(write(new ResulttoSent("Success", "You've been already added to the Beamstream's beta users list")))
      case false =>
        val userId = BetaUser.addBetaUser(userToCreate)
        Ok(write(new ResulttoSent("Success", "Congratulations! You've been added to the Beamstream's beta users list")))
    }

  }

}
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
    val userInfoJson = userInfoJsonMap("data").toList(0)
    val parsedUserJson = net.liftweb.json.parse(userInfoJson)
    val iam = (parsedUserJson \ "iam").extract[String]
    val emailId = (parsedUserJson \ "email").extract[String]
    val userToCreate = new BetaUser(new ObjectId, UserType.apply(iam.toInt), emailId)
    val userId=BetaUser.addBetaUser(userToCreate)
    Ok(write(new ResulttoSent("Success", "You are added to the Beta Users List")))
  }

}
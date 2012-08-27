package controllers
import play.api.mvc.Controller
import play.api.mvc.Action
import models.ResulttoSent
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }

object JoinBeamStream extends Controller {

  implicit val formats = DefaultFormats

  def regsisterToBeamStreamBeta = Action { implicit request =>
    val userInfoJsonMap = request.body.asFormUrlEncoded.get
    val userInfoJson = userInfoJsonMap("data").toList(0)
    Ok(write(new ResulttoSent("Success", "Beta User Regsitered")))
  }

}
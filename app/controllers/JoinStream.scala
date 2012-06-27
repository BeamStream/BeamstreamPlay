package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import models.Stream
import play.api.data._
import play.api.data.Forms._
import org.bson.types.ObjectId

object JoinStream extends Controller {

  def joinStream = Action { implicit request =>
    println(request.body)
    Ok
  }

}
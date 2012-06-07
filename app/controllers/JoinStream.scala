package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import models.Stream
import play.api.data._
import play.api.data.Forms._
import models.JoinStreamForm
import org.bson.types.ObjectId

object JoinStream extends Controller {
  val joinstreamForm = Form(
    mapping(
      "streamname" -> nonEmptyText)(JoinStreamForm.apply)(JoinStreamForm.unapply))

  def joinstreams = Action {
   // Ok(views.html.joinstream(Stream.all(), joinstreamForm))
  Ok
  }

  def joinStream = Action { implicit request =>
//    joinstreamForm.bindFromRequest.fold(
//      errors => BadRequest(views.html.joinstream(Stream.listall(), errors)),
//      joinstreamForm => {
//        Stream.join(joinstreamForm.streamname, new ObjectId(request.session.get("userId").get))
//        //Redirect(routes.MessageController.messages)
//
//        Ok
//      })
    Ok
  }

}
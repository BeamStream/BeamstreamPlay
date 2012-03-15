package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import models.Quote
import models.Stream
import play.api.data._
import play.api.data.Forms._
import models.JoinStreamForm

object JoinStream extends Controller {
  val joinstreamForm = Form(
    mapping(
      "streamid" -> number)(JoinStreamForm.apply)(JoinStreamForm.unapply))
      
      
    def joinstreams = Action {
      Ok(views.html.joinstream(Stream.all(), joinstreamForm))
  }
  
   def joinStream = Action { implicit request =>
    joinstreamForm.bindFromRequest.fold(
      errors => BadRequest(views.html.joinstream(Stream.listall(), errors)),
      joinstreamForm => {
        Stream.join(joinstreamForm.streamId, request.session.get("userId").get.toInt)
        Redirect(routes.JoinStream.joinstreams)

      })
  }

}
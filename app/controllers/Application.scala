package controllers

import play.api._
import play.api.mvc._
import models.Quote
import models.Stream
import play.api.data._
import play.api.data.Forms._
import models.StreamForm
import models.StreamForm

object Application extends Controller {

  val streamForm = Form(
    mapping(
      "name" -> nonEmptyText,
      "streamType" -> nonEmptyText)(StreamForm.apply)(StreamForm.unapply))

  def index = Action {
    Ok("This is BeamStream Application by Knoldus Software")
  }
  def streams = Action {
    Ok(views.html.index(Stream.all(), streamForm))
  }

  def newStream = Action { implicit request =>
    streamForm.bindFromRequest.fold(
      errors => BadRequest(views.html.index(Stream.all(), errors)),
      streamForm => {
        Stream.create(streamForm, request.session.get("userId").get.toInt)
        Redirect(routes.JoinStream.joinstreams)

      })
  }

}
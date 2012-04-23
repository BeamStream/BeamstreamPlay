package controllers

import play.api._
import play.api.mvc._
import models.Quote
import models.Stream
import play.api.data._
import play.api.data.Forms._
import models.StreamForm
import models.StreamForm
import models.UserDAO
import com.codahale.jerkson.Json
import org.bson.types.ObjectId


object Application extends Controller {

  val streamForm = Form(
    mapping(
      "name" -> nonEmptyText,
      "streamType" -> nonEmptyText,
      "classname" -> nonEmptyText,
      "posttoMystream" ->optional(checked("Post to My Profile")))(StreamForm.apply)(StreamForm.unapply))

  def index = Action {
    Ok("This is BeamStream Application by Knoldus Software")
  }
  
  def streams = Action { implicit request =>
     Stream.obtainUser(new ObjectId(request.session.get("userId").get))
     Ok(views.html.index(Stream.all(), streamForm))
  }

  def newStream = Action { implicit request =>
    streamForm.bindFromRequest.fold(
      errors => BadRequest(views.html.index(Stream.all(), errors)),
      streamForm => {
        Stream.create(streamForm, new ObjectId(request.session.get("userId").get))
        Redirect(routes.MessageController.messages)

      })
  }

  def listUsers() = Action {
    val user = UserDAO.findOneByID(101).toSeq

    val json = Json.generate(user)

    Ok(json).as("application/json")

  }
  
  
  

}
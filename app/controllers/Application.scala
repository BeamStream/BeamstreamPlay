package controllers

import play.api._
import play.api.mvc._
import models.Stream
import play.api.data._
import play.api.data.Forms._
import models.UserDAO
import com.codahale.jerkson.Json
import org.bson.types.ObjectId

object Application extends Controller {

  def index = Action {
    Ok("This is BeamStream Application by Knoldus Software")
  }

  def streams = Action { implicit request =>
    Stream.obtainUser(new ObjectId(request.session.get("userId").get))

    Ok
  }

  def newStream = Action { implicit request =>
    
    println(request.body)

    Ok
  }

}
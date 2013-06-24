package controllers

import play.api.mvc.Controller
import play.api.mvc.Action
import models.User
import org.bson.types.ObjectId
import utils.ChatRoom
import play.api.mvc.WebSocket
import play.api.libs.json.JsValue

object ChatController extends Controller {
  
  
  def chat(userName:String)= WebSocket.async[JsValue] { request  =>
    ChatRoom.join(userName)
  }
  
  
  def chatRoom = Action { implicit request =>
    val user = User.getUserProfile(new ObjectId(request.session.get("userId").get))
    Ok(views.html.chatRoom(user.head.firstName))

  }

}
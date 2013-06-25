package controllers

import play.api.mvc.Controller
import play.api.mvc.Action
import models.User
import org.bson.types.ObjectId
import utils.ChatRoom
import play.api.mvc.WebSocket
import play.api.libs.json.JsValue

object ChatController extends Controller {

  def chat(userName: String, userId: String, chatWith: String) = WebSocket.async[JsValue] { request =>
    ChatRoom.join(userName, userId, chatWith)
  }

  def chatRoom = Action { implicit request =>
    val roomToJoin = request.queryString.get("chatWith")
    val user = User.getUserProfile(new ObjectId(request.session.get("userId").get))
    if (roomToJoin == None)
      Ok(views.html.chatRoom(user.head.firstName, user.head.id.toString, ""))
    else Ok(views.html.chatRoom(user.head.firstName, user.head.id.toString,roomToJoin.head.head))
  }

}
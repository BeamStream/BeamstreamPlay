package controllers

import play.api.mvc.Controller
import play.api.mvc.Action
import play.api.mvc.WebSocket
import play.api.libs.json.JsValue
import utils.CommunicationRoom
import utils.WebsocketCommunication
import play.api.libs.concurrent.Akka
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Play.current
import akka.actor.Props
import utils.ChatAvailiblity
import org.bson.types.ObjectId
import play.api.libs.json.Json

object WebsocketCommunicationController extends Controller {

  /**
   * Handles the chat websocket.
   */
  def chat(withWhom: String) = WebSocket.async[JsValue] { implicit request =>
    (withWhom == "") match {
      case true =>
       println("Naya bna rha hu")
        lazy val default = {
          val roomActor = Akka.system.actorOf(Props[CommunicationRoom])
          roomActor
        }

        WebsocketCommunication.join(default, request.session.get("userId").get)

      case false =>
        var acWithChat = ChatAvailiblity.a(new ObjectId(withWhom))
        WebsocketCommunication.join(acWithChat, request.session.get("userId").get)
    }

  }

  def chatRoom(toWhom: String) = Action { implicit request =>
    Ok(views.html.chatRoom(toWhom))

  }

}
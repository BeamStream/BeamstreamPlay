package controllers

import play.api.mvc.Controller
import play.api.mvc.Action
import play.api.mvc.WebSocket
import play.api.libs.json.JsValue
import utils.CommunicationRoom
import utils.WebsocketCommunication

object WebsocketCommunicationController extends Controller {

  /**
   * Display the chat room
   */
  def chatRoom(name: String) = Action { implicit request =>
    Ok(views.html.chatRoom(name))
  }

  /**
   * Handles the chat websocket.
   */
  def chat(username: String) = WebSocket.async[JsValue] { request =>
    WebsocketCommunication.join(username)

  }

}
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
import org.bson.types.ObjectId
import play.api.libs.json.Json
import models.User

object WebsocketCommunicationController extends Controller {

  var a: scala.collection.immutable.Map[ObjectId, (play.api.libs.iteratee.Concurrent.Channel[play.api.libs.json.JsValue], play.api.libs.iteratee.Enumerator[play.api.libs.json.JsValue])] = Map()
  /**
   * Handles the chat websocket.
   */
  def chat = WebSocket.async[JsValue] { implicit request =>
    val user = User.getUserProfile(new ObjectId(request.session.get("userId").get))
    WebsocketCommunication.join(user.get.firstName, None, request.session.get("userId").get)

  }

  def instantiateChat(userId: String) = Action { implicit request =>
    val start = a.contains(new ObjectId(userId))
    Ok(start.toString)
  }

  /**
   * Handles the chat Websocket.
   */
  def startChat(me: String, toWhom: String) = WebSocket.async[JsValue] { implicit request =>
    val user = User.getUserProfile(new ObjectId(request.session.get("userId").get))
    val channelWithChat = a(new ObjectId(toWhom))
    WebsocketCommunication.join(user.get.firstName, Option(channelWithChat), request.session.get("userId").get)
  }

}
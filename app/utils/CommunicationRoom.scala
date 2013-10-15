package utils

import akka.actor.Actor
import play.api.libs.iteratee.Concurrent
import play.api.libs.json.JsArray
import play.api.libs.json.JsString
import play.api.libs.json.JsValue
import play.api.libs.json.Json
import play.api.libs.json.Json.toJsFieldJsValueWrapper

case class Join(user: String)
case class Leave(user: String)
case class Talk(user: String, message: String)

class CommunicationRoom extends Actor {

  var members = Set.empty[String]

  val (chatEnumerator, chatChannel) = Concurrent.broadcast[JsValue]
  val chatBot = "Blah"
  def broadCastMessage(user: String, message: String): Unit = {
    println(user, message)
    val msg = Json.obj("user" -> JsString(user), "message" -> JsString(message), "members" -> JsArray(members.toList.map(JsString)))
    chatChannel.push(msg)
  }
  def receive = {
    case Join(user) =>
      members += user
      broadCastMessage(chatBot, s"$user has joined the communication")
      sender ! chatEnumerator
    case Leave(user) =>
      broadCastMessage(chatBot, s"$user has left the communication")
      members -= user

    case Talk(user, message) =>
      broadCastMessage(user, message)
  }

}
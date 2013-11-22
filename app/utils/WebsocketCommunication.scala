package utils

import akka.actor._
import scala.concurrent.duration._
import scala.language.postfixOps
import play.api._
import play.api.libs.json._
import play.api.libs.iteratee._
import play.api.libs.concurrent._
import akka.util.Timeout
import akka.pattern.ask
import play.api.Play.current
import play.api.libs.concurrent.Execution.Implicits._

import org.bson.types.ObjectId

case class Join(username: String)
case class Quit(username: String)
case class Talk(username: String, text: String)
case class NotifyJoin(username: String)

case class Connected(enumerator: Enumerator[JsValue])
case class CannotConnect(msg: String)

class CommunicationRoom extends Actor {

  val (chatEnumerator, chatChannel) = Concurrent.broadcast[JsValue]
  var members = Set.empty[String]

  def receive = {

    case Join(username) => {
      if (members.contains(username)) {
        sender ! CannotConnect("This username is already used")
      } else {
        members = members + username
        sender ! Connected(chatEnumerator)
        self ! NotifyJoin(username)
      }

      members = members + username
      sender ! Connected(chatEnumerator)

    }

    case NotifyJoin(username) => {
      notifyAll("join", username, "has entered the room")
    }

    case Talk(username, text) => {
      notifyAll("talk", username, text)
    }

    case Quit(username) => {
      members = members - username
      notifyAll("quit", username, "has left the room")
    }

  }

  def notifyAll(kind: String, user: String, text: String) {
    val msg = JsObject(
      Seq(
        "kind" -> JsString(kind),
        "user" -> JsString(user),
        "message" -> JsString(text),
        "members" -> JsArray(
          members.toList.map(JsString))))
    chatChannel.push(msg)
  }

}

object WebsocketCommunication {

  implicit val timeout = Timeout(1 second)

  def join(actofRef: ActorRef, userId: String): scala.concurrent.Future[(Iteratee[JsValue, _], Enumerator[JsValue])] = {

    println("Before" + ChatAvailiblity.a.size)
    ChatAvailiblity.a += new ObjectId(userId) -> actofRef
    println("After" + ChatAvailiblity.a.size)

    (actofRef ? Join("")).map {

      case Connected(enumerator) =>
        println("<<<<<<<<IN")
        val iteratee = Iteratee.foreach[JsValue] { event =>
          actofRef ! Talk("", (event \ "text").as[String])
        }.map { _ =>
          actofRef ! Quit("")
        }
        (iteratee, enumerator)

      case CannotConnect(error) =>
        println(">>>>>>>>>Out")

        // Connection error

        // A finished Iteratee sending EOF
        val iteratee = Done[JsValue, Unit]((), Input.EOF)

        // Send an error and close the socket
        val enumerator = Enumerator[JsValue](JsObject(Seq("error" -> JsString(error)))).andThen(Enumerator.enumInput(Input.EOF))

        (iteratee, enumerator)

    }

  }

}
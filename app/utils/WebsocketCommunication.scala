package utils

import scala.concurrent.duration._
import scala.language.postfixOps
import akka.util.Timeout
import akka.pattern.ask
import play.api.Play.current
import play.api.libs.concurrent.Execution.Implicits._
import org.bson.types.ObjectId
import scala.concurrent.Future
import controllers.WebsocketCommunicationController
import akka.actor.Props
import akka.actor.Actor
import play.api.libs.json._
import play.api.libs.concurrent.Akka
import play.api.libs.iteratee._

case class Join(username: String)
case class Quit(username: String, channel: play.api.libs.iteratee.Concurrent.Channel[play.api.libs.json.JsValue])
case class Talk(username: String, channel: play.api.libs.iteratee.Concurrent.Channel[play.api.libs.json.JsValue], text: String)
case class NotifyJoin(username: String, channel: play.api.libs.iteratee.Concurrent.Channel[play.api.libs.json.JsValue])

case object Connected
case class CannotConnect(msg: String)

class CommunicationRoom extends Actor {

  def receive: PartialFunction[Any, Unit] = {

    case Join(username) => {

      sender ! Connected

    }

    case NotifyJoin(username, channel) => {
      notifyAll("join", username, "has entered the room", channel)
    }

    case Talk(username, channel, text) => {
      notifyAll("talk", username, text, channel)
    }

    case Quit(username, channel) => {
      notifyAll("quit", username, "has left the chat", channel)
    }

  }

  def notifyAll(kind: String, user: String, text: String, channel: play.api.libs.iteratee.Concurrent.Channel[play.api.libs.json.JsValue]) {
    val msg = JsObject(
      Seq(
        "kind" -> JsString(kind),
        "user" -> JsString(user),
        "message" -> JsString(text),
        "members" -> JsArray(
          Nil.map(JsString))))
    //{"kind":"talk","user":"Neelkanth","message":"Hiii","members":[]}
    channel.push(msg)
  }

}

object WebsocketCommunication {

  implicit val timeout = Timeout(1 second)

  def join(userName: String, channel: Option[(play.api.libs.iteratee.Concurrent.Channel[play.api.libs.json.JsValue], play.api.libs.iteratee.Enumerator[play.api.libs.json.JsValue])], userId: String): scala.concurrent.Future[(Iteratee[JsValue, _], Enumerator[JsValue])] = {

    lazy val default = {
      val roomActor = Akka.system.actorOf(Props[CommunicationRoom])
      roomActor
    }
    (channel == None) match {
      case true =>

        (default ? Join(userName)).map {

          case Connected =>
            val (chatEnumerator, chatChannel) = Concurrent.broadcast[JsValue]
            val iteratee = Iteratee.foreach[JsValue] { event =>
              default ! Talk(userName, chatChannel, (event \ "text").as[String])
            }.map { _ =>
              default ! Quit(userName, chatChannel)
            }

            WebsocketCommunicationController.usersChatSockets += new ObjectId(userId) -> (chatChannel, chatEnumerator)
            (iteratee, chatEnumerator)

          case CannotConnect(error) =>
            val iteratee = Done[JsValue, Unit]((), Input.EOF)
            val enumerator = Enumerator[JsValue](JsObject(Seq("error" -> JsString(error)))).andThen(Enumerator.enumInput(Input.EOF))
            (iteratee, enumerator)

        }

      case false =>
        val OtherIteratee = Iteratee.foreach[JsValue] { event =>
          default ! Talk(userName, channel.get._1, (event \ "text").as[String])
        }.map { _ =>
          default ! Quit(userName, channel.get._1)
        }
        Future(OtherIteratee, channel.get._2)
    }
  }

}

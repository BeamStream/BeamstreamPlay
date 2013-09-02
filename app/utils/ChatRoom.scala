package utils

import akka.actor._
import akka.util.duration._
import play.api._
import play.api.libs.json._
import play.api.libs.iteratee._
import play.api.libs.concurrent._
import akka.util.Timeout
import akka.pattern.ask
import play.api.Play.current
import actors.ChatActor

object ChatRoom {
  def join(username: String, userId: String, chatWith: String): Promise[(Iteratee[JsValue, _], Enumerator[JsValue])] = {
    (chatWith != "") match {

      case true =>
        val roomToJoin = Akka.system.actorFor(chatWith)
        implicit val timeout = Timeout(1 second)
        (roomToJoin ? Join(username, userId, chatWith)).asPromise.map {

          case Connected(enumerator) =>

            val iteratee = Iteratee.foreach[JsValue] { event =>
              roomToJoin ! Talk(username, (event \ "text").as[String])
            }.mapDone { _ =>
              roomToJoin ! Quit(username)
            }

            (iteratee, enumerator)

          case CannotConnect(error) =>
           println("Can not connect")
            // Connection error

            val iteratee = Done[JsValue, Unit]((), Input.EOF)

            // Send an error and close the socket
            val enumerator = Enumerator[JsValue](JsObject(Seq("error" -> JsString(error)))).andThen(Enumerator.enumInput(Input.EOF))

            (iteratee, enumerator)

        }

      case false =>

        implicit val timeout = Timeout(1 second)

        lazy val default = {
          val actorRef = Akka.system.actorOf(Props[ChatRoom], userId)
          actorRef
        }
        println(default)

        (default ? Join(username, userId, username)).asPromise.map {

          case Connected(enumerator) =>

            // Create an Iteratee to consume the feed
            val iteratee = Iteratee.foreach[JsValue] { event =>
              default ! Talk(username, (event \ "text").as[String])
            }.mapDone { _ =>
              default ! Quit(username)
            }

            (iteratee, enumerator)

          case CannotConnect(error) =>

            // Connection error

            // A finished Iteratee sending EOF
            val iteratee = Done[JsValue, Unit]((), Input.EOF)

            // Send an error and close the socket
            val enumerator = Enumerator[JsValue](JsObject(Seq("error" -> JsString(error)))).andThen(Enumerator.enumInput(Input.EOF))

            (iteratee, enumerator)

        }
    }
  }
  //
  //    implicit val timeout = Timeout(1 second)
  //
  //    lazy val default = {
  //      val actorRef = Akka.system.actorOf(Props[ChatRoom], userId)
  //      actorRef
  //    }
  //
  //    (default ? Join(username, userId, chatWith)).asPromise.map {
  //
  //      case Connected(enumerator) =>
  //
  //        // Create an Iteratee to consume the feed
  //        val iteratee = Iteratee.foreach[JsValue] { event =>
  //          default ! Talk(username, (event \ "text").as[String])
  //        }.mapDone { _ =>
  //          default ! Quit(username)
  //        }
  //        ChatActor.chat ! (chatWith, default)
  //
  //        (iteratee, enumerator)
  //
  //      case CannotConnect(error) =>
  //
  //        // Connection error
  //
  //        // A finished Iteratee sending EOF
  //        val iteratee = Done[JsValue, Unit]((), Input.EOF)
  //
  //        // Send an error and close the socket
  //        val enumerator = Enumerator[JsValue](JsObject(Seq("error" -> JsString(error)))).andThen(Enumerator.enumInput(Input.EOF))
  //
  //        (iteratee, enumerator)
  //
  //    }
  //
  //  }

}

class ChatRoom extends Actor {
  var members = Map.empty[String, PushEnumerator[JsValue]]

  def receive = {

    case Join(username, userId, chatWith) => {
      // Create an Enumerator to write to this socket
      val channel = Enumerator.imperative[JsValue](onStart = self ! NotifyJoin(username))
      if (members.contains(username)) {
        sender ! CannotConnect("This username is already used")
      } else {
        members = members + (username -> channel)

        sender ! Connected(channel)

      }
    }

    case NotifyJoin(username) => {
      notifyAll("join", username, "has entered the room")
    }

    case Talk(username, text) => {
      notifyAll("talk", username, text)
    }

    case Quit(username) => {
      members = members - username
      notifyAll("quit", username, "has leaved the room")
    }

  }

  def notifyAll(kind: String, user: String, text: String) {
    val msg = JsObject(
      Seq(
        "kind" -> JsString(kind),
        "user" -> JsString(user),
        "message" -> JsString(text),
        "members" -> JsArray(
          members.keySet.toList.map(JsString))))
    members.foreach {
      case (_, channel) => channel.push(msg)
    }
  }

}

case class Join(username: String, userId: String, room: String)
case class Quit(username: String)
case class Talk(username: String, text: String)
case class NotifyJoin(username: String)

case class Connected(enumerator: Enumerator[JsValue])
case class CannotConnect(msg: String)

package controllers

import akka.actor.Props
import akka.actor.actorRef2Scala
import akka.pattern.ask
import akka.util.Timeout
import play.api.Play.current
import play.api.libs.concurrent.Akka
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.iteratee.Enumerator
import play.api.libs.iteratee.Iteratee
import play.api.libs.json.JsValue
import play.api.mvc.Controller
import play.api.mvc.WebSocket
import utils.CommunicationRoom
import utils.Join
import utils.Leave
import utils.Talk
import scala.concurrent.duration._
import scala.language.postfixOps

object CommunicationController extends Controller {

  implicit val timeout = Timeout(1)
   val chatRoomActor = Akka.system.actorOf(Props[CommunicationRoom])

  def chat = WebSocket.async[JsValue] { request =>
    (chatRoomActor ? Join("John")) map {

      case out: Enumerator[JsValue] =>

        val in = Iteratee.foreach[JsValue] { event =>
          println(event)
          chatRoomActor ! Talk("John", (event \ "text").as[String])

        }.mapDone { _ => chatRoomActor ! Leave("John")

        }
        (in, out)
    }

  }

}
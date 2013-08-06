package actors

import akka.actor.Actor
import akka.actor.ActorSystem
import akka.actor.Props

class ChatActor extends Actor {
  def receive = {
    case 1 => println("")
  }
}

object ChatActor {

  def doChat {
    val system = ActorSystem("MySystem")
    val chat = system.actorOf(Props[ChatActor], name = "chat")
    chat ! 1
  }
}
package actors

import akka.actor.ActorRef

object ChatActorObject {

  var chatUsers: Map[String, String] = Map()

  def addEntry(userId: String, room: String) {
    chatUsers ++= Map(userId -> room)
  }
}

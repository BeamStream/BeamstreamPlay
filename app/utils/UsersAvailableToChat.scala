package utils

import akka.actor.ActorRef

object UsersAvailableToChat {

  var usersAvailableForChat: Map[String, ActorRef] = Map()

}
package utils

import akka.actor.ActorRef
import org.bson.types.ObjectId

object ChatAvailiblity {

  var a: Map[ObjectId, ActorRef] = Map()

}
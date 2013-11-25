package utils

import org.bson.types.ObjectId
import akka.actor.ActorRef

object ChatAvailiblity {

  var a: scala.collection.immutable.Map[ObjectId, ActorRef] = Map()
}


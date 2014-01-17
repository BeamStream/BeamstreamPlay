package utils

import org.bson.types.ObjectId
import akka.actor.ActorRef

object ChatAvailiblity {

  var a: scala.collection.immutable.Map[ObjectId, (play.api.libs.iteratee.Concurrent.Channel[play.api.libs.json.JsValue],play.api.libs.iteratee.Enumerator[play.api.libs.json.JsValue])] = Map()
}


package actors

import akka.actor.Actor
import akka.actor.ActorSystem
import akka.actor.Props
import utils.OnlineUserCache
import scala.concurrent.duration._
import scala.language.postfixOps

class CleanerActor extends Actor {
  def receive: PartialFunction[Any, Unit] = {
    case "clean" =>
      val utcMilliseconds = OnlineUserCache.returnUTCTime
      OnlineUserCache.returnOnlineUsers.isEmpty match {
        case false =>
          val onlineUsersMap = OnlineUserCache.returnOnlineUsers.head.onlineUsers
          onlineUsersMap.foreach {
            a =>
              if (utcMilliseconds - a._2 > 10000) {
                OnlineUserCache.setOffline(a._1)
              }
          }
        case true =>
      }
  }
}
object Cleaner {

  val system = ActorSystem("mySystem")
  val myActor = system.actorOf(Props[CleanerActor], "cleanerActor")

  import system.dispatcher
  def makeUsersOfflineIfNotAvailable: Unit = {
    val cancellable =
      system.scheduler.schedule(10000 milliseconds,
        10000 milliseconds,
        myActor,
        "clean")
  }

}

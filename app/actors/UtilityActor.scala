package actors
import akka.actor.Actor
import play.api.libs.concurrent.Akka
import play.api.Play.current
import akka.actor.Props

/**
 * Actor Creation
 */
class SendMailActor extends Actor {
  def receive = {
    case "Success" ⇒ //TODO Send Email ToUser
  }
}

/**
 * Send mail when different event occurs
 */
object UtilityActor {

  def sendMailWhenBetaUserRegisters = {
    val sendMailActor = Akka.system.actorOf(Props[SendMailActor], name = "sendMailActor")
    sendMailActor ! "Success"
  }

}
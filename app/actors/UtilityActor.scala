package actors
import akka.actor.Actor
import play.api.libs.concurrent.Akka
import play.api.Play.current
import akka.actor.Props
import javax.mail.internet.MimeMessage
import utils.SendEmail
import javax.mail.internet.InternetAddress
import javax.mail.Message
import play.api.Play
import play.api.i18n.Messages
import akka.actor.PoisonPill

/**
 * Actor Creation
 */
class SendMailActor extends Actor {

  def receive = {
    case messageReceived: String ⇒
      val authenticatedMessageAndSession = SendEmail.setEmailCredentials
      val recepientAddress = new InternetAddress(messageReceived)
      authenticatedMessageAndSession._1.setFrom(new InternetAddress("beamteam@beamstream.com", "beamteam@beamstream.com"))
      authenticatedMessageAndSession._1.addRecipient(Message.RecipientType.TO, recepientAddress);
      authenticatedMessageAndSession._1.setSubject("Beta User Registration On BeamStream");
      authenticatedMessageAndSession._1.setContent(Messages("BetaUserRegistrationMessage"), "text/html");
      val transport = authenticatedMessageAndSession._2.getTransport("smtp");
      transport.connect("smtp.gmail.com", "aswathy@toobler.com", Play.current.configuration.getString("email_password").get)
      transport.sendMessage(authenticatedMessageAndSession._1, authenticatedMessageAndSession._1.getAllRecipients)
      self ! PoisonPill
  }
}

/**
 * Send mail when different event occurs
 * @params : emailId is the emailId of the user who registers
 */
object UtilityActor {

  /**
   * Send Mail to beta user who registers on Beamstream
   */
  def sendMailWhenBetaUserRegisters(emailId: String) = {
    val sendMailActor = Akka.system.actorOf(Props[SendMailActor], name = "sendMailActor")
    sendMailActor ! emailId
    
  }

}
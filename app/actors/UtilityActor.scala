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
      authenticatedMessageAndSession._1.setSubject("Registration Process On BeamStream");
      authenticatedMessageAndSession._1.setContent(

        "Thank you for registering at <b>Beamstream</b>. We're stoked!. " +
          "Stay tuned with us as we evolve." +
          "<br>" + "<br>" + "<br>" +
          "Cheers," + "<br>" +
          "The Really Nice Beamstream Folks , US" + "<br>", "text/html");
      val transport = authenticatedMessageAndSession._2.getTransport("smtp");
      transport.connect("smtp.gmail.com", "aswathy@toobler.com", Play.current.configuration.getString("email_password").get)
      transport.sendMessage(authenticatedMessageAndSession._1, authenticatedMessageAndSession._1.getAllRecipients)
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
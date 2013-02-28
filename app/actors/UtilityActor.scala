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
import akka.dispatch.Future
import org.bson.types.ObjectId
import models.Token

/**
 * Actor Creation
 */
//class SendMailActor extends Actor {
//
//  def receive = {
//    case messageReceived: String ⇒
//      val authenticatedMessageAndSession = SendEmail.setEmailCredentials
//      val recepientAddress = new InternetAddress(messageReceived)
//      authenticatedMessageAndSession._1.setFrom(new InternetAddress("beamteam@beamstream.com", "beamteam@beamstream.com"))
//      authenticatedMessageAndSession._1.addRecipient(Message.RecipientType.TO, recepientAddress);
//      authenticatedMessageAndSession._1.setSubject("Beta User Registration On BeamStream");
//      authenticatedMessageAndSession._1.setContent(Messages("BetaUserRegistrationMessage"), "text/html");
//      val transport = authenticatedMessageAndSession._2.getTransport("smtp");
//      transport.connect("smtp.gmail.com", "aswathy@toobler.com", Play.current.configuration.getString("email_password").get)
//      transport.sendMessage(authenticatedMessageAndSession._1, authenticatedMessageAndSession._1.getAllRecipients)
//      self ! PoisonPill
//  }
//}

/**
 * Send mail when different event occurs
 * @params : emailId is the emailId of the user who registers
 */
object UtilityActor {

  /**
   * Send Email Clubbed through Future(RA)
   */
  def sendMailWhenBetaUserRegisters(emailId: String) = {
    implicit val system = Akka.system
    val future = Future { sendMail(emailId) }
    // val sendMailActor = Akka.system.actorOf(Props[SendMailActor], name = "sendMailActor")
    // sendMailActor ! emailId
  }

  /**
   * Send Mail to beta user who registers on Beamstream(RA)
   */
  def sendMail(emailId: String) = {
    val authenticatedMessageAndSession = SendEmail.setEmailCredentials
    val recepientAddress = new InternetAddress(emailId)
    authenticatedMessageAndSession._1.setFrom(new InternetAddress("beamteam@beamstream.com", "beamteam@beamstream.com"))
    authenticatedMessageAndSession._1.addRecipient(Message.RecipientType.TO, recepientAddress);
    authenticatedMessageAndSession._1.setSubject("Beta User Registration On BeamStream");
    authenticatedMessageAndSession._1.setContent(Messages("BetaUserRegistrationMessage"), "text/html");
    val transport = authenticatedMessageAndSession._2.getTransport("smtp");
    transport.connect("smtp.gmail.com", "aswathy@toobler.com", Play.current.configuration.getString("email_password").get)
    transport.sendMessage(authenticatedMessageAndSession._1, authenticatedMessageAndSession._1.getAllRecipients)
  }

  /**
   * Send Email After User signs up (RA)
   */
  def sendMailAfterUserSignsUp(userId: String, authToken: String, emailId: String) = {
    implicit val system = Akka.system
    val future = Future { sendMailAfterSignUp(userId, authToken, emailId) }
  }

  def sendMailAfterSignUp(userId: String, authToken: String, emailId: String) {
    val server = Play.current.configuration.getString("server").get
    val authenticatedMessageAndSession = SendEmail.setEmailCredentials
    val recepientAddress = new InternetAddress(emailId)
    authenticatedMessageAndSession._1.setFrom(new InternetAddress("beamteam@beamstream.com", "beamteam@beamstream.com"))
    authenticatedMessageAndSession._1.addRecipient(Message.RecipientType.TO, recepientAddress);
    authenticatedMessageAndSession._1.setSubject("Registration Process On BeamStream");
    authenticatedMessageAndSession._1.setContent(

      "Thank you for registering at <b>Beamstream</b>. We're stoked!." +
        " Please validate your identity and complete your registration by clicking on this link " +
        "<a href='" + server + "/registration?userId=" + userId + "&token=" + authToken + "'> Register On BeamStream</a>"
        + "<br>" + "<br>" + "<br>" +
        "Cheers," + "<br>" +
        "The Really Nice Beamstream Folks , US" + "<br>", "text/html");
    val transport = authenticatedMessageAndSession._2.getTransport("smtp");
    transport.connect("smtp.gmail.com", "aswathy@toobler.com", Play.current.configuration.getString("email_password").get)
    transport.sendMessage(authenticatedMessageAndSession._1, authenticatedMessageAndSession._1.getAllRecipients)
    val token = new Token((new ObjectId), authToken)
    Token.addToken(token)
  }

  /**
   * Mail After Stream Creation
   */
  def sendEmailAfterStreamCreation(email: String, streamName: String, newStream: Boolean) {
    implicit val system = Akka.system
    val future = Future { SendEmail.mailAfterStreamCreation(email, streamName, newStream) }
  }

}
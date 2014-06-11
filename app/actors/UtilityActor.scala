package actors

import akka.actor.Actor
import play.api.libs.concurrent.Akka
import play.api.Play.current
import akka.actor.Props
import javax.mail.internet.MimeMessage
import utils.SendEmailUtility
import javax.mail.internet.InternetAddress
import javax.mail.Message
import play.api.Play
import play.api.i18n.Messages
import akka.actor.PoisonPill
import scala.concurrent.Future
import org.bson.types.ObjectId
import models.Token
import utils.SendEmailUtility
import scala.concurrent.ExecutionContext.Implicits._
import com.novus.salat.global.ctx
import models.mongoContext._
import utils.EmailUtility

/**
 * Send mail when different event occurs
 * params : emailId is the emailId of the user who registers
 */
object UtilityActor extends EmailUtility {

  val CLASSWALL_EMAIL = "classwall@classwall.com"

  /**
   * Send Email Clubbed through Future(T)
   */
  def sendMailWhenBetaUserRegisters(emailId: String): Future[Unit] = {
    Future { sendMailToBetaUsers(emailId) }
  }

  /**
   * Send Mail to beta user who registers on Classwall(RA)
   */
  def sendMailToBetaUsers(emailId: String): Unit = {
    val authenticatedMessageAndSession = setEmailCredentials
    val recipientAddress = new InternetAddress(emailId)
    authenticatedMessageAndSession._1.setFrom(new InternetAddress(CLASSWALL_EMAIL, CLASSWALL_EMAIL))
    authenticatedMessageAndSession._1.addRecipient(Message.RecipientType.TO, recipientAddress);
    authenticatedMessageAndSession._1.setSubject("Beta User Registration On ClassWall");
    authenticatedMessageAndSession._1.setContent(Messages("BetaUserRegistrationMessage"), "text/html");
    val transport = authenticatedMessageAndSession._2.getTransport("smtp");
    transport.connect(Play.current.configuration.getString("smtp_server_out").get, 80, Play.current.configuration.getString("email_address").get, Play.current.configuration.getString("email_password").get)
    transport.sendMessage(authenticatedMessageAndSession._1, authenticatedMessageAndSession._1.getAllRecipients)
  }

  /**
   * Basic Send Mail Feature on Classwall(RA)
   */
  def sendMail(emailId: String, subject: String, content: String, fromAddress: String): Unit = {
    val authenticatedMessageAndSession = setEmailCredentials
    val recipientAddress = new InternetAddress(emailId)
    if (fromAddress != null)
      authenticatedMessageAndSession._1.setFrom(new InternetAddress(fromAddress, fromAddress))
    else
      authenticatedMessageAndSession._1.setFrom(new InternetAddress(CLASSWALL_EMAIL, CLASSWALL_EMAIL))
    authenticatedMessageAndSession._1.addRecipient(Message.RecipientType.TO, recipientAddress);
    authenticatedMessageAndSession._1.setSubject(subject);
    authenticatedMessageAndSession._1.setContent(content, "text/html");
    val transport = authenticatedMessageAndSession._2.getTransport("smtp");
    transport.connect(Play.current.configuration.getString("smtp_server_out").get, 80, Play.current.configuration.getString("email_address").get, Play.current.configuration.getString("email_password").get)
    transport.sendMessage(authenticatedMessageAndSession._1, authenticatedMessageAndSession._1.getAllRecipients)
  }

  /**
   * Send Email After User signs up Classwall(RA)
   */
  def sendMailAfterUserSignsUp(userId: String, authToken: String, emailId: String): Future[Unit] = {
    Future { sendMailAfterSignUp(userId, authToken, emailId) }
  }

  def sendMailAfterSignUp(userId: String, authToken: String, emailId: String) {
    val server = Play.current.configuration.getString("server").get
    val authenticatedMessageAndSession = setEmailCredentials
    val recepientAddress = new InternetAddress(emailId)
    authenticatedMessageAndSession._1.setFrom(new InternetAddress(CLASSWALL_EMAIL, CLASSWALL_EMAIL))
    authenticatedMessageAndSession._1.addRecipient(Message.RecipientType.TO, recepientAddress);
    authenticatedMessageAndSession._1.setSubject("Registration Process On ClassWall");
    authenticatedMessageAndSession._1.setContent(

      "Thanks for registering with us here at ClassWall. Confirm you are who you say you are, by clicking on this link to complete your registration. YOU ROCK. " +
        "<a href='" + server + "/registration?userId=" + userId + "&token=" + authToken + "'>Finish Registration On ClassWall</a>" +
        "<br>" + "<br>" + "<br>" +
        "Rock on," + "<br>" + "The good folks @ ClassWall" + "<br>", "text/html");
    val transport = authenticatedMessageAndSession._2.getTransport("smtp");
    transport.connect(Play.current.configuration.getString("smtp_server_out").get, 80, Play.current.configuration.getString("email_address").get, Play.current.configuration.getString("email_password").get)
    transport.sendMessage(authenticatedMessageAndSession._1, authenticatedMessageAndSession._1.getAllRecipients)
    val token = new Token((new ObjectId()),userId, authToken, false)
    Token.addToken(token)
  }

  /**
   * Mail After Stream Creation (V)
   */
  def sendEmailAfterStreamCreation(email: String, streamName: String, newStream: Boolean) {
    Future { SendEmailUtility.mailAfterStreamCreation(email, streamName, newStream) }
  }
  /**
   * Mail After Stream Creation (V)
   */
  def sendEmailAfterStreamCreationToNotifyOtherUsers(streamId: ObjectId, userIdWhoHasJoinedTheStream: ObjectId) {
    Future { models.Stream.sendMailToUsersOfStream(streamId, userIdWhoHasJoinedTheStream) }
  }

  /**
   * Mail For Forgot Password
   */
  def forgotPasswordMail(emailId: String, password: String) {
    Future { SendEmailUtility.sendPassword(emailId, password) }
  }
  
  def requestAccessMail(emailIdOfDocOwner: String, emailIdOfRequester: String, docURL: String) {
    Future{ SendEmailUtility.sendGoogleDocAccessMail(emailIdOfDocOwner, emailIdOfRequester, docURL) }
  }

}

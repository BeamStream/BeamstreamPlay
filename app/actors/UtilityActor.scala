package actors

import javax.mail.internet.InternetAddress
import javax.mail.Message
import play.api.Play
import play.api.i18n.Messages
import scala.concurrent.Future
import org.bson.types.ObjectId
import models.Token
import utils.SendEmailUtility
import scala.concurrent.ExecutionContext.Implicits._
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

      "You have chosen wisely... Thanks for signing up with ClassWall! <br> Click on the link below to finish registering & get your collaboration on." +
        "<a href='" + server + "/registration?userId=" + userId + "&token=" + authToken + "'><br><br>Click to Finish Registration</a>" +
        "<br>" + "<br>" +
        "Rock College," + "<br>" + "The Happiness Team @ ClassWall" + "<br>", "text/html");
    val transport = authenticatedMessageAndSession._2.getTransport("smtp");
    transport.connect(Play.current.configuration.getString("smtp_server_out").get, 80, Play.current.configuration.getString("email_address").get, Play.current.configuration.getString("email_password").get)
    transport.sendMessage(authenticatedMessageAndSession._1, authenticatedMessageAndSession._1.getAllRecipients)
    val token = new Token((new ObjectId()), userId, authToken, false)
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

  def requestAccessMail(emailIdOfDocOwner: String, emailIdOfRequester: String, docURL: String, docName: String) {
    Future { SendEmailUtility.sendGoogleDocAccessMail(emailIdOfDocOwner, emailIdOfRequester, docURL, docName) }
  }

}

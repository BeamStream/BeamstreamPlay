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
import akka.dispatch.Future
import org.bson.types.ObjectId
import models.Token
import utils.SendEmailUtility


/**
 * Send mail when different event occurs
 * @params : emailId is the emailId of the user who registers
 */
object UtilityActor {
  
  val BEAMTEAM_EMAIL = "beamteam@beamstream.com"

  /**
   * Send Email Clubbed through Future(RA)
   */
  def sendMailWhenBetaUserRegisters(emailId: String) = {
    implicit val system = Akka.system
    val future = Future { sendMailToBetaUsers(emailId) }
  }

  /**
   * Send Mail to beta user who registers on Beamstream(RA)
   */
  def sendMailToBetaUsers(emailId: String) = {
    val authenticatedMessageAndSession = SendEmailUtility.setEmailCredentials
    val recipientAddress = new InternetAddress(emailId)
    authenticatedMessageAndSession._1.setFrom(new InternetAddress(BEAMTEAM_EMAIL, BEAMTEAM_EMAIL))
    authenticatedMessageAndSession._1.addRecipient(Message.RecipientType.TO, recipientAddress);
    authenticatedMessageAndSession._1.setSubject("Beta User Registration On BeamStream");
    authenticatedMessageAndSession._1.setContent(Messages("BetaUserRegistrationMessage"), "text/html");
    val transport = authenticatedMessageAndSession._2.getTransport("smtp");
    transport.connect(Play.current.configuration.getString("smtp_server_out").get, 80, Play.current.configuration.getString("email_address").get, Play.current.configuration.getString("email_password").get)
    transport.sendMessage(authenticatedMessageAndSession._1, authenticatedMessageAndSession._1.getAllRecipients)
  }
  
  /**
   * Basic Send Mail Feature on Beamstream(RA)
   */
  def sendMail(emailId:String, subject:String, content:String, fromAddress:String) = {
    val authenticatedMessageAndSession = SendEmailUtility.setEmailCredentials
    val recipientAddress = new InternetAddress(emailId)
    if(fromAddress!=null)
    	authenticatedMessageAndSession._1.setFrom(new InternetAddress(fromAddress, fromAddress))
    else
    	authenticatedMessageAndSession._1.setFrom(new InternetAddress(BEAMTEAM_EMAIL, BEAMTEAM_EMAIL))
    authenticatedMessageAndSession._1.addRecipient(Message.RecipientType.TO, recipientAddress);
    authenticatedMessageAndSession._1.setSubject(subject);
    authenticatedMessageAndSession._1.setContent(content, "text/html");
    val transport = authenticatedMessageAndSession._2.getTransport("smtp");
    transport.connect(Play.current.configuration.getString("smtp_server_out").get, 80, Play.current.configuration.getString("email_address").get, Play.current.configuration.getString("email_password").get)
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
    val authenticatedMessageAndSession = SendEmailUtility.setEmailCredentials
    val recepientAddress = new InternetAddress(emailId)
    authenticatedMessageAndSession._1.setFrom(new InternetAddress(BEAMTEAM_EMAIL, BEAMTEAM_EMAIL))
    authenticatedMessageAndSession._1.addRecipient(Message.RecipientType.TO, recepientAddress);
    authenticatedMessageAndSession._1.setSubject("Registration Process On BeamStream");
    authenticatedMessageAndSession._1.setContent(

      "Thanks for registering with us here at BeamStream. Confirm you are who you say you are, by clicking on this link to complete your registration. YOU ROCK. "+
         "<a href='" + server + "/registration?userId=" + userId + "&token=" + authToken + "'>Finish Registration On BeamStream</a>"+
        "<br>" + "<br>" + "<br>" +
        "Rock on," + "<br>" +  "The good folks @ BeamStream" + "<br>" , "text/html");
    val transport = authenticatedMessageAndSession._2.getTransport("smtp");
    transport.connect(Play.current.configuration.getString("smtp_server_out").get, 80, Play.current.configuration.getString("email_address").get, Play.current.configuration.getString("email_password").get)
    transport.sendMessage(authenticatedMessageAndSession._1, authenticatedMessageAndSession._1.getAllRecipients)
    val token = new Token((new ObjectId), authToken)
    Token.addToken(token)
  }

  /**
   * Mail After Stream Creation
   */
  def sendEmailAfterStreamCreation(email: String, streamName: String, newStream: Boolean) {
    implicit val system = Akka.system
    val future = Future { SendEmailUtility.mailAfterStreamCreation(email, streamName, newStream) }
  }
  /**
   * Mail After Stream Creation
   */
  def sendEmailAfterStreamCreationToNotifyOtherUsers(streamId: ObjectId, userIdWhoHasJoinedTheStream: ObjectId) {
    implicit val system = Akka.system
    val future = Future { models.Stream.sendMailToUsersOfStream(streamId, userIdWhoHasJoinedTheStream) }
  }
  
   /**
   * Mail For Forgot Password
   */
  def forgotPasswordMail(emailId: String , password:String) {
    implicit val system = Akka.system
    val future = Future { SendEmailUtility.sendPassword(emailId,password) }
  }
  

}

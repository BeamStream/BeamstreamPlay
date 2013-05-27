package utils

import javax.mail.internet.MimeMessage
import java.util.Properties
import javax.mail.Session
import javax.mail.internet.InternetAddress
import javax.mail.Message
import javax.mail.Transport
import models.Token
import org.bson.types.ObjectId
import play.api.Play

object SendEmailUtility {
  
  val BEAMTEAM_EMAIL = "beamteam@beamstream.com"

  /**
   * Send Mail Credentials
   */

  def setEmailCredentials = {
    val props = new Properties
    props.setProperty("mail.transport.protocol", "smtp");
    props.setProperty("mail.smtp.starttls.enable", "true");
    props.setProperty("mail.smtp.port", "80");
    props.setProperty("mail.smtp.host", Play.current.configuration.getString("smtp_server_out").get);
    props.setProperty("mail.smtp.user", Play.current.configuration.getString("email_address").get);
    props.setProperty("mail.smtp.password", Play.current.configuration.getString("email_password").get)
    val session = Session.getDefaultInstance(props, null);
    val mimeMessage = new MimeMessage(session)
    (mimeMessage, session)
  }: (MimeMessage, Session)

 

  /**
   * Forgot Password Functionality
   * @param
   */
  def sendPassword(emailId: String, password: String) {

    val subject = "Password Recovery On BeamStream"

    val content =
      "Hi <b>Beamstream's</b> Rocker." + "<br>" + "<br>" +
        "Here is your account details " + "<br>" + "<br>" +
        "Email-Id: " + emailId + "<br>" +
        "Password: " + password + "<br>" +
        "<br>" + "<br>" + "<br>" +
        "Cheers," + "<br>" +
        "The Really Nice Beamstream Folks , US" + "<br>"

    sendMessage(emailId, subject, content)
  }

  /**
   * Send Mail After Stream Creation & Joining
   */
  def mailAfterStreamCreation(emailId: String, streamName: String, newStream: Boolean) {
    val authenticatedMessageAndSession = SendEmailUtility.setEmailCredentials
    val recepientAddress = new InternetAddress(emailId)
    authenticatedMessageAndSession._1.setFrom(new InternetAddress("beamteam@beamstream.com", "beamteam@beamstream.com"))
    authenticatedMessageAndSession._1.addRecipient(Message.RecipientType.TO, recepientAddress)
    if (newStream == true) {
      authenticatedMessageAndSession._1.setSubject("You've Created " + streamName + " Stream On Beamstream")
      authenticatedMessageAndSession._1.setContent(

        "Hi <b>Beamstream</b> Rocker." + "<br>" + "<br>" +
          "You've created the " + streamName + " Stream in Your Profile" + "<br>" + "<br>" +
          "Start sharing now & be a Beamstream Rocker" + "<br>" + "<br>" ++ "<br>" +
          "Cheers," + "<br>" +
          "The Really Nice Beamstream Folks , US" + "<br>", "text/html")
    } else {

      authenticatedMessageAndSession._1.setSubject("You've Joined " + streamName + " Stream On Beamstream")
      authenticatedMessageAndSession._1.setContent(

        "Hi <b>Beamstream</b> Rocker." + "<br>" + "<br>" +
          "You've Joined the " + streamName + " Stream " + "<br>" + "<br>" +
          "Start sharing now & be a Beamstream Rocker" + "<br>" + "<br>" ++ "<br>" +
          "Cheers," + "<br>" +
          "The Really Nice Beamstream Folks , US" + "<br>", "text/html")

    }

    val transport = authenticatedMessageAndSession._2.getTransport("smtp");
    transport.connect(Play.current.configuration.getString("smtp_server_out").get, 80, Play.current.configuration.getString("email_address").get, Play.current.configuration.getString("email_password").get)

    transport.sendMessage(authenticatedMessageAndSession._1, authenticatedMessageAndSession._1.getAllRecipients)
  }

  /**
   * Notify  The User When New User Joins A Stream
   */
  def notifyUsersOfStreamForANewUser(emailId: String, firstNameOfJoiner: String, lastNameOfJoiner: String, streamName: String) {

    val subject = firstNameOfJoiner + " " + lastNameOfJoiner + " has Joined the " + streamName + " Stream"
    val content =
      "Hi <b>Beamstream</b> Rocker." + "<br>" + "<br>" +
        firstNameOfJoiner + " " + lastNameOfJoiner + " has Joined the " + streamName + " Stream" +
        "<br>" + "<br>" +
        "Cheers," + "<br>" +
        "The Really Nice Beamstream Folks , US" + "<br>"

    sendMessage(emailId, subject, content)
  }

  /**
   * Invite User
   */

  
  def inviteUserToBeamstream(emailId: String) {

    val content =
      "Hello, " + "<br>" + "<br>" +
        "You've been invited to join Beamstream." + "<br>" +
        "Join and be ready to rock. " + "<a href ='" + Play.current.configuration.getString("server").get + "/beamstream/index.html#emailVerification'>REGISTER HERE</a>" +
        "<br>" + "<br>" +
        "Cheers," + "<br>" +
        "The Really Nice Beamstream Folks , US" + "<br>"

    sendMessage(emailId, "Invitation to join Beamstream", content)
  }

  /**
   * Invite User with Friend user who referred the user
   */

  
  def inviteUserToBeamstreamWithReferral(emailId: String, friendUserString: String, friendNameString: String) {
    val content =
      "Hello, " + "<br>" + "<br>" +
        friendNameString + " has invited to join Beamstream." + "<br>" +
        "Join and be ready to rock. " + "<a href ='" + Play.current.configuration.getString("server").get + "/beamstream/index.html#emailVerification?referrer=" + friendUserString + "'>REGISTER HERE</a>" +
        "<br>" + "<br>" +
        "Cheers," + "<br>" +
        "The Really Nice Beamstream Folks , US" + "<br>"

    sendMessage(emailId, "Invitation to join Beamstream", content)
  }

  /**
   * Sends an email given an emailId, Subject, and Message Content
   */
  def sendMessage(emailId: String, subject: String, content: String) {
    val authenticatedMessageAndSession = SendEmailUtility.setEmailCredentials
    val recepientAddress = new InternetAddress(emailId)
    authenticatedMessageAndSession._1.setFrom(new InternetAddress(BEAMTEAM_EMAIL, BEAMTEAM_EMAIL))
    authenticatedMessageAndSession._1.addRecipient(Message.RecipientType.TO, recepientAddress)
    authenticatedMessageAndSession._1.setSubject(subject)
    authenticatedMessageAndSession._1.setContent(content, "text/html")
    val transport = authenticatedMessageAndSession._2.getTransport("smtp");
    transport.connect(Play.current.configuration.getString("smtp_server_out").get, 80, Play.current.configuration.getString("email_address").get, Play.current.configuration.getString("email_password").get)
    transport.sendMessage(authenticatedMessageAndSession._1, authenticatedMessageAndSession._1.getAllRecipients)
  }

}

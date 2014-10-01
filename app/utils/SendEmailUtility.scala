package utils

import javax.mail.internet.MimeMessage
import java.util.Properties
import javax.mail.Session
import javax.mail.internet.InternetAddress
import javax.mail.Message
import play.api.Play

trait EmailUtility {

  /**
   * Send Mail Credentials (T)
   */

  def setEmailCredentials: (MimeMessage, Session) = {
    val props = new Properties
    props.setProperty("mail.transport.protocol", "smtp")
    props.setProperty("mail.smtp.starttls.enable", "true")
    props.setProperty("mail.smtp.port", "80")
    props.setProperty("mail.smtp.host", Play.current.configuration.getString("smtp_server_out").get)
    props.setProperty("mail.smtp.user", Play.current.configuration.getString("email_address").get)
    props.setProperty("mail.smtp.password", Play.current.configuration.getString("email_password").get)
    val session = Session.getDefaultInstance(props, null)
    val mimeMessage = new MimeMessage(session)
    (mimeMessage, session)
  }
}

object SendEmailUtility extends EmailUtility {

  //TODO : Move Email Contents From here
  val CLASSWALL_EMAIL = "classwall@classwall.com"

  /**
   * Forgot Password Functionality
   * @param
   */
  def sendPassword(emailId: String, password: String) {

    val subject = "Password Recovery On ClassWall"

    val content =
      "Hi <b>Classwall</b> Smarty." + "<br>" + "<br>" +
        "Here are your account details " + "<br>" + "<br>" +
        "Email-Id: " + emailId + "<br>" +
        "Password: " + password + "<br>" +
        "<br>" + "<br>" + "<br>" +
        "Rock College," + "<br>" +
        "The Happiness Team @ ClassWall" + "<br>"

    sendMessage(emailId, subject, content)
  }

  /**
   * Send Mail After Stream Creation & Joining
   */
  def mailAfterStreamCreation(emailId: String, streamName: String, newStream: Boolean) {
    val authenticatedMessageAndSession = setEmailCredentials
    val recepientAddress = new InternetAddress(emailId)
    authenticatedMessageAndSession._1.setFrom(new InternetAddress(CLASSWALL_EMAIL, CLASSWALL_EMAIL))
    authenticatedMessageAndSession._1.addRecipient(Message.RecipientType.TO, recepientAddress)
    newStream match {
      case true =>
        authenticatedMessageAndSession._1.setSubject("You've Created " + streamName + " Stream On Classwall")
        authenticatedMessageAndSession._1.setContent(

          "Hello ClassWall Smarty," + "<br>" + "<br>" +
            "You've created the " + streamName + " Stream" + "<br>" + "<br>" +
            "Start sharing & be a ClassWall superstar" + "<br>" + "<br>" + "<br>" +
            "Rock College," + "<br>" +
            "The Happiness Team @ ClassWall" + "<br>", "text/html")
      case false =>
        authenticatedMessageAndSession._1.setSubject("You've Joined " + streamName + " Stream On Classwall")
        authenticatedMessageAndSession._1.setContent(

          "Hello ClassWall Smarty," + "<br>" + "<br>" +
            "You've Joined the " + streamName + " Stream " + "<br>" + "<br>" +
            "Start sharing & be a Classwall superstar" + "<br>" + "<br>" + "<br>" +
            "Rock College," + "<br>" +
            "The Happiness Team @ ClassWall" + "<br>", "text/html")

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
      "Hi <b>Classwall</b> Smarty," + "<br>" + "<br>" +
        firstNameOfJoiner + " " + lastNameOfJoiner + " has Joined the " + streamName + " Stream" +
        "<br>" + "<br>" +
        "Rock College," + "<br>" +
        "The Happiness Team @ ClassWall" + "<br>"

    sendMessage(emailId, subject, content)
  }

  /**
   * Invite User
   */

  def inviteUserToBeamstream(emailId: String) {

    val content =
      "Hello, " + "<br>" + "<br>" +
        "You are invited to join ClassWall." + "<br>" +
        "Join & be ready to get your collaboration on. " + "<a href ='" + Play.current.configuration.getString("server").get + "/classwall/index.html#emailVerification'>REGISTER HERE</a>" +
        "<br>" + "<br>" +
        "Rock College," + "<br>" +
        "The Happiness Team @ ClassWall" + "<br>"
    sendMessage(emailId, "Invitation to join Classwall", content)
  }

  /**
   * Invite User with Friend user who referred the user
   */

  def inviteUserToBeamstreamWithReferral(emailId: String, friendUserString: String, friendNameString: String) {
    val content =
      "Hello, " + "<br>" + "<br>" +
        friendNameString + " has invited to join ClassWall." + "<br>" +
        "Join & be ready to get your collaboration on. " + "<a href ='" + Play.current.configuration.getString("server").get + "/signup?email=" + emailId + "&referrer=" + friendUserString + "'>REGISTER HERE</a>" +
        "<br>" + "<br>" +
        "Rock College," + "<br>" +
        "The Happiness Team @ ClassWall" + "<br>"

    sendMessage(emailId, "Invitation to join Classwall", content)
  }

  /**
   * Sends an email given an emailId, Subject, and Message Content
   */
  def sendMessage(emailId: String, subject: String, content: String) {
    val authenticatedMessageAndSession = setEmailCredentials
    val recepientAddress = new InternetAddress(emailId)
    authenticatedMessageAndSession._1.setFrom(new InternetAddress(CLASSWALL_EMAIL, CLASSWALL_EMAIL))
    authenticatedMessageAndSession._1.addRecipient(Message.RecipientType.TO, recepientAddress)
    authenticatedMessageAndSession._1.setSubject(subject)
    authenticatedMessageAndSession._1.setContent(content, "text/html")
    val transport = authenticatedMessageAndSession._2.getTransport("smtp");
    transport.connect(Play.current.configuration.getString("smtp_server_out").get, 80, Play.current.configuration.getString("email_address").get, Play.current.configuration.getString("email_password").get)
    transport.sendMessage(authenticatedMessageAndSession._1, authenticatedMessageAndSession._1.getAllRecipients)
  }

  def sendGoogleDocAccessMail(emailIdOfDocOwner: String, emailIdOfRequester: String, docURL: String, docName: String) {
    val subject = "Request to share Google Doc"
    val content = "Request to share" + "<br>" + "<br>" +
      "<a href ='" + docURL + "'>" + docName + "</a>" + "<br>" + "<br>" +
      "You are the owner of this item and " + emailIdOfRequester + " has asked that you share this item with:" + "<br>" + "<br>" +
      "+ " + emailIdOfRequester + "<br>" + "<br>" +
      "Add these people in " + "<a href ='" + docURL + "'>Sharing Settings</a>"
    val authenticatedMessageAndSession = setEmailCredentials
    val recepientAddress = new InternetAddress(emailIdOfDocOwner)
    authenticatedMessageAndSession._1.setFrom(new InternetAddress(CLASSWALL_EMAIL, CLASSWALL_EMAIL))
    authenticatedMessageAndSession._1.addRecipient(Message.RecipientType.TO, recepientAddress)
    authenticatedMessageAndSession._1.setSubject(subject)
    authenticatedMessageAndSession._1.setContent(content, "text/html")
    val transport = authenticatedMessageAndSession._2.getTransport("smtp");
    transport.connect(Play.current.configuration.getString("smtp_server_out").get, 80, Play.current.configuration.getString("email_address").get, Play.current.configuration.getString("email_password").get)
    transport.sendMessage(authenticatedMessageAndSession._1, authenticatedMessageAndSession._1.getAllRecipients)
  }

}


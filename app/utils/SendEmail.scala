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
object SendEmail {

  def sendEmail(emailId: String, iam: String) = {
    val server = Play.current.configuration.getString("server").get // Server adress from play configuration
    val authToken = tokenEmail.securityToken
    val props = new Properties
    props.setProperty("mail.transport.protocol", "smtp");
    props.setProperty("mail.smtp.starttls.enable", "true");
    props.setProperty("mail.host", "smtp.gmail.com");
    props.setProperty("mail.user", "neelkanth@knoldus.com");
    props.setProperty("mail.password", ConversionUtility.decodeMe(Play.current.configuration.getString("email_password").get));
    val session = Session.getDefaultInstance(props, null);
    val msg = new MimeMessage(session)
    val recepientAddress = new InternetAddress(emailId)
    msg.setFrom(new InternetAddress("beamteam@beamstream.com", "beamteam@beamstream.com"))
    msg.addRecipient(Message.RecipientType.TO, recepientAddress);
    msg.setSubject("Registration Process On BeamStream");
    msg.setContent(

      "Thank you for registering at <b>Beamstream</b>. We're stoked!." +
        " Please validate your identity and complete your registration by clicking on this link " +
        "<a href='" + server + "/beamstream/index.html#basicRegistration" + "/token/" + authToken + "/iam/" + iam + "/emailId/" + emailId + "'> Register On BeamStream</a>"
        + "<br>" + "<br>" + "<br>" +
        "Cheers," + "<br>" +
        "The Really Nice Beamstream Folks , US" + "<br>", "text/html");
    val transport = session.getTransport("smtp");
    transport.connect("smtp.gmail.com", "neelkanth@knoldus.com", ConversionUtility.decodeMe(Play.current.configuration.getString("email_password").get))
    transport.sendMessage(msg, msg.getAllRecipients)
    val token = new Token((new ObjectId), authToken)
    Token.addToken(token)
  }

  def sendPassword(emailId: String, password: String) {
    val props = new Properties
    props.setProperty("mail.transport.protocol", "smtp");
    props.setProperty("mail.smtp.starttls.enable", "true");
    props.setProperty("mail.host", "smtp.gmail.com");
    props.setProperty("mail.user", "neelkanth@knoldus.com");
    props.setProperty("mail.password", Play.current.configuration.getString("email_password").get);

    val session = Session.getDefaultInstance(props, null);
    val msg = new MimeMessage(session)
    val recepientAddress = new InternetAddress(emailId)

    msg.setFrom(new InternetAddress("beamteam@beamstream.com", "beamteam@beamstream.com"))
    msg.addRecipient(Message.RecipientType.TO, recepientAddress);
    msg.setSubject("Password Recovery On BeamStream");

    msg.setContent(

      "Hi <b>Beamstream's</b> Rocker." + "<br>" + "<br>" +
        "Here is your account details " + "<br>" + "<br>" +
        "Email-Id: " + emailId + "<br>" +
        "Password: " + password + "<br>" +
        "<br>" + "<br>" + "<br>" +
        "Cheers," + "<br>" +
        "The Really Nice Beamstream Folks , US" + "<br>", "text/html");

    val transport = session.getTransport("smtp");
    transport.connect("smtp.gmail.com", "neelkanth@knoldus.com", ConversionUtility.decodeMe(Play.current.configuration.getString("email_password").get))
    transport.sendMessage(msg, msg.getAllRecipients)
  }

}


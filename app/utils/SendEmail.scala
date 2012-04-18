package utils

import javax.mail.internet.MimeMessage
import java.util.Properties
import javax.mail.Session
import javax.mail.internet.InternetAddress
import javax.mail.Message
import javax.mail.Transport
import models.Token
import org.bson.types.ObjectId
object SendEmail {

  def sendEmail(emailId:String,iam:String) = {
     
    val authToken=tokenEmail.securityToken
    
    val props = new Properties
    props.setProperty("mail.transport.protocol", "smtp");
    props.setProperty("mail.smtp.starttls.enable", "true");
    props.setProperty("mail.host", "smtp.gmail.com");
    props.setProperty("mail.user", "neelkanth@knoldus.com");
    props.setProperty("mail.password", "seatknoldus");

    val session = Session.getDefaultInstance(props, null);
    val msg = new MimeMessage(session)
    val recepientAddress = new InternetAddress(emailId)

    msg.setFrom(new InternetAddress("neelkanth@knoldus.com"))
    msg.addRecipient(Message.RecipientType.TO, recepientAddress);
    msg.setSubject("Registration Process On BeamStream");
    
    msg.setContent("Hi User, Follow the Link to Complete Registration "+
        "<a href="+ "'http://high-wind-5226.herokuapp.com/basicRegistration/"+iam+"/mail/"+emailId+"/token/"+authToken +"'> Register On BeamStream</a>"
        
        
        +"<br>"+"Regards | Beamstream Team , US"
        , "text/html");
    val transport = session.getTransport("smtp");
    transport.connect("smtp.gmail.com", "neelkanth@knoldus.com", "seatknoldus")
    transport.sendMessage(msg, msg.getAllRecipients)
    
    val token=new Token((new ObjectId),authToken)
    Token.addToken(token)

  }

}

//http://high-wind-5226.herokuapp.com/basicRegistration?iam=jhskjhds&mailId=neelkanth@knoldus.com
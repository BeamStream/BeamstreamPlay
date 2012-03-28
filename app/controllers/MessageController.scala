package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import models.Quote
import models.Stream
import play.api.data._
import play.api.data.Forms._
import models.MessageForm
import models.Message
import org.bson.types.ObjectId
import play.api.cache.Cache

object MessageController extends Controller {
  


  val messageForm = Form(
    mapping(
      "message" -> nonEmptyText,
      "access" -> optional(checked("Private")))(MessageForm.apply)(MessageForm.unapply))

  var nameofMessagePoster: String = ""
  

  

  def newMessage = Action { implicit request =>
    messageForm.bindFromRequest.fold(
      errors => BadRequest(views.html.message(Message.getAllMessagesForAStream(new ObjectId), errors, "", List())),
      messageForm => {
       print("NeelkanthSachdevaId"+ request.session.get("userId").get +"Stream" + request.session.get("streamId").get )
        val userName= Message.create(messageForm, request.session.get("userId").get.toInt,new ObjectId(request.session.get("streamId").get))
       nameofMessagePoster=userName
       Redirect(routes.MessageController.streamMessages(request.session.get("streamId").get))

      })
  }
  
  def messages = Action {
    val streams = Stream.getAllStream
    Ok(views.html.message(Message.getAllMessagesForAStream(new ObjectId), messageForm, nameofMessagePoster, streams))

  }

  def streamMessages(id: String) = Action { implicit request =>
   
    val streams = Stream.getAllStream
    val messagesListFound=Message.getAllMessagesForAStream(new ObjectId(id))
    Ok(views.html.message(messagesListFound, messageForm, nameofMessagePoster, streams)).withSession(session + ("streamId" -> id))
  
  }

}


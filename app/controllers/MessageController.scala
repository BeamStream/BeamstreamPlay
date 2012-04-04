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
import models.User
import org.bson.types.ObjectId
import play.api.cache.Cache

object MessageController extends Controller {

  val messageForm = Form(
    mapping(
      "message" -> nonEmptyText,
      "access" -> optional(checked("Private")))(MessageForm.apply)(MessageForm.unapply))

  def newMessage = Action { implicit request =>

    messageForm.bindFromRequest.fold(
      errors => BadRequest(views.html.message(Message.getAllMessagesForAStream(new ObjectId), errors, List())),
      messageForm => {
        val messagePoster = User.getUserProfile(request.session.get("userId").get.toInt)
        Message.create(messageForm, request.session.get("userId").get.toInt, new ObjectId(request.session.get("streamId").get),
          messagePoster.firstName, messagePoster.lastName)

        Redirect(routes.MessageController.streamMessages(request.session.get("streamId").get))

      })
  }

  def messages = Action { implicit request =>
    val streams = Stream.getAllStreamforAUser((request.session.get("userId").get).toInt)
    Ok(views.html.message(Message.getAllMessagesForAStream(new ObjectId), messageForm, streams))

  }

  def streamMessages(id: String) = Action { implicit request =>

    //val streams = Stream.getAllStream
    val streams = Stream.getAllStreamforAUser((request.session.get("userId").get).toInt)

    val messagesListFound = Message.getAllMessagesForAStream(new ObjectId(id))
    Ok(views.html.message(messagesListFound, messageForm, streams)).withSession(session + ("streamId" -> id))

  }

}


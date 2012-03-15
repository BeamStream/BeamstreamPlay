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

object MessageController extends Controller {
  
  val messageForm = Form(
    mapping(
      "message" -> nonEmptyText,
      "messageType" -> nonEmptyText
      )(MessageForm.apply)(MessageForm.unapply))


def messages = Action {
    Ok(views.html.message(Message.all(), messageForm))
  }


def newMessage = Action { implicit request =>
    messageForm.bindFromRequest.fold(
      errors => BadRequest(views.html.message(Message.all(), errors)),
      messageForm => {
        Message.create(messageForm)
        Redirect(routes.MessageController.messages)

      })
  }
}
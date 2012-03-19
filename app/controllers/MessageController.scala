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
      //"messageType" -> nonEmptyText,
      "access" -> optional(checked("Private")
)  
      )(MessageForm.apply)(MessageForm.unapply))


var userName:String =""


def newMessage = Action { implicit request =>
    messageForm.bindFromRequest.fold(
      errors => BadRequest(views.html.message(Message.all(), errors,"")),
      messageForm => {
        println(messageForm.access)
        Message.create(messageForm, request.session.get("userId").get.toInt)
        userName=  Message.findUser(request.session.get("userId").get.toInt).firstName
        
        Redirect(routes.MessageController.messages)

      })
  }
  
  def messages = Action {
    Ok(views.html.message(Message.all(), messageForm,userName))
  }
}


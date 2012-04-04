package controllers
import play.api._
import play.api.mvc._
import models.Quote
import models.Stream
import play.api.data._
import play.api.data.Forms._
import models.BasicRegForm
import models.User

object BasicRegistration extends Controller {

  val basicRegForm = Form(
    mapping(
      "userName" -> nonEmptyText,
      "password" -> nonEmptyText,
      "orgName" -> nonEmptyText,
      "firstName" -> nonEmptyText,
      "lastName" -> nonEmptyText,
      "email" -> nonEmptyText,
      "location" -> nonEmptyText,
      "iam" -> nonEmptyText,
      "useCurrentLocation" -> optional(checked("")))(BasicRegForm.apply)(BasicRegForm.unapply))

  def basicRegistration = Action { implicit request =>
    val iAmValue = request.flash.get("iam").get.toString
    Ok(views.html.basic_reg(basicRegForm, (request.flash.get("email")).get.toString)).flashing(request.flash + ("iam" -> iAmValue))

  }

  def newUser = Action { implicit request =>

    basicRegForm.bindFromRequest.fold(
      errors => BadRequest(views.html.basic_reg(errors, "")),
      basicRegForm => {
        println(basicRegForm.iam)
        val IdOfUserCreted = User.createNewUser(basicRegForm)
        val RegistrationSession = request.session + ("userId" -> IdOfUserCreted.toString)
        Redirect(routes.MessageController.messages).withSession(RegistrationSession)
      })

  }
}
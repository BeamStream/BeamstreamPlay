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
      "lastName" -> nonEmptyText,
      "location" -> nonEmptyText,
      "useCurrentLocation" -> optional(checked("")))(BasicRegForm.apply)(BasicRegForm.unapply))

  def basicRegistration = Action { implicit request =>
    print("dfdffdfdf"+request.flash.get("email"))
     print("dfdffdfdf"+request.flash.get("iam"))
    Ok(views.html.basic_reg(basicRegForm))
  }

  def newUser = Action { implicit request =>
    basicRegForm.bindFromRequest.fold(

      errors => BadRequest(views.html.basic_reg(errors)),
      basicRegForm => {
        User.createNewUser(basicRegForm)
        Redirect(routes.BasicRegistration.basicRegistration)
      })

  }
}
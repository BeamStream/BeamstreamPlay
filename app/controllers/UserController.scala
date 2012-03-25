package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import models.Quote
import models.Stream
import play.api.data._
import play.api.data.Forms._
import models.UserForm
import models.User
import models.User

object UserController extends Controller {

  var s: String = ""

  /*
    * Map the fields value from html page 
    */
  val userForm = Form(
    mapping(
      "email" -> nonEmptyText,
      "password" -> nonEmptyText)(UserForm.apply)(UserForm.unapply))

  /*
 * Find and Authenticate the user to proceed
 */
  def findUser = Action { implicit request =>
    userForm.bindFromRequest.fold(
      errors => BadRequest(views.html.user(User.allUsers(), errors, "")),
      userForm => {

        val authenticatedUser = User.findUser(userForm)
        authenticatedUser match {
          case None =>
            s = "No User Found"
            Redirect(routes.UserController.users)

          case _ =>

            print(authenticatedUser.get.orgName)
            s = "Login Successful"
            /*Creates a Session*/
            val aa = request.session + ("userId" -> authenticatedUser.get.id.toString)
            Redirect(routes.MessageController.messages).withSession(aa)
        }

      })
  }

  def users = Action {
    Ok(views.html.user(User.allUsers(), userForm, User.message(s)))
  }

}
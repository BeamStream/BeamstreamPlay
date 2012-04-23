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
import play.mvc.Http.Request
import play.libs._
import com.ning.http.client.Realm;


object UserController extends Controller {

  var s: String = ""

  /*
    * Map the fields value from html page 
    */
  val userForm = Form(
    mapping(
      "iam" -> nonEmptyText,
      "email" -> nonEmptyText,
      "password" -> nonEmptyText,
      "signup" -> nonEmptyText)(UserForm.apply)(UserForm.unapply))

  /*
 * Find and Authenticate the user to proceed
 */
  def findUser = Action { implicit request =>
    
//     val tokenList=request.body.asFormUrlEncoded.get.values.toList(0)
//     val token=tokenList(0)
//      val apiKey="47bfca4dbb79c5feb439d350931d0f2345d23ad9"
//       val URL="https://rpxnow.com/api/v2/auth_info"
//    
//      val promise = WS.url( URL ).setQueryParameter("format","json").setQueryParameter("token",token).setQueryParameter("apiKey",apiKey).get
//      val res = promise.get
//      val body = res.getBody
//      print(body)

 
    userForm.bindFromRequest.fold(
      errors => BadRequest(views.html.user(User.allUsers(), errors, "")),
      userForm => {

        (userForm.signup == "0") match {

          case true =>
            
            val initialFlashObject = request.flash + ("email" -> userForm.email)
            val FinalFlashObject = initialFlashObject + ("iam" -> userForm.iam)
             Redirect(routes.BasicRegistration.emailSent).flashing(FinalFlashObject)
             

          case false =>
            val authenticatedUser = User.findUser(userForm)
            authenticatedUser match {
              case None =>
                s = "No User Found"
                Redirect(routes.UserController.users)

              case _ =>
                s = "Login Successful"
                /*Creates a Session*/
                val aa = request.session + ("userId" -> authenticatedUser.get.id.toString)
                Redirect(routes.MessageController.messages).withSession(aa)

            }
        }

      })
  }

  def users = Action { implicit request =>

    Ok(views.html.user(User.allUsers(), userForm, User.message(s)))
  }

}
package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import models.Stream
import play.api.data._
import play.api.data.Forms._
import models.UserForm
import models.User
import models.User
import play.mvc.Http.Request
import play.libs._
import com.ning.http.client.Realm
import utils._
import org.bson.types.ObjectId
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import models.ResulttoSent
import play.libs.Json._
import play.libs.Json
import models.UserMedia

object UserController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
  } + new ObjectIdSerializer

  /*
 * Find and Authenticate the user to proceed
 */
  def findUser = Action { implicit request =>

    val userJsonMap = request.body.asFormUrlEncoded.get
    val user = userJsonMap("data").toList(0)

    val userJson = net.liftweb.json.parse(user)
    val userEmail = (userJson \ "email").extract[String]
    val userPassword = (userJson \ "password").extract[String]

    val authenticatedUser = User.findUser(userEmail, userPassword)

    authenticatedUser match {
      case Some(user) =>
        val jsonStatus = new ResulttoSent("success", "Login Successfull")
        val statusToSend = write(jsonStatus)
        val userSession = request.session + ("userId" -> user.id.toString)
        val authenticatedUserJson = write(user)
        Ok(statusToSend).as("application/json").withSession(userSession)

      case None =>
        val jsonStatus = new ResulttoSent("failure", "Login Unsuccessfull")
        val statusToSend = write(jsonStatus)
        Ok(statusToSend).as("application/json")
    }
  }

  /*
   * Register User via social sites
   */

  def registerUserViaSocialSite = Action { implicit request =>
    val tokenList = request.body.asFormUrlEncoded.get.values.toList(0)
    val token = tokenList(0)

    val apiKey = "cc38e5cc0a71f8795733254be3cc28d8b0678a69"
    val URL = "https://rpxnow.com/api/v2/auth_info"

    val promise = WS.url(URL).setQueryParameter("format", "json").setQueryParameter("token", token).setQueryParameter("apiKey", apiKey).get
    val res = promise.get
    val body = res.getBody
    Ok(body).as("application/json")

  }

  // 

  /*
   * Reducing active user on sign Out
   */

  def signOut = Action { implicit request =>
    //    User.InactiveUsers(request.session.get("userId").get)
    Ok.withNewSession
  }

  /*
   *  Returns the user Json on Stream page load
   */

  def returnUserJson = Action { implicit request =>
    val loggedInUserId = new ObjectId(request.session.get("userId").get)
    val loggedInUser = User.findUserbyId(loggedInUserId)
    val loggedInUserJson = write(loggedInUser)
    Ok(loggedInUserJson).as("application/json")
  }

  /*
   * obtaining the profile video and Audio
   */

  def getProfilePicForAUser = Action { implicit request =>
    val mediaObtained = UserMedia.getProfilePicForAUser(new ObjectId(request.session.get("userId").get))
    val MediaJson = write(mediaObtained)
    Ok(MediaJson).as("application/json")
  }

}
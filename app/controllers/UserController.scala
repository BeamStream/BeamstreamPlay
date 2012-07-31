package controllers
import org.bson.types.ObjectId
import models.ProfileImageProviderCache
import models.ResulttoSent
import models.User
import models.User
import models.UserMedia
import net.liftweb.json.Serialization.read
import net.liftweb.json.Serialization.write
import net.liftweb.json.DefaultFormats
import net.liftweb.json.parse
import play.api.data.Forms._
import play.api.mvc._
import play.api.mvc.Controller
import play.api.mvc.Response
import play.api.mvc.Response
import play.api._
import play.libs._
import play.mvc.Http.Request
import utils._
import play.api.libs.json.JsValue
import play.api.libs.json.Json

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
    val userEmailorName = (userJson \ "email").extract[String]
    val userPassword = (userJson \ "password").extract[String]
    val rememberMe = (userJson \ "rememberMe").extract[Boolean]
    val authenticatedUser = User.findUser(userEmailorName, userPassword)

    authenticatedUser match {
      case Some(user) =>
        val jsonStatus = new ResulttoSent("success", "Login Successfull")
        val statusToSend = write(jsonStatus)
        val userSession = request.session + ("userId" -> user.id.toString)
        val authenticatedUserJson = write(user)
        //        if(rememberMe==true) Ok(statusToSend).as("application/json").withCookies(Cookie("userName",user.email),Cookie("password",user.password)).withSession(userSession)
        //        else  Ok(statusToSend).as("application/json").withSession(userSession)
        Ok(statusToSend).withSession(userSession)

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

  /*
   * Get all Contact data via social sites
   */

  def getContactsViaSocialSite = Action { implicit request =>
    val tokenList = request.body.asFormUrlEncoded.get.values.toList(0)
    val token = tokenList(0)
    val apiKey = "cc38e5cc0a71f8795733254be3cc28d8b0678a69"
    val URL = "https://rpxnow.com/api/v2/auth_info"

    val promise = WS.url(URL).setQueryParameter("format", "json").setQueryParameter("token", token).setQueryParameter("apiKey", apiKey).get
    val res = promise.get
    val body = res.getBody

    val json = Json.parse(body)
    val identifier = (json \ "profile" \ "identifier").as[String]

    val URL2 = "https://rpxnow.com/api/v2/get_contacts"
    val promise2 = WS.url(URL2).setQueryParameter("format", "json").setQueryParameter("identifier", identifier).setQueryParameter("apiKey", apiKey).get
    val res2 = promise2.get
    val body2 = res2.getBody

    Ok(body2).as("application/json")

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

    val userIdJsonMap = request.body.asFormUrlEncoded.get
    val userIdReceived = userIdJsonMap("userId").toList(0)

    if (ProfileImageProviderCache.profileImageMap.isDefinedAt(userIdReceived)) {
      val profilePicUrl = ProfileImageProviderCache.getImage(userIdReceived)
      Ok(write(profilePicUrl)).as("application/json")
    } else {
      println("Profile map is empty")
      val mediaObtained = UserMedia.getProfilePicForAUser(new ObjectId(userIdReceived))
      val MediaJson = write(mediaObtained.mediaUrl)
      Ok(MediaJson).as("application/json")
    }

  }

  
  /*
   * Password Recovery
   * @purpose : Send a mail to user with passord
   */
  def forgotPassword = Action { implicit request =>

    val emailIdJsonMap = request.body.asFormUrlEncoded.get
    val emailId = emailIdJsonMap("emailId").toList(0)
    val passwordSent = User.forgotPassword(emailId)
    (passwordSent.equals(true)) match {
      case true => Ok(write(new ResulttoSent("Success", "Password Sent")))
      case false => Ok(write(new ResulttoSent("Failure", "No User Found")))
    }

  }

}
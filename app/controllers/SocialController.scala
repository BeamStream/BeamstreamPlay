package controllers
import org.bson.types.ObjectId
import org.neo4j.graphdb.Node
import models.ProfileImageProviderCache
import models.ResulttoSent
import models.UserMedia
import net.liftweb.json.Serialization.read
import net.liftweb.json.Serialization.write
import net.liftweb.json.DefaultFormats
import net.liftweb.json.parse
import play.api.data.Forms._
import play.api.libs.json.JsValue
import play.api.libs.json.Json
import play.api.mvc._
import play.api.mvc.Controller
import play.api.mvc.Response
import play.api._
import play.libs._
import play.mvc.Http.Request
import utils._
import play.api.cache.Cache
import play.api.Play.current
import utils.onlineUserCache
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import models.UserType
import models.User

object SocialController extends Controller {
  implicit val formats = DefaultFormats

  /**
   * Authenticate users for Janrain Engage. (RA)
   * http://developers.janrain.com/documentation/api/auth_info/
   *
   * Returns a JSON of user profile information
   */
  def signUpViaSocialSites = Action { implicit request =>
    try {
      val tokenList = request.body.asFormUrlEncoded.get.values.toList(0)
      val token = tokenList(0)
      val apiKey = Play.current.configuration.getString("janrain_apiKey").get
      val URL = "https://rpxnow.com/api/v2/auth_info"
      val promise = WS.url(URL).setQueryParameter("format", "json").setQueryParameter("token", token).setQueryParameter("apiKey", apiKey).get
      val res = promise.get
      val body = res.getBody
      val json = Json.parse(body)
      println(json)
      val providerName = (json \ "profile" \ "providerName").asOpt[String].get
      val preferredUsername = (json \ "profile" \ "preferredUsername").asOpt[String].get
      val emailFromJson = (json \ "profile" \ "email").asOpt[String]
      val emailId = (emailFromJson != None) match {
        case true => emailFromJson.get
        case false => ""
      }

      val canUserRegister = User.canUserRegister(preferredUsername)
      if (canUserRegister == true) {
        val userToCreate = new User(new ObjectId, UserType.Professional, emailId, "", "", preferredUsername, "", None, "", "", "", "", "", Option(providerName), Nil, Nil, Nil, Nil, Nil, Option(json))
        val IdOfUserCreted = User.createUser(userToCreate)
        Ok(views.html.registration(IdOfUserCreted.toString, Option(json.toString)))
      } else {
        Ok(write("User Has been already registered")).as("application/json")
      }
    } catch {
      case ex => InternalServerError(write("Something wrong happend")).as("application/json")
    }
  }

  /**
   * LogIn via social sites
   */
  def logInViaSocialSites = Action { implicit request =>

    try {
      val tokenList = request.body.asFormUrlEncoded.get.values.toList(0)
      val token = tokenList(0)
      val apiKey = Play.current.configuration.getString("janrain_apiKey").get
      val URL = "https://rpxnow.com/api/v2/auth_info"
      val promise = WS.url(URL).setQueryParameter("format", "json").setQueryParameter("token", token).setQueryParameter("apiKey", apiKey).get
      val res = promise.get
      val body = res.getBody
      val json = Json.parse(body)
      val providerName = (json \ "profile" \ "providerName").asOpt[String].get
      val preferredUsername = (json \ "profile" \ "preferredUsername").asOpt[String].get
      val authenticatedUser = User.findUserComingViaSocailSite(preferredUsername, providerName)
      if (authenticatedUser == None) {
        Ok("No User Found").as("application/json")
      } else {
        val userSession = request.session + ("userId" -> authenticatedUser.get.id.toString)
        val noOfOnLineUsers = onlineUserCache.setOnline(authenticatedUser.get.id.toString)
        println(noOfOnLineUsers)
        Ok(views.html.discussions.discussions("DISCUSSIONS_DATA")).withSession(userSession)
      }
    } catch {
      case ex => InternalServerError(write("Login Failed")).as("application/json")
    }
  }
  /**
   * Get a list of all the social contacts related to the user.
   * http://developers.janrain.com/documentation/api/get_contacts/
   *
   * Returns a JSON of user contact information
   */
  def getContacts = Action { implicit request =>
    session.get("social_identifier").map { identifier =>
      val apiKey = Play.current.configuration.getString("janrain_apiKey").get
      val URL = "https://rpxnow.com/api/v2/get_contacts"
      val promise = WS.url(URL).setQueryParameter("format", "json").setQueryParameter("identifier", identifier).setQueryParameter("apiKey", apiKey).get
      val res = promise.get
      val body = res.getBody
      Ok(body).as("application/json")
    }.getOrElse {
      Unauthorized("You are not an authorized user!");
    }
  }
}

package controllers

import org.bson.types.ObjectId
import models.ResulttoSent
import models.User
import models.UserType
import net.liftweb.json.DefaultFormats
import net.liftweb.json.Serialization.write
import play.api.Play
import play.api.libs.json.Json
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.OnlineUserCache
import utils.SendEmailUtility
import play.api.mvc.AnyContent

object SocialController extends Controller {
  implicit val formats = DefaultFormats

  /**
   * Authenticate users for Janrain Engage. (RA)
   * http://developers.janrain.com/documentation/api/auth_info/
   *
   * Returns a JSON of user profile information
   */
  def signUpViaSocialSites: Action[AnyContent] = Action { implicit request =>
        /*val tokenList = request.body.asFormUrlEncoded.get.values.toList(0)
        val token = tokenList(0)
        val apiKey = Play.current.configuration.getString("janrain_apiKey").get
        val URL = "https://rpxnow.com/api/v2/auth_info"
        val promise = WS.url(URL).setQueryParameter("format", "json").setQueryParameter("token", token).setQueryParameter("apiKey", apiKey).get
        val body = promise.get.getBody
        val json = Json.parse(body)

        val identifier = (json \ "profile" \ "identifier").asOpt[String]

        val userToCreate = new User(new ObjectId, UserType.Student, "", "", "", "", None, "", "", "", "", Nil, Nil, Nil, Nil, Nil, Option(json), None)
        val IdOfUserCreted = User.createUser(userToCreate)
        val userSession = request.session + ("userId" -> IdOfUserCreted.get.toString) + ("social_identifier" -> identifier.get)
        val noOfOnLineUsers = OnlineUserCache.setOnline(IdOfUserCreted.get.toString)
        Ok(views.html.registration(IdOfUserCreted.get.toString, Option(json.toString))).withSession(userSession)*/
    Ok
  }

  /**
   * LogIn via social sites
   */
  def logInViaSocialSites: Action[AnyContent] = Action { implicit request =>

   /*     val tokenList = request.body.asFormUrlEncoded.get.values.toList(0)
        val token = tokenList(0)
        val apiKey = Play.current.configuration.getString("janrain_apiKey").get
        val URL = "https://rpxnow.com/api/v2/auth_info"
        val promise = WS.url(URL).setQueryParameter("format", "json").setQueryParameter("token", token).setQueryParameter("apiKey", apiKey).get
        val body = promise.get.getBody
        val json = Json.parse(body)
        val providerName = (json \ "profile" \ "providerName").asOpt[String].get
        val identifier = (json \ "profile" \ "identifier").asOpt[String]
        val preferredUsername = (json \ "profile" \ "preferredUsername").asOpt[String].get
        val authenticatedUser = User.findUserComingViaSocailSite(preferredUsername, providerName)
        (authenticatedUser == None) match {
          case true => Ok("No User Found").as("application/json")
          case false =>

            val userSession = request.session + ("userId" -> authenticatedUser.get.id.toString) + ("social_identifier" -> identifier.get)
            val noOfOnLineUsers = OnlineUserCache.setOnline(authenticatedUser.get.id.toString)
            (authenticatedUser.get.classes.size == 0) match {
              case true => Redirect("/class").withSession(userSession)
              case false => Redirect("/stream").withSession(userSession)
            }

        }*/
    Ok

  }

  /**
   * Get a list of all the social contacts related to the user.
   * http://developers.janrain.com/documentation/api/get_contacts/
   *
   * Returns a JSON of user contact information
   */
  def getContacts: Action[AnyContent] = Action { implicit request =>
/*    session.get("social_identifier").map { identifier =>
      val apiKey = Play.current.configuration.getString("janrain_apiKey").get
      val URL = "https://rpxnow.com/api/v2/get_contacts"
      val promise = WS.url(URL).setQueryParameter("format", "json").setQueryParameter("identifier", identifier).setQueryParameter("apiKey", apiKey).get
      val res = promise.get
      val body = res.getBody
      Ok(body).as("application/json")
    }.get*/
    Ok
  }

  /**
   * Add a list of friends for the signed in user.
   * Receives a list of users via JSON string
   *
   * Returns a JSON of user contact information
   */
  def inviteFriends: Action[AnyContent] = Action { implicit request =>
    val userId = request.session.get("userId")
    (userId == None) match {
      case true => Ok(write("Session Has Been Expired")).as("application/json")
      case false =>
        val userJsonMap = request.body.asJson.get
        val emailstring = (userJsonMap \ "data").as[String]
        val emailList = emailstring.split(",")
          .toList.head.split(",").toList
        for (eachEmail <- emailList) {
          val user = User.getUserProfile(new ObjectId(userId.get))
          SendEmailUtility.inviteUserToBeamstreamWithReferral(eachEmail, userId.get, user.get.firstName + " " + user.get.lastName)
        }
    }
    Ok(write(ResulttoSent("Success", "Invitations has been sent"))).as("application/json")
  }
}

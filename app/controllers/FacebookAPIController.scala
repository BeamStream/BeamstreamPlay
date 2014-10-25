package controllers

import org.scribe.builder.ServiceBuilder
import org.scribe.builder.api.FacebookApi
import org.scribe.model.OAuthRequest
import org.scribe.model.Response
import org.scribe.model.Token
import org.scribe.model.Verb
import org.scribe.model.Verifier
import org.scribe.oauth.OAuthService
import play.api.Logger
import play.api.Play
import play.api.libs.json.Json
import play.api.mvc.Action
import play.api.mvc.Controller
import java.text.SimpleDateFormat
import java.util.Date
import com.restfb.DefaultFacebookClient
import com.restfb.types.FacebookType
import com.restfb.Parameter

object FacebookAPIController extends Controller {

  val SUCCESS = 200
  val apiKey: String = Play.current.configuration.getString("facebook_app_id").get
  val apiSecret: String = Play.current.configuration.getString("facebook_app_secret").get
  val server = Play.current.configuration.getString("server").get
  var emptyToken: Token = _
  val currentUserId = "userId"
  val protectedResourceUrl: String = "https://graph.facebook.com/me";

  /**
   * Get OAuthService Request
   */
  def getOAuthService: OAuthService = {
    val service: OAuthService = new ServiceBuilder()
      .provider(classOf[FacebookApi])
      .apiKey(apiKey)
      .apiSecret(apiSecret)
      .scope("email")
      .scope("publish_actions")
      .callback(server + "/facebook/callback")
      .build()
    service
  }

  def facebookLogin: Action[play.api.mvc.AnyContent] = Action {
    try {
      val authorizationUrl: String = getOAuthService.getAuthorizationUrl(emptyToken);
      Ok(authorizationUrl)

    } catch {
      case ex: Exception => {
        Logger.error("Error During Login Through Facebook - " + ex)
        Ok(views.html.redirectMain("failure", server, "Cannot post message on Facebook"))
      }
    }
  }

  def facebookCallback: Action[play.api.mvc.AnyContent] = Action { implicit request =>
    try {
      getVerifier(request.queryString) match {
        case None => Ok(views.html.redirectMain("failure", server, "Cannot post message on Facebook"))
        case Some(code) =>
          val verifier: Verifier = new Verifier(code)
          val accessToken: Token = getOAuthService.getAccessToken(emptyToken, verifier)
          val oAuthRequest: OAuthRequest = new OAuthRequest(Verb.GET, protectedResourceUrl)

          // Posting message on Facebook
          val message = "Get on the exclusive beta list for ClassWall, a Social Learning Network for Colleges " +
            "& Universities. It's built for college students & professors. It's lookin' pretty sweet so far!"
          val facebookClient = new DefaultFacebookClient(accessToken.getToken())
          val publishMessageResponse =
            facebookClient
              .publish("me/feed", classOf[FacebookType], Parameter.`with`("message", message + " http://bstre.am/k7lXGw"))

          getOAuthService.signRequest(accessToken, oAuthRequest)
          val response: Response = oAuthRequest.send
          response.getCode match {
            case SUCCESS =>
              val json = Json.parse(response.getBody)
              val userEmailId = (json \ "email").asOpt[String]
              Ok(views.html.redirectMain("success", server, "Thanks for sharing it with others on Facebook"))
            case _ =>
              Ok(views.html.redirectMain("failure", server, "Cannot post message on Facebook"))
          }
      }
    } catch {
      case ex: Exception => {
        Logger.error("This error occurred while posting status to facebook :- " + ex)
        Ok(views.html.redirectMain("failure", server, "Cannot post message on Facebook"))
      }
    }
  }

  def getVerifier(queryString: Map[String, Seq[String]]): Option[String] = {
    val seq = queryString.get("code").getOrElse(Seq())
    seq.isEmpty match {
      case true => None
      case false => seq.headOption
    }
  }

  /**
   * TODO Register User using his Facebook ID
   */
  /*def registerNewUser(userName: String, userEmailId: String) {
    val date = new java.sql.Date(new java.util.Date().getTime())
    val password = PasswordHashing.generateRandomPassword
    val userData = User(userName, userEmailId, PasswordHashing.encryptPassword(password), UserType.user, date, None, Some(0), Some(0),
                     Some(""), Some(0))
    val newUser = UserService.register(userData)
    newUser match {
      case Right(user) => {
        Cache.set(user.email, user, 60 * 60)
        try {
          Common.sendMail(user.name + " <" + user.email + ">",
            "New Registration", Common.socialRegisterMessage(user.name, user.email, password))
        } catch {
          case e: Exception => Logger.info("" + e.printStackTrace())
        }
        Cache.set(userEmailId, user, 60 * 60)
        Ok(views.html.redirectmain(userEmailId, "success")).withSession(Security.username -> userEmailId)
      }
      case Left(message) =>
        Ok(views.html.redirectmain(message, "failure"))
    }
  }*/

}

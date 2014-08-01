package controllers

import play.api.mvc.Controller
import play.api.Play
import org.scribe.oauth.OAuthService
import org.scribe.model.Token
import play.api.mvc.Action
import org.scribe.builder.ServiceBuilder
import org.scribe.builder.api.FacebookApi
import play.api.Logger
import org.scribe.model.Verifier
import org.scribe.model.OAuthRequest
import org.scribe.model.Verb
import org.scribe.model.Response
import play.api.libs.json.Json

object FacebookAPIController {

  object FacebookController extends Controller {

    val SUCCESS = 200
    val apiKey: String = Play.current.configuration.getString("facebook_api_id").get
    val apiSecret: String = Play.current.configuration.getString("facebook_api_secret").get
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
        .callback(server + "/facebook/callback")
        .build()
      service
    }

    def facebookLogin: Action[play.api.mvc.AnyContent] = Action {
      try {
        val authorizationUrl: String = getOAuthService.getAuthorizationUrl(emptyToken);
        Redirect(authorizationUrl)
      } catch {
        case ex: Exception => {
          Logger.error("Error During Login Through Facebook - " + ex)
          Ok //(views.html.redirectmain("", "failure"))
        }
      }
    }

    def facebookCallback: Action[play.api.mvc.AnyContent] = Action { implicit request =>
      try {
        getVerifier(request.queryString) match {
          case None => Ok //(views.html.redirectmain("", "failure"))
          case Some(code) =>
            val verifier: Verifier = new Verifier(code)
            val accessToken: Token = getOAuthService.getAccessToken(emptyToken, verifier)
            val oAuthRequest: OAuthRequest = new OAuthRequest(Verb.GET, protectedResourceUrl)
            getOAuthService.signRequest(accessToken, oAuthRequest)
            val response: Response = oAuthRequest.send
            response.getCode match {
              case SUCCESS =>
                val json = Json.parse(response.getBody)
                val userEmailId = (json \ "email").asOpt[String]
                /*val user = UserService.getUserByEmailId(userEmailId.get)
              if (user != None) {
                Cache.set(userEmailId.get, user.get, 60 * 60)
                Ok(views.html.redirectmain(userEmailId.get, "success")).withSession(Security.username -> userEmailId.get)
              } else {
                registerNewUser((json \ "name").asOpt[String].get, userEmailId.get)
                Ok(views.html.redirectmain(userEmailId.get, "success")).withSession(Security.username -> userEmailId.get)
              }*/
                Ok
              case _ =>
                Ok //(views.html.redirectmain("", "failure"))
            }
        }
      } catch {
        case ex: Exception => {
          Ok //(views.html.redirectmain("", "failure"))
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

}

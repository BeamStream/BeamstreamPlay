package controllers

import org.scribe.builder.ServiceBuilder
import org.scribe.builder.api.LinkedInApi
import org.scribe.model.OAuthRequest
import org.scribe.model.Response
import org.scribe.model.Token
import org.scribe.model.Verifier
import org.scribe.oauth.OAuthService
import play.api.Logger
import play.api.Play
import play.api.mvc.Action
import play.api.mvc.Controller
import org.scribe.model.Verb

object LinkedInAPIController extends Controller {

  val SUCCESS = 200
  val POST_SUCCESS = 201
  val ERROR = 400
  val apiKey: String = Play.current.configuration.getString("linkedin_api_key").get
  val apiSecret: String = Play.current.configuration.getString("linkedin_secret_key").get
  val server = Play.current.configuration.getString("server").get
  var requestToken: Token = _
  val currentUserId = "userId"
  val protectedResourceUrl: String = "http://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,shares,mailbox)"

  /**
   * Get OAuthService Request
   */

  def getOAuthService: OAuthService = {
    new ServiceBuilder()
      .provider(classOf[LinkedInApi])
      .apiKey(apiKey)
      .apiSecret(apiSecret)
      .scope("rw_nus")
      .callback(server + "/linkedin/callback")
      .build();
  }

  def linkedinLogin: Action[play.api.mvc.AnyContent] = Action {
    try {
      requestToken = getOAuthService.getRequestToken
      val authUrl: String = getOAuthService.getAuthorizationUrl(requestToken)
      Redirect(authUrl)
    } catch {
      case ex: Exception => {
        Logger.error("Error During Login Through LinkedIn - " + ex)
        Ok(views.html.redirectMain("failure", server, "Cannot post message on LinkedIn"))
      }
    }
  }

  def linkedinCallback: Action[play.api.mvc.AnyContent] = Action { implicit request =>
    try {
      getVerifier(request.queryString) match {
        case None => Ok(views.html.redirectMain("failure", server, "Cannot post message on LinkedIn"))
        case Some(oauth_verifier) =>
          val verifier: Verifier = new Verifier(oauth_verifier)
          val accessToken: Token = getOAuthService.getAccessToken(requestToken, verifier);
          val oAuthRequest: OAuthRequest = new OAuthRequest(Verb.POST, "http://api.linkedin.com/v1/people/~/shares")

          // Posting message on LinkedIn
          val message = "Get on the exclusive beta list for ClassWall, a Social Learning Network for Colleges and Universities. It's built for college students and professors. It's lookin' pretty sweet so far!"
          val url = " http://bstre.am/k7lXGw"
          val xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \n" +
            "<share> \n" +
            "  <comment>" + message +
            "</comment> \n" +
            "  <content> \n" +
            "    <submitted-url>" + url +
            "</submitted-url> \n" +
            "  </content> \n" +
            "  <visibility> \n" +
            "    <code>anyone</code> \n" +
            "  </visibility> \n" +
            "</share>\n"

          //add xml payload to request
          oAuthRequest.addPayload(xml)
          getOAuthService.signRequest(accessToken, oAuthRequest)
          oAuthRequest.addHeader("Content-Type", "text/xml")
          val response: Response = oAuthRequest.send
          response.getCode match {
            case SUCCESS =>
              val linkedinXML = scala.xml.XML.loadString(response.getBody)
              val userEmailId = (linkedinXML \\ "email-address").text.trim
              val userNetwokId = (linkedinXML \\ "id").text.trim
              Ok(views.html.redirectMain("success", server, "Thanks for sharing it with others on LinkedIn"))
            case POST_SUCCESS =>
              Ok(views.html.redirectMain("success", server, "Thanks for sharing it with others on LinkedIn"))
            /*val user = UserService.getUserByEmailId(userEmailId)
              if(user != None) {
                Cache.set(userEmailId, user.get, 60 * 60)
                Ok(views.html.redirectmain(userEmailId, "success")).withSession(Security.username -> userEmailId)
              } else {
                registerNewUser((linkedinXML \\ "first-name").text.trim, userEmailId)
                Ok(views.html.redirectmain(userEmailId, "success")).withSession(Security.username -> userEmailId)}*/
            case _ =>
              Ok(views.html.redirectMain("failure", server, "Cannot post message on LinkedIn"))
          }
      }
    } catch {
      case ex: Exception => {
        Ok(views.html.redirectMain("failure", server, "Cannot post message on LinkedIn"))
      }
    }
  }

  def getVerifier(queryString: Map[String, Seq[String]]): Option[String] = {
    val seq = queryString.get("oauth_verifier").getOrElse(Seq())
    seq.isEmpty match {
      case true => None
      case false => seq.headOption
    }
  }

  /**
   * TODO Register User using his LinkedIn ID
   */
  /*def registerNewUser(userName: String, userEmailId: String) {
    val date = new java.sql.Date(new java.util.Date().getTime())
    val password = PasswordHashing.generateRandomPassword
    val userData = User(userName, userEmailId, PasswordHashing.encryptPassword(password), UserType.user, date, None, Some(0), Some(0), Some(""),Some(0))
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

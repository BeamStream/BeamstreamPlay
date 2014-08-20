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
import scala.collection.mutable.HashMap
import twitter4j.JSONObject
import org.json.simple.JSONValue
import com.sun.corba.se.spi.oa.OADefault

object LinkedInAPIController extends Controller {

  val SUCCESS = 200
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
    val service: OAuthService = new ServiceBuilder()
      .provider(classOf[LinkedInApi])
      .apiKey(apiKey)
      .apiSecret(apiSecret)
      .scope("r_fullprofile")
      .scope("r_emailaddress")
      .scope("rw_nus")
      .scope("w_messages")
      .callback(server + "/linkedin/callback")
      .build();
    service
  }

  def linkedinLogin: Action[play.api.mvc.AnyContent] = Action {
    try {
      requestToken = getOAuthService.getRequestToken
      val authUrl: String = getOAuthService.getAuthorizationUrl(requestToken)
      Redirect(authUrl)
    } catch {
      case ex: Exception => {
        Logger.error("Error During Login Through LinkedIn - " + ex)
        Ok //(views.html.redirectmain("", "failure"))
      }
    }
  }

  def linkedinCallback: Action[play.api.mvc.AnyContent] = Action { implicit request =>
    try {
      getVerifier(request.queryString) match {
        case None => Ok //(views.html.redirectmain("", "failure"))
        case Some(oauth_verifier) =>
          val verifier: Verifier = new Verifier(oauth_verifier)
          val accessToken: Token = getOAuthService.getAccessToken(requestToken, verifier);
          val oAuthRequest: OAuthRequest = new OAuthRequest(Verb.GET, protectedResourceUrl)
          
          val xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \n" +
                "<share> \n" +
                "  <comment>" + "H-1B Work Visa USA - Everything you need to know - Info, Tips, Guides, Stats, News, Updates, Recommendations, Community, Jobs and much more!" +
                "</comment> \n" +
                "  <content> \n" +
                "    <submitted-url>" + "http://h1b-work-visa-usa.blogspot.com" +
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

          /*oAuthRequest.addHeader("Content-Type", "text/xml")

          val message = (<?xml version='1.0' encoding='UTF-8'?>
                        <share>
                          <comment></comment>
                          <content>
                            <title>Just joined ClassWall</title>
                            <submitted-url>http://developer.linkedin.com</submitted-url>
                            <submitted-image-url>http://lnkd.in/Vjc5ec</submitted-image-url>
                          </content>
                          <visibility>
                            <code>anyone</code>
                          </visibility>
                        </share>)

          oAuthRequest.addPayload(message.toString)*/

          /*oAuthRequest.addHeader("Content-Type", "application/json")
          oAuthRequest.addHeader("x-li-format", "json")

          // make the json payload using json-simple
          val jsonMap = new HashMap[String, JSONObject]
          jsonMap.put("comment", new JSONObject())

          val contentObject = new JSONObject()
          contentObject.put("title", "Get on the exclusive beta list for BeamStream, a Social Learning Network for Colleges & Universities. It's built for college students & professors. It's lookin' pretty sweet so far! http://bstre.am/k7lXGw")

          jsonMap.put("content", contentObject)

          val visibilityObject = new JSONObject()
          visibilityObject.put("code", "anyone")

          jsonMap.put("visibility", visibilityObject)

          oAuthRequest.addPayload(JSONValue.toJSONString(jsonMap))*/
          //          oAuthRequest.addPayload("Get on the exclusive beta list for BeamStream, a Social Learning Network for Colleges & Universities. It's built for college students & professors. It's lookin' pretty sweet so far! http://bstre.am/k7lXGw")
          val response: Response = oAuthRequest.send
          println(response.getBody())
          response.getCode match {
            case SUCCESS =>
              val linkedinXML = scala.xml.XML.loadString(response.getBody)
              val userEmailId = (linkedinXML \\ "email-address").text.trim
              val userNetwokId = (linkedinXML \\ "id").text.trim
              Ok(views.html.redirectMain("success", server))
            /*val user = UserService.getUserByEmailId(userEmailId)
              if(user != None) {
                Cache.set(userEmailId, user.get, 60 * 60)
                Ok(views.html.redirectmain(userEmailId, "success")).withSession(Security.username -> userEmailId)
              } else {
                registerNewUser((linkedinXML \\ "first-name").text.trim, userEmailId)
                Ok(views.html.redirectmain(userEmailId, "success")).withSession(Security.username -> userEmailId)}*/
            case _ =>
              Ok(views.html.redirectMain("failure", server))
          }
      }
    } catch {
      case ex: Exception => {
        Ok(views.html.redirectMain("failure", server))
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

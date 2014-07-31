package controllers

import java.io.BufferedReader
import java.io.DataOutputStream
import java.io.InputStreamReader
import java.net.URL
import java.util.Arrays
import com.google.api.client.googleapis.auth.oauth2.GoogleBrowserClientRequestUrl
import javax.net.ssl.HttpsURLConnection
import play.api.mvc.Action
import play.api.mvc.Controller
import play.api.Play
import play.api.mvc.AnyContent
import play.api.Logger

object GoogleAPIController extends Controller {

  implicit val formats = net.liftweb.json.DefaultFormats

  val redirectURI = Play.current.configuration.getString("GoogleRedirectUI").get
  val GoogleClientId = Play.current.configuration.getString("GoogleClientId").get
  val GoogleClientSecret = Play.current.configuration.getString("GoogleClientSecret").get

  def authenticateToGoogle: Action[AnyContent] = Action { implicit request =>
    val urlToRedirect = new GoogleBrowserClientRequestUrl(GoogleClientId, redirectURI, Arrays.asList("https://www.googleapis.com/auth/plus.login")).set("access_type", "online").set("response_type", "code").build()
    Ok(urlToRedirect).withSession(request.session)
  }

  /**
   * Google Oauth2 accessing code and exchanging it for Access
   */
  def googleDriveAuthentication: Action[AnyContent] = Action { implicit request =>
    try {
      val code = request.queryString("code").toList(0)
      val url = "https://accounts.google.com/o/oauth2/token"
      val obj = new URL(url)
      val con = obj.openConnection().asInstanceOf[HttpsURLConnection]

      con.setRequestMethod("POST");
      con.setRequestProperty("User-Agent", USER_AGENT);
      con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");

      val urlParameters = "code=" + code + "&client_id=" + GoogleClientId + "&client_secret=" + GoogleClientSecret + "&redirect_uri=" + redirectURI + "&grant_type=authorization_code&Content-Type=application/x-www-form-urlencoded";
      con.setDoOutput(true)
      val wr = new DataOutputStream(con.getOutputStream)
      wr.writeBytes(urlParameters)
      wr.flush
      wr.close
          val in = new BufferedReader(
            new InputStreamReader(con.getInputStream))
          val response = new StringBuffer

          while (in.readLine != null) {
            response.append(in.readLine)
          }
          in.close
          val nullExpr = "null".r
          val dataString = nullExpr.replaceAllIn(response.toString, "")
          val dataList = dataString.split(",").toList
          val tokenValues = dataList map {
            case info => net.liftweb.json.parse("{" + info + "}")
          }
          val accessToken = (tokenValues(0) \ "access_token").extract[String]
//          val refreshToken = (tokenValues(2) \ "refresh_token").extract[String]
          
          Ok//(views.html.stream(action))
    } catch {
      case ex: Exception =>
        Logger.error("This error occurred while Authenticating Google Drive :- ", ex)
        Ok(views.html.stream("failure")) //BadRequest("Authentication Failed")
    }
  }

  /**
   * @Deprecated
   */
  def accessToken: Action[AnyContent] = Action { implicit request =>
    val access_Token = request.queryString("access_token").toList(0)
    request.session + ("access_token" -> access_Token)
    Ok.withSession(request.session + ("accessToken" -> access_Token))
  }

}

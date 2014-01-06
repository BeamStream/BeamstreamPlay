package controllers

import java.io.BufferedReader
import java.io.DataOutputStream
import java.io.InputStreamReader
import java.net.URL
import java.util.Arrays
import org.bson.types.ObjectId
import com.google.api.client.googleapis.auth.oauth2.GoogleBrowserClientRequestUrl
import javax.net.ssl.HttpsURLConnection
import models.SocialToken
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.GoogleDocsUploadUtility
import play.api.i18n.Messages
import play.api.Play
import models.Message
import models.Type
import models.Access
import models.User
import java.util.Date
import models.Question
import models.Document
import models.DocType
import net.liftweb.json.Serialization.{ read, write }
object GoogleDocsUploadUtilityController extends Controller {

  implicit val formats = net.liftweb.json.DefaultFormats

  val redirectURI = Play.current.configuration.getString("GoogleRedirectUI").get
  val GoogleClientId = Play.current.configuration.getString("GoogleClientId").get
  val GoogleClientSecret = Play.current.configuration.getString("GoogleClientSecret").get
  def authenticateToGoogle(action: String) = Action { implicit request =>

    val refreshTokenFound = SocialToken.findSocialToken(new ObjectId(request.session.get("userId").get))
    refreshTokenFound match {
      case None =>
        val urlToRedirect = new GoogleBrowserClientRequestUrl(GoogleClientId, redirectURI, Arrays.asList("https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/drive")).set("access_type", "offline").set("response_type", "code").build()
        Ok(urlToRedirect).withSession(request.session + ("action" -> action))
      case Some(refreshToken) =>
        val newAccessToken = GoogleDocsUploadUtility.getNewAccessToken(refreshToken)
        //        Ok(views.html.stream()).withSession(request.session + ("accessToken" -> newAccessToken))
        if (action == "show") {
          val files = GoogleDocsUploadUtility.getAllDocumentsFromGoogleDocs(newAccessToken)
          /*Ok(views.html.showgoogledocs(files))*/

          Ok(write(files)).as("application/json")

        } else if (action == "upload") {
          Ok.withSession(request.session + ("accessToken" -> newAccessToken))
        } else if (action == "document") {
          Ok
          /*Redirect("http://docs.google.com/document/create?hl=en")*/
        } else if (action == "spreadsheet") {
          Ok
          /*Redirect("http://spreadsheets.google.com/ccc?new&hl=en")*/
        } else if (action == "presentation") {
          Ok
          /*Redirect(" https://drive.google.com")*/
        } else {
          Ok
        }
    }

  }

  /**
   * Google Oauth2 accessing code and exchanging it for Access & Refresh Token
   */
  def googleDriveAuthentication = Action { implicit request =>
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
    val refreshToken = (tokenValues(2) \ "refresh_token").extract[String]
    SocialToken.addToken(SocialToken(new ObjectId(request.session.get("userId").get), refreshToken))
    val action = request.session.get("action").get
    if (action == "show") {
      val files = GoogleDocsUploadUtility.getAllDocumentsFromGoogleDocs(accessToken)
      Redirect("/stream")
    } else if (action == "upload") {
      Redirect("/stream")
    } else if (action == "document") {
      Redirect("/stream")
    } else if (action == "spreadsheet") {
      Redirect("/stream")
    } else if (action == "presentation") {
      Redirect("/stream")
    } else Ok
  }

  /**
   * Google Oauth2 Setup
   */
  def uploadPage = Action { implicit request =>
    Ok(views.html.gdocs(Nil))
  }
  /**
   * @Deprecated
   */
  def accessToken = Action { implicit request =>
    val access_Token = request.queryString("access_token").toList(0)
    request.session + ("access_token" -> access_Token)
    Ok.withSession(request.session + ("accessToken" -> access_Token))
  }
  /**
   * Uploading File To Google
   */
  def uploadToGoogleDrive = Action(parse.multipartFormData) { request =>
    request.body.file("picture").map { file =>
      val contentType = file.contentType
      val fileName = file.filename
      val FileReceived: java.io.File = file.ref.file.asInstanceOf[java.io.File]
      val accessToken = request.session.get("accessToken").get
      val googleFileUrl = GoogleDocsUploadUtility.uploadToGoogleDrive(accessToken, FileReceived, fileName, contentType.get)
      /*val userId = new ObjectId(request.session.get("userId").get)
      val user = User.getUserProfile(userId)
      //TODO : Stream Id Required 

      val documentToCreate = new Document(new ObjectId, fileName, "", googleFileUrl, DocType.GoogleDocs, userId, Access.Public, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "", 0)
      val docId = Document.addDocument(documentToCreate)
      val message = Message(new ObjectId, googleFileUrl, Option(Type.Document), Option(Access.Public), new Date, userId, None, user.get.firstName, user.get.lastName, 0, Nil, Nil, 0, Nil, None, None)
      val messageId = Message.createMessage(message)*/

    }

    Redirect("/stream")
  }

  def getAllGoogleDriveFiles = Action { implicit request =>
    val accessToken = request.session.get("accessToken").get
    val files = GoogleDocsUploadUtility.getAllDocumentsFromGoogleDocs(accessToken)
    Ok(views.html.gdocs(files))
  }

}
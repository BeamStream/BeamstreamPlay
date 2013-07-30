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

object GoogleDocsUploadUtilityController extends Controller {

  implicit val formats = net.liftweb.json.DefaultFormats

  val redirectURI = "http://localhost:9000/driveAuth"

  def authenticateToGoogle = Action { implicit request =>

    val refreshTokenFound = SocialToken.findSocialToken(new ObjectId(request.session.get("userId").get))
    refreshTokenFound match {
      case None =>
        val urlToRedirect = new GoogleBrowserClientRequestUrl("213363569061.apps.googleusercontent.com", redirectURI, Arrays.asList("https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/drive")).set("access_type", "offline").set("response_type", "code").build()
        Redirect(urlToRedirect)
      case Some(refreshToken) =>
        val newAccessToken=GoogleDocsUploadUtility.getNewAccessToken(refreshToken)
        Ok(views.html.stream()).withSession(request.session + ("accessToken" -> newAccessToken))
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

    val urlParameters = "code=" + code + "&client_id=213363569061.apps.googleusercontent.com&client_secret=d3s0YP7_xtCaAtgCiSy_RNdU&redirect_uri=http://localhost:9000/driveAuth&grant_type=authorization_code&Content-Type=application/x-www-form-urlencoded";
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
    println(response)
    val nullExpr = "null".r
    val dataString = nullExpr.replaceAllIn(response.toString, "")
    val dataList = dataString.split(",").toList
    val tokenValues = dataList map {
      case info => net.liftweb.json.parse("{" + info + "}")
    }

    val accessToken = (tokenValues(0) \ "access_token").extract[String]
    val refreshToken = (tokenValues(2) \ "refresh_token").extract[String]
    SocialToken.addToken(SocialToken(new ObjectId(request.session.get("userId").get), refreshToken))
    Ok(views.html.stream()).withSession(request.session + ("accessToken" -> accessToken))
    //        Ok(views.html.fetchtoken())
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
      val googleFileId = GoogleDocsUploadUtility.uploadToGoogleDrive(accessToken, FileReceived, fileName, contentType.get)
    }
    Ok(views.html.gdocs(Nil))
  }

  def getAllGoogleDriveFiles = Action { implicit request =>
    val accessToken = request.session.get("accessToken").get
    val files = GoogleDocsUploadUtility.getAllDocumentsFromGoogleDocs(accessToken)
    Ok(views.html.gdocs(files))
  }

}
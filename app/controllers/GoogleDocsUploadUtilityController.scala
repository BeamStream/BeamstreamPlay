package controllers

import play.api.mvc.Controller
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse
import com.google.api.client.http.FileContent
import com.google.api.client.http.HttpTransport
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.JsonFactory
import com.google.api.client.json.jackson.JacksonFactory
import com.google.api.services.drive.Drive
import com.google.api.services.drive.DriveScopes
import com.google.api.services.drive.model.File
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.util.Arrays
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow
import play.libs.WS
import play.Logger
import play.api.mvc.Action
import java.net.URL
import play.Logger
import play.api.templates.Html
import utils.GoogleDocsUploadUtility
import com.google.api.client.googleapis.auth.oauth2.GoogleBrowserClientRequestUrl

object GoogleDocsUploadUtilityController extends Controller {

  val redirectURI = "http://localhost:9000/driveAuth"

  def uploadNow = Action { implicit request =>
    val url = new GoogleBrowserClientRequestUrl("612772830843.apps.googleusercontent.com", redirectURI, Arrays.asList("https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/drive")).build()
    Redirect(url)
  }

  /**
   * Google Oauth2 Setup
   */
  def googleDriveAuthentication = Action { implicit request =>
    Ok(views.html.fetchtoken())
  }
  /**
   * Google Oauth2 Setup
   */
  def uploadPage = Action { implicit request =>
    Ok(views.html.gdocs(Nil))
  }
  def accessToken = Action { implicit request =>
    println(request)
    val access_Token = request.queryString("access_token").toList(0)
    request.session + ("access_token" -> access_Token)
    println("Cool")
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
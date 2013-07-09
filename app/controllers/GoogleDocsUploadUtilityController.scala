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

object GoogleDocsUploadUtilityController extends Controller {

  val redirectURI = "http://localhost:9000/driveAuth"

  def uploadNow = Action { implicit request =>
    val resultObtainedAsGoogleAuthPage = WS.url("https://accounts.google.com/o/oauth2/auth").setQueryParameter("access_type", "online").setQueryParameter("approval_prompt", "auto").setQueryParameter("client_id", "612772830843.apps.googleusercontent.com")
      .setQueryParameter("redirect_uri", redirectURI).setQueryParameter("response_type", "code").setQueryParameter("scope", "https://www.googleapis.com/auth/drive").get
    Logger.info(resultObtainedAsGoogleAuthPage.get.getBody())
    Ok(views.html.googleauth(resultObtainedAsGoogleAuthPage.get.getBody))

  }

  //---------------------Google Infrastructure Demo----------------------------------------
  /**
   * Google Oauth Setup
   */
  def googleDriveAuthentication = Action { implicit request =>
    println(request)
    val a = request.queryString("code").map {
      case accessToken => accessToken
    }
    Ok(views.html.gdocs(Nil)).withSession(request.session + ("accessToken" -> a(0)))
  }

  /**
   * Uploading File To Google
   */
  def uploadToGoogleDrive = Action(parse.multipartFormData) { request =>
    request.body.file("picture").map { file =>
      val contentType = file.contentType
      val fileName = file.filename
      val FileReceived: java.io.File = file.ref.file.asInstanceOf[java.io.File]
      val code = request.session.get("code").get
//      val googleFileId = GoogleDocsUploadUtility.uploadToGoogleDrive(code, FileReceived, fileName, contentType.get)
    }
    Ok(views.html.gdocs(Nil))
  }
//
//  def getAllGoogleDriveFiles = Action { implicit request =>
//    val code = request.session.get("code").get
//    val files = GoogleDocsUploadUtility.getAllDocumentsFromGoogleDocs(code)
//    Ok(views.html.gdocs(files))
//  }
//
}
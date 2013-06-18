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

object GoogleDocsUploadUtilityController extends Controller {

  val redirectURI="http://localhost:9000/driveAuth"
  
  
  def uploadNow = Action { implicit request =>
    val resultObtainedAsGoogleAuthPage = WS.url("https://accounts.google.com/o/oauth2/auth").setQueryParameter("access_type", "online").setQueryParameter("approval_prompt", "auto").setQueryParameter("client_id", "612772830843.apps.googleusercontent.com")
      .setQueryParameter("redirect_uri", redirectURI).setQueryParameter("response_type", "code").setQueryParameter("scope", "https://www.googleapis.com/auth/drive").get
    Logger.info(resultObtainedAsGoogleAuthPage.get.getBody)
    Ok(views.html.googleauth(resultObtainedAsGoogleAuthPage.get.getBody))

  }

}
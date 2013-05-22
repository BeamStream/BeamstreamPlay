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

  def uploadNow = Action { implicit request =>
    val CLIENT_ID = "612772830843.apps.googleusercontent.com"
    val CLIENT_SECRET = "7tTkGI2KaDX901Ngwe91Kz_K"

    val REDIRECT_URI = "http://localhost:9000/driveAuth"

    val httpTransport = new NetHttpTransport
    val jsonFactory = new JacksonFactory

    val flow = new GoogleAuthorizationCodeFlow.Builder(
      httpTransport, jsonFactory, CLIENT_ID, CLIENT_SECRET, Arrays.asList(DriveScopes.DRIVE))
      .setAccessType("online")
      .setApprovalPrompt("auto").build()
    val url = flow.newAuthorizationUrl().setRedirectUri(REDIRECT_URI).build
    println(url)
    val a = WS.url("https://accounts.google.com/o/oauth2/auth").setQueryParameter("access_type", "online").setQueryParameter("approval_prompt", "auto").setQueryParameter("client_id", "612772830843.apps.googleusercontent.com").setQueryParameter("redirect_uri", "http://localhost:9000/driveAuth").setQueryParameter("response_type", "code").setQueryParameter("scope", "https://www.googleapis.com/auth/drive").get
    Logger.info(a.get().getBody())

    ////     Redirect(url)
    //        val urle = new URL(url)
    //        val conn = urle.openConnection
    //        conn.connect();

    //    val url11 = new URL(url);
    //    val in27 = new BufferedReader(
    //      new InputStreamReader(
    //        url11.openStream()))
    //    println("sleeping now")
    //    Thread.sleep(50000)
    //    val code = request.session.get("code")
    //
    //    if (code != None) {
    //      val response = flow.newTokenRequest(code.get).setRedirectUri(REDIRECT_URI).execute()
    //      val credential = new GoogleCredential().setFromTokenResponse(response)
    //      //Create a new authorized API client
    //      val service: Drive = new Drive.Builder(httpTransport, jsonFactory, credential).build()
    //      //Insert a file  
    //      val body = new File
    //      body.setTitle("")
    //      body.setDescription("NeelJi")
    //      body.setMimeType("image/png")
    //      val fileContent = new java.io.File("/home/neelkanth/pictures/images.jpg")
    //      val mediaContent = new FileContent("image/png", fileContent)
    //      //Inserting the files
    //      val file = service.files().insert(body, mediaContent).execute()
    //      //Listing the Files
    //      //val file = service.files().list().execute()
    //
    //      Ok(file.getId)
    //    } else {
    //      Ok("No Value")
    //    }
    Ok(views.html.googleauth(Html(a.get().getBody())))
  }

}
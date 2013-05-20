package utils

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
import controllers.DocumentController

object GoogleDocsUploadUtility {

  val CLIENT_ID = "612772830843.apps.googleusercontent.com"
  val CLIENT_SECRET = "7tTkGI2KaDX901Ngwe91Kz_K"

  val REDIRECT_URI = "http://localhost:9000/oauth2callback"

  val httpTransport = new NetHttpTransport
  val jsonFactory = new JacksonFactory

  val flow = new GoogleAuthorizationCodeFlow.Builder(
    httpTransport, jsonFactory, CLIENT_ID, CLIENT_SECRET, Arrays.asList(DriveScopes.DRIVE))
    .setAccessType("online")
    .setApprovalPrompt("auto").build()

  def UploadToGoogleDrive = {

    val url: String = flow.newAuthorizationUrl().setRedirectUri(REDIRECT_URI).build().toString

    /**
     *  System generated GET call For Clicking that UI
     */

    println("  " + url)

//    val a = WS.url("https://accounts.google.com/o/oauth2/auth").setQueryParameter("access_type", "online").setQueryParameter("approval_prompt", "auto")
//      .setQueryParameter("client_id", CLIENT_ID).setQueryParameter("scope", "https://www.googleapis.com/auth/drive").setQueryParameter("response_type", "code")
//      .setQueryParameter("redirect_uri", "http://localhost:9000/oauth2callback").get
//    println(a.get.getBody)
  }

  def uploadNow(code: String): String = {
    println(code)
    val response = flow.newTokenRequest(code).setRedirectUri(REDIRECT_URI).execute()
    val credential = new GoogleCredential().setFromTokenResponse(response)

    //Create a new authorized API client
    val service: Drive = new Drive.Builder(httpTransport, jsonFactory, credential).build()

    //Insert a file  
    val body = new File
    body.setTitle("maharajji")
    body.setDescription("A test document")
    body.setMimeType("image/png")

    val fileContent = new java.io.File("/home/neelkanth/Desktop/Maharajji.jpg")
    val mediaContent = new FileContent("image/png", fileContent)

    val file = service.files().insert(body, mediaContent).execute()
    println("File ID: " + file.getId)
    file.getId
  }

}
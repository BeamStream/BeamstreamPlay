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
  val CLIENT_SECRET = ""

  val REDIRECT_URI = "http://localhost:9000/driveAuth"

  val httpTransport = new NetHttpTransport
  val jsonFactory = new JacksonFactory

  val flow = new GoogleAuthorizationCodeFlow.Builder(
    httpTransport, jsonFactory, CLIENT_ID, CLIENT_SECRET, Arrays.asList(DriveScopes.DRIVE))
    .setAccessType("online")
    .setApprovalPrompt("auto").build()

  def uploadNow(code: String, fileToUpload: java.io.File, fileName: String, contentType: String): String = {
    val response = flow.newTokenRequest(code).setRedirectUri(REDIRECT_URI).execute()
    val credential = new GoogleCredential().setFromTokenResponse(response)
    //Create a new authorized API client
    val service: Drive = new Drive.Builder(httpTransport, jsonFactory, credential).build()
    //Insert a file  
    val body = new File
    body.setTitle("")
    body.setDescription(fileName)
    body.setMimeType(contentType)
    val fileContent: java.io.File = fileToUpload
    val mediaContent = new FileContent("image/png", fileContent)
    //Inserting the files
    val file = service.files().insert(body, mediaContent).execute()
    //Listing the Files
    //val file = service.files().list().execute()
    file.getId
  }

}
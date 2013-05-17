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
import play.api.libs.ws.WS

object GoogleDocsUploadUtility {

  val CLIENT_ID = "612772830843.apps.googleusercontent.com";
  val CLIENT_SECRET = "";

  val REDIRECT_URI = "http://localhost:9000/oauth2callback";

  def UploadToGoogleDrive(fileToBeuploaded: File) {

    val httpTransport = new NetHttpTransport
    val jsonFactory = new JacksonFactory

    val flow = new GoogleAuthorizationCodeFlow.Builder(
      httpTransport, jsonFactory, CLIENT_ID, CLIENT_SECRET, Arrays.asList(DriveScopes.DRIVE))
      .setAccessType("online")
      .setApprovalPrompt("auto").build()

    val url: String = flow.newAuthorizationUrl().setRedirectUri(REDIRECT_URI).build()
//------- Neel-------- (WIP)//
    /**
     *  System generated GET call For Clicking that UI
     */

    val responseObtained = WS.url(url).get
    println(responseObtained)
//--------Neel------------
    System.out.println("Please open the following URL in your browser then type the authorization code:")
    System.out.println("  " + url)
    val br = new BufferedReader(new InputStreamReader(System.in))
    val code: String = br.readLine()

    val response = flow.newTokenRequest(code).setRedirectUri(REDIRECT_URI).execute()
    val credential = new GoogleCredential().setFromTokenResponse(response)

    //Create a new authorized API client
    val service: Drive = new Drive.Builder(httpTransport, jsonFactory, credential).build()

    //Insert a file  
    val body = new File
    body.setTitle("neel")
    body.setDescription("A test document")
    body.setMimeType("image/png")

    val fileContent = new java.io.File("/home/neelkanth/Desktop/Screenshot from 2013-05-17 10:25:28.png")
    val mediaContent = new FileContent("text/plain", fileContent)

    val file = service.files().insert(body, mediaContent).execute()
    System.out.println("File ID: " + file.getId())
  }

}
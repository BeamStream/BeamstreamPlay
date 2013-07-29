package utils

import com.google.api.services.drive.Drive
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow
import com.google.api.client.json.jackson.JacksonFactory
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.services.drive.model.File
import com.google.api.client.http.FileContent
import java.util.Arrays
import com.google.api.services.drive.DriveScopes
import scala.collection.JavaConversions._
import java.io.IOException
object GoogleDocsUploadUtility {

  val CLIENT_ID = "612772830843.apps.googleusercontent.com"
  val CLIENT_SECRET = "6WW6a0DG8fujHdSHwCOnJMHW"
  val httpTransport = new NetHttpTransport
  val jsonFactory = new JacksonFactory
  /**
   * Set Up Google App Credentials
   */
  def returnGoogleCredentailsSettings(accessToken: String): Drive = {

    val credential = new GoogleCredential.Builder()
      .setJsonFactory(jsonFactory)
      .setTransport(httpTransport)
      .setClientSecrets(CLIENT_ID, CLIENT_SECRET)
      .build();
    credential.setAccessToken(accessToken);
    //Create a new authorized API client
    new Drive.Builder(httpTransport, jsonFactory, credential).build()
  }

  /**
   * Upload To Google Drive
   */
  def uploadToGoogleDrive(accessToken: String, fileToUpload: java.io.File, fileName: String, contentType: String): String = {
    val service = returnGoogleCredentailsSettings(accessToken)
    //Insert a file  
    val body = new File
    body.setTitle(fileName)
    body.setDescription(fileName)
    body.setMimeType(contentType)
    val fileContent: java.io.File = fileToUpload
    val mediaContent = new FileContent(contentType, fileContent)
    //Inserting the files
    val file = service.files.insert(body, mediaContent).execute()
    println("File Uploaded")
    file.getId

  }
  /**
   * Get All Files From Google Drive
   */

  def getAllDocumentsFromGoogleDocs(code: String): List[(String, String)] = {
    val service = returnGoogleCredentailsSettings(code)
    var result: List[File] = List()
    val request = service.files.list

    do {
      val files = request.execute
      result ++= (files.getItems)
      request.setPageToken(files.getNextPageToken)
    } while (request.getPageToken() != null && request.getPageToken().length() > 0)

    result map {
      case a => (a.getOriginalFilename, a.getAlternateLink)
    }
  }

  /**
   * Get Access token Using refresh Token
   */

  def getNewAccessToken(refreshToken: String):String = {
    val credentialBuilder = new GoogleCredential.Builder()
      .setTransport(httpTransport).setJsonFactory(jsonFactory)
      .setClientSecrets(CLIENT_ID, CLIENT_SECRET);

    val credential = credentialBuilder.build()
    credential.setRefreshToken(refreshToken)
    credential.refreshToken()
    credential.getAccessToken
  }

}
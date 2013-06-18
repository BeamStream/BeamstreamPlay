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
import play.api.Logger
import scala.collection.JavaConversions._

object GoogleDocsUploadUtility {
  /**
   * Set Up Google App Credentials
   */
  def returnGoogleCredentailsSettings(code: String): Drive = {
    val CLIENT_ID = "612772830843.apps.googleusercontent.com"
    val CLIENT_SECRET = "7tTkGI2KaDX901Ngwe91Kz_K"

    val REDIRECT_URI = "http://localhost:9000/driveAuth"

    val httpTransport = new NetHttpTransport
    val jsonFactory = new JacksonFactory

    val flow = new GoogleAuthorizationCodeFlow.Builder(
      httpTransport, jsonFactory, CLIENT_ID, CLIENT_SECRET, Arrays.asList(DriveScopes.DRIVE))
      .setAccessType("online")
      .setApprovalPrompt("auto").build()

    val response = flow.newTokenRequest(code).setRedirectUri(REDIRECT_URI).execute()
    val credential = new GoogleCredential().setFromTokenResponse(response)
    //Create a new authorized API client
    new Drive.Builder(httpTransport, jsonFactory, credential).build()
  }

  /**
   * Upload To Google Drive
   */
  def uploadToGoogleDrive(code: String, fileToUpload: java.io.File, fileName: String, contentType: String): String = {
    val service = returnGoogleCredentailsSettings(code)
    //Insert a file  
    val body = new File
    body.setTitle(fileName)
    body.setDescription(fileName)
    body.setMimeType(contentType)
    val fileContent: java.io.File = fileToUpload
    val mediaContent = new FileContent("", fileContent)
    //Inserting the files
    val file = service.files().insert(body, mediaContent).execute()
    file.getId
  }
  /**
   * Get All Files From Google Drive
   */

  def getAllDocumentsFromGoogleDocs(code: String): List[(String, String)] = {
    val service = returnGoogleCredentailsSettings(code)
    //    service.files.list.execute.getItems.isEmpty match {
    //      case true => Nil
    //      case false =>
    //        val tupleList = service.files.list.execute.getItems map {
    //          case driveFile => (driveFile.getOriginalFilename, driveFile.getAlternateLink)
    //        }
    //        tupleList.toList
    //    }

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

}
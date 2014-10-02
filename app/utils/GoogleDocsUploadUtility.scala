package utils

import scala.collection.JavaConversions.asScalaBuffer
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential
import com.google.api.client.http.FileContent
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson.JacksonFactory
import com.google.api.services.drive.Drive
import com.google.api.services.drive.model.File
import java.text.SimpleDateFormat
import play.api.Logger
import java.net.URL
import javax.net.ssl.HttpsURLConnection

object GoogleDocsUploadUtility {
  val formatter: SimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

  //TODO : Take these to configuration files
  val CLIENT_ID = "213363569061.apps.googleusercontent.com"
  val CLIENT_SECRET = "d3s0YP7_xtCaAtgCiSy_RNdU"
  val httpTransport = new NetHttpTransport
  val jsonFactory = new JacksonFactory
  /**
   * Set Up Google App Credentials
   */
  def prepareGoogleDrive(accessToken: String): Drive = {

    //Build the Google credentials and make the Drive ready to interact
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
    val service = prepareGoogleDrive(accessToken)

    //Insert a file
    val body = new File
    body.setTitle(fileName)
    body.setDescription(fileName)
    body.setMimeType(contentType)
    val fileContent: java.io.File = fileToUpload
    val mediaContent = new FileContent(contentType, fileContent)
    //Inserting the files
    val file = service.files.insert(body, mediaContent).execute()
    file.getAlternateLink

  }
  /**
   * Get All Files From Google Drive
   */

  def getAllDocumentsFromGoogleDocs(code: String, showAllGoogleDocs: Boolean): List[(String, String, String, String, String)] = {
    try {
      val service = prepareGoogleDrive(code)
      var result: List[File] = Nil
      var resultAllGoogleDocs: List[File] = Nil
      val request = service.files.list

      do {
        val files = request.execute
        result ++= files.getItems().filter(f => (f.getUserPermission().getType() == "anyone"))
        resultAllGoogleDocs ++= files.getItems()
        request.setPageToken(files.getNextPageToken)
      } while (request.getPageToken() != null && request.getPageToken().length() > 0)

      if (showAllGoogleDocs) {
        resultAllGoogleDocs map {
          case document =>
            val date = formatter.parse(document.getModifiedDate().toString())
            formatter.format(date)
            (document.getTitle(), document.getAlternateLink, formatter.format(date).toString, document.getOwnerNames().head, document.getThumbnailLink())
        }
      } else {
        result map {
          case document =>
            val date = formatter.parse(document.getModifiedDate().toString())
            formatter.format(date)
            (document.getTitle(), document.getAlternateLink, formatter.format(date).toString, document.getOwnerNames().head, document.getThumbnailLink())
        }
      }
    } catch {
      case ex: Exception =>
        Logger.error("This error occured while fetching all Google Docs from Google Drive :- ", ex)
        List(("", "", "", "", ""))
    }
  }

  def createANewGoogleDocument(code: String, mimeType: String): List[String] = {
    val service = prepareGoogleDrive(code)
    val body = new File
    body.setMimeType(mimeType)
    val docType = mimeType.substring(mimeType.lastIndexOf(".") + 1)
    body.setTitle("Untitled " + docType)
    val file = service.files.insert(body).execute
    List(file.getAlternateLink, file.getTitle(), file.getThumbnailLink())
  }

  def deleteAGoogleDocument(code: String, docId: String): Any = {
    val service = prepareGoogleDrive(code)
    try {
      service.files().delete(docId).execute()
    } catch {
      case ex: Exception => Logger.error("This error occured while Deleting a Google Doc :- ", ex)
    }
  }

  def canAccessGoogleDoc(codeOfOwner: String, codeOfRequester: String, fileId: String): Boolean = {

    try {
      val serviceOfOwner = prepareGoogleDrive(codeOfOwner)
      val serviceOfRequester = prepareGoogleDrive(codeOfRequester)
      /*val fileData = fileURL.split("/")
      fileData.length match {
        case 9 =>
          val fileId = fileData(7)*/
      val permission = serviceOfOwner.permissions().list(fileId).execute()
      if (permission.getItems()(0).getType() == "anyone") {
        true
      } else {
        val fileFound = serviceOfRequester.files().get(fileId).execute()
        fileFound.getUserPermission().toString().isDefinedAt(0) match {
          case true => true
          case false => false
        }
      }
      /*case 7 =>
          val fileId = fileData(5)
          val permission = serviceOfOwner.permissions().list(fileId).execute()
          if (permission.getItems()(0).getType() == "anyone")
            true
          else {
            val fileFound = serviceOfRequester.files().get(fileId).execute()
            fileFound.getUserPermission().toString().isDefinedAt(0) match {
              case true => true
              case false => false
            }
          }
        case _ => false
      }*/
    } catch {
      case ex: Exception =>
        Logger.error("This error occured while Displaying a Google Doc :- ", ex)
        false
    }
  }

  /**
   * TODO Remove it before Pushing it to Production
   */
  /*def makeGoogleDocPublicToClass(code: String, fileId: String): Any = {
    try {
      val service = prepareGoogleDrive(code)
      val getPermission = service.permissions().list(fileId).execute()
      if (getPermission.getItems()(0).getRole() == "owner" || getPermission.getItems()(0).getRole() == "writer") {
        val setPermission = new Permission()
        setPermission.setRole("reader")
        setPermission.setType("anyone")
        setPermission.setValue("me")
        service.permissions().insert(fileId, setPermission).execute()
      }
    } catch {
      case ex: Exception => Logger.error("This error occured while Making a Google Doc Public :- ", ex)
    }
  }*/

  /**
   * TODO Remove it when push it to Production
   */

  /*def canMakeGoogleDocPublic(code: String, fileData: String): Boolean = {
    try {
      val service = prepareGoogleDrive(code)
      val fileId = fileData.split("/")
      if (fileId.length >= 8) {
        val permissions = service.permissions().list(fileId(7)).execute()
        if (permissions.getItems()(0).getRole() == "owner") {
          true
        } else {
          false
        }
      } else { false }
    } catch {
      case ex: Exception =>
        Logger.error("This error occured while Checking a Google Docs Permissions :- ", ex)
        false
    }
  }*/

  /**
   * Get Access token Using refresh Token
   */

  def getNewAccessToken(refreshToken: String): String = {
    try {
      val credentialBuilder = new GoogleCredential.Builder()
        .setTransport(httpTransport).setJsonFactory(jsonFactory)
        .setClientSecrets(CLIENT_ID, CLIENT_SECRET);

      val credential = credentialBuilder.build()
      credential.setRefreshToken(refreshToken)
      credential.refreshToken
      credential.getAccessToken
    } catch {
      case ex: Exception =>
        Logger.error("This error occured while getting a New Access Token from Google Drive :- ", ex)
        "Not Found"
    }
  }

  /*def getGoogleDocDomain(code: String, fileId: String): String = {
    try {
      val service = prepareGoogleDrive(code)
      val domain = service.getGoogleClientRequestInitializer().permissions().list(arg0).execute.getItems()(0).get("domain")
      domain.toString()
    } catch {
      case ex: Exception =>
        Logger.error("This error occured while Fetching Google Doc Name & Preview Image URL", ex)
        "Exception"
    }
  }*/

  /**
   * Get Google Doc Name & preview Image URL
   */
  def getGoogleDocData(code: String, fileId: String): String = {
    try {
      val service = prepareGoogleDrive(code)
      val file = service.files().get(fileId).execute()
      file.getTitle()
    } catch {
      case ex: Exception =>
        Logger.error("This error occured while Fetching Google Doc Name & Preview Image URL", ex)
        "Exception"
    }
  }

  /*def isThumbnailNull(code: String, fileURL: String): Boolean = {
    try {
      val service = prepareGoogleDrive(code)
      val file = service.files().get(fileId).execute()
      val url = new URL(file.getThumbnailLink())
      val url = new URL(fileURL)
      val connection = url.openConnection().asInstanceOf[HttpsURLConnection]
      connection.setRequestMethod("GET")
      connection.connect()
      if (connection.getContentLength() == -1) {
        connection.disconnect()
        true
      } else {
      if (connection.getContentLength() > 663) {
        connection.disconnect()
        false
      } else {
        connection.disconnect()
        true
      }
      //      }
    } catch {
      case ex: Exception =>
        Logger.error("This error occured while Checking Preview Image of Google Docs", ex)
        true
    }
  }*/
  def getGmailId(code: String): String = {
    try {
      val service = prepareGoogleDrive(code)
      val body = new File
      val mimeType = "application/vnd.google-apps.document"
      body.setMimeType(mimeType)
      val docType = mimeType.substring(mimeType.lastIndexOf(".") + 1)
      body.setTitle("Untitled " + docType)
      val file = service.files.insert(body).execute
      val gmailId = file.getOwners()(0).get("emailAddress").toString()
      service.files().delete(file.getId()).execute()
      gmailId
    } catch {
      case ex: Exception =>
        Logger.error("This error occured while fetching all Google Docs from Google Drive :- ", ex)
        ""
    }
  }

  def findGmailIdOfDocOwner(codeOfOwner: String, fileId: String): String = {

    try {
      val serviceOfOwner = prepareGoogleDrive(codeOfOwner)
      /*val fileData = fileURL.split("/")
      fileData.length match {
        case 9 =>
          val fileId = fileData(7)*/
      val fileFound = serviceOfOwner.files().get(fileId).execute()
      val gmailIdOfDocOwner = fileFound.getOwners()(0).get("emailAddress").toString()
      gmailIdOfDocOwner
      /*case 7 =>
          val fileId = fileData(5)
          val fileFound = serviceOfOwner.files().get(fileId).execute()
          val gmailIdOfDocOwner = fileFound.getOwners()(0).get("emailAddress").toString()
          gmailIdOfDocOwner
        case _ => ""
      }*/
    } catch {
      case ex: Exception =>
        Logger.error("This error occured while Displaying a Google Doc :- ", ex)
        ""
    }
  }
}

package controllers

import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import org.bson.types.ObjectId
import models.DocResulttoSent
import models.DocType
import models.Document
import models.DocumentAccess
import models.Files
import models.Message
import models.MessageAccess
import models.MessageType
import models.ResulttoSent
import models.User
import models.UserMedia
import models.UserMediaType
import net.liftweb.json.Serialization.write
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.AmazonUpload
import utils.AmazonUploadUtil
import utils.ExtractFrameFromVideoUtil
import utils.ObjectIdSerializer
import utils.PreviewOfPDFUtil
import utils.tokenEmailUtil
import models.Documents
/**
 * This controller class is used to store and retrieve all the information about documents.
 */

object DocumentController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /*
 * 
 * Add a document
 */

  def newDocument = Action { implicit request =>
    val documentJson = request.body.asJson.get
    val name = (documentJson \ "docName").as[String]
    val url = (documentJson \ "docURL").as[String]
    val access = (documentJson \ "docAccess").as[String]
    val docType = (documentJson \ "docType").as[String]
    val description = (documentJson \ "docDescription").as[String]
    val userId = new ObjectId(request.session.get("userId").get)
    val streamId = (documentJson \ "streamId").as[String]
    val date = new Date
    val documentToCreate = new Document(new ObjectId, name, description, url, DocType.withName(docType), userId, DocumentAccess.withName(access), new ObjectId(streamId), date, date, 0, Nil, Nil, Nil, "")
    val docId = Document.addDocument(documentToCreate)
    val user = User.getUserProfile(userId)
    //Create A Message As Well To Display The Doc Creation In Stream
    val message = Message(new ObjectId, url, Option(MessageType.Document), Option(MessageAccess.withName(access)), date, userId, Option(new ObjectId(streamId)), user.get.firstName, user.get.lastName, 0, Nil, Nil, 0, Nil, None, Option(docId))
    val messageId = Message.createMessage(message)
    val messageObtained = Message.findMessageById(messageId.get)
    val userMedia = UserMedia.getProfilePicForAUser(messageObtained.get.userId)
    val profilePicForUser = (!userMedia.isEmpty) match {
      case true => (userMedia.head.frameURL != "") match {
        case true => userMedia.head.frameURL
        case false => userMedia.head.mediaUrl
      }

      case false => ""
    }
    val docResults = DocResulttoSent(messageObtained.get, name, description, false, false, Option(profilePicForUser), None, Option(false))
    Ok(write(docResults)).as("application/json")

  }

  /**
   * Get all Documents for a User (Modified)
   */

  def getAllGoogleDocumentsForAUser = Action { implicit request =>
    val allDocumentsForAUser = Document.getAllGoogleDocumentsForAUser(new ObjectId(request.session.get("userId").get))
    Ok(write(Documents(allDocumentsForAUser))).as("application/json")
  }

  /**
   * Rock the document (Modified)
   * Rocking any kind of Doc Audio, Video , PPT etc.
   */
  def rockTheDocument(documentId: String) = Action { implicit request =>
    val totalRocks = Document.rockTheDocument(new ObjectId(documentId), new ObjectId(request.session.get("userId").get))
    Ok(write(totalRocks.toString)).as("application/json")
  }

  /*
      * Change the title and description
      */
  def changeTitleAndDescriptionForADocument(documentId: String) = Action { implicit request =>
    val jsonReceived = request.body.asJson.get
    val docDescription = (jsonReceived \ "docDescription").as[String]
    val docName = (jsonReceived \ "docName").as[String]
    val userMediaFound = UserMedia.findMediaById(new ObjectId(documentId))
    val resultantJson = userMediaFound match {
      case None =>
        Document.updateTitleAndDescription(new ObjectId(documentId), docName, docDescription)
        val docObtained = Document.findDocumentById(new ObjectId(documentId))
        write(List(docObtained))
      case Some(media) =>
        UserMedia.updateTitleAndDescription(new ObjectId(documentId), docName, docDescription)
        val userMediaObtained = UserMedia.findMediaById(new ObjectId(documentId))
        write(List(userMediaObtained))
    }

    Ok(resultantJson).as("application/json")

  }

  /*
    * Rockers of a document
    */
  def giveMeRockersOfDocument(documentId: String) = Action { implicit request =>
    val rockers = Document.rockersNames(new ObjectId(documentId))
    val rockersJson = write(rockers)
    Ok(rockersJson).as("application/json")
  }

  /**
   * Upload Media From HardDrive
   */

  def uploadDocumentFromDisk = Action(parse.multipartFormData) { request =>
    val documentJsonMap = request.body.asFormUrlEncoded.toMap
    val streamId = documentJsonMap("streamId").toList(0)
    val docDescription = documentJsonMap("docDescription").toList(0)
    val resultToSend = (request.body.file("docData").isEmpty) match {

      case true => None
      case false =>
        // Fetch the image stream and details
        request.body.file("docData").map { docData =>
          val documentName = docData.filename
          val contentType = docData.contentType.get
          val isImage = contentType.contains("image")
          val isVideo = contentType.contains("video")
          val isPdf = contentType.contains("pdf")
          val docAccess = documentJsonMap("docAccess").toList(0)
          val documentReceived: File = docData.ref.file.asInstanceOf[File]
          val docUniqueKey = tokenEmailUtil.securityToken
          val docNameOnAmazom = (docUniqueKey + documentName).replaceAll("\\s", "")
          AmazonUploadUtil.uploadFileToAmazon(docNameOnAmazom, documentReceived)
          val docURL = "https://s3.amazonaws.com/BeamStream/" + docNameOnAmazom
          val userId = new ObjectId(request.session.get("userId").get)
          val user = User.getUserProfile(userId)

          if (isImage == true) {
            val uploadResults = saveImageFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user.get)
            Option(uploadResults)
          } else if (isVideo == true) {
            val uploadResults = saveVideoFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user.get, docNameOnAmazom)
            Option(uploadResults)
          } else {
            if (isPdf == true) {
              val previewImageUrl = PreviewOfPDFUtil.convertPdfToImage(documentReceived, docNameOnAmazom)
              val uploadResults = savePdfFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user.get, docNameOnAmazom, previewImageUrl)
              Option(uploadResults)
            } else {
              val uploadResults = saveOtherDOcFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user.get, docNameOnAmazom)
              Option(uploadResults)
            }
          }
        }.get
    }
    Ok(write(resultToSend)).as("application/json")
  }

  //---------------------------//
  // File Section Starts Here //
  //-------------------------//
  /**
   * Get All File Types 
   */
  def getAllFilesForAUser = Action { implicit request =>
    val allfiles = Files.getAllFileTypes(new ObjectId(request.session.get("userId").get))
    Ok(write(Documents(allfiles))).as("application/json")
  }

  /**
   * Get All AudioFiles
   */

  def getAllAudioFilesForAUser = Action { implicit request =>
    val audioFiles = Files.getAllAudioFiles(new ObjectId(request.session.get("userId").get))
    Ok(write(Documents(audioFiles))).as("application/json")
  }

  /**
   * Get All PPTFiles
   */

  def getAllPPTFilesForAUser = Action { implicit request =>
    val PPTFiles = Files.getAllPPTFiles(new ObjectId(request.session.get("userId").get))
    Ok(write(Documents(PPTFiles))).as("application/json")
  }

  /**
   * Get All PPTFiles
   */

  def getAllPDFFilesForAUser = Action { implicit request =>
    val PDFFiles = Files.getAllPDFFiles(new ObjectId(request.session.get("userId").get))
    Ok(write(Documents(PDFFiles))).as("application/json")
  }

  /**
   * Get All DOCSFiles
   */

  def getAllDOCSFilesForAUser = Action { implicit request =>
    val DocsFiles = Files.getAllDOCSFiles(new ObjectId(request.session.get("userId").get))
    Ok(write(Documents(DocsFiles))).as("application/json")
  }

  /**
   * Follow Document
   */

  def followDocument(documentId: String) = Action { implicit request =>
    val followers = Document.followDocument(new ObjectId(request.session.get("userId").get), new ObjectId(documentId))
    Ok(write(followers.toString)).as("application/json")
  }

  /**
   * Save Image
   */
  private def saveImageFromMainStream(documentName: String, docDescription: String, userId: ObjectId, docURL: String, docAccess: String, streamId: ObjectId, user: User) = {
    val media = new UserMedia(new ObjectId, documentName, docDescription, userId, new Date, docURL, UserMediaType.Image, DocumentAccess.withName(docAccess), false, Option(streamId), "", 0, Nil, Nil, 0)
    val mediaId = UserMedia.saveMediaForUser(media)
    //Create A Message As Well To Display The Doc Creation In Stream
    val message = Message(new ObjectId, docURL, Option(MessageType.Image), Option(MessageAccess.withName(docAccess)), new Date, userId, Option(streamId), user.firstName, user.lastName, 0, Nil, Nil, 0, Nil, Option(docURL), Option(mediaId.get))
    val messageId = Message.createMessage(message)
    val userMedia = UserMedia.getProfilePicForAUser(userId)

    val profilePic = (!userMedia.isEmpty) match {
      case true => (userMedia.head.frameURL != "") match {
        case true => userMedia.head.frameURL
        case false => userMedia.head.mediaUrl
      }

      case false => ""
    }
    DocResulttoSent(message, documentName, docDescription, false, false, Option(profilePic), None, Option(false))
  }

  /**
   * Save Video
   */
  private def saveVideoFromMainStream(documentName: String, docDescription: String, userId: ObjectId, docURL: String, docAccess: String, streamId: ObjectId, user: User, docNameOnAmazon: String) = {
    val frameOfVideo = ExtractFrameFromVideoUtil.extractFrameFromVideo(docURL)
    //    (new AmazonUpload).uploadCompressedFileToAmazon(docNameOnAmazon + "Frame", frameOfVideo, 0, false, userId.toString)
    (new AmazonUpload).uploadCompressedFileToAmazon(docNameOnAmazon + "Frame", frameOfVideo)
    val videoFrameURL = "https://s3.amazonaws.com/BeamStream/" + docNameOnAmazon + "Frame"
    val media = UserMedia(new ObjectId, documentName, docDescription, userId, new Date, docURL, UserMediaType.Video, DocumentAccess.withName(docAccess), false, Option(streamId), videoFrameURL, 0, Nil, Nil)
    val mediaId = UserMedia.saveMediaForUser(media)
    val message = Message(new ObjectId, docURL, Option(MessageType.Video), Option(MessageAccess.withName(docAccess)), new Date, userId, Option(streamId), user.firstName, user.lastName, 0, Nil, Nil, 0, Nil, Option(videoFrameURL), Option(mediaId.get))
    val messageId = Message.createMessage(message)
    val userMedia = UserMedia.getProfilePicForAUser(userId)

    val profilePic = (!userMedia.isEmpty) match {
      case true => (userMedia.head.frameURL != "") match {
        case true => userMedia.head.frameURL
        case false => userMedia.head.mediaUrl
      }

      case false => ""
    }
    new DocResulttoSent(message, documentName, docDescription, false, false, Option(profilePic), None, Option(false))
  }

  /**
   * Save Pdf
   */
  private def savePdfFromMainStream(documentName: String, docDescription: String, userId: ObjectId, docURL: String, docAccess: String, streamId: ObjectId, user: User, docNameOnAmazon: String, previewImageUrl: String) = {
    val documentCreated = new Document(new ObjectId, documentName, docDescription, docURL, DocType.Other, userId, DocumentAccess.withName(docAccess),
      streamId, new Date, new Date, 0, Nil, Nil, Nil, previewImageUrl)
    val documentId = Document.addDocument(documentCreated)
    val message = Message(new ObjectId, docURL, Option(MessageType.Document), Option(MessageAccess.withName(docAccess)), new Date, userId, Option(streamId), user.firstName, user.lastName, 0, Nil, Nil, 0, Nil, Option(previewImageUrl), Option(documentId))
    val messageId = Message.createMessage(message)
    val userMedia = UserMedia.getProfilePicForAUser(userId)

    val profilePic = (!userMedia.isEmpty) match {
      case true => (userMedia.head.frameURL != "") match {
        case true => userMedia.head.frameURL
        case false => userMedia.head.mediaUrl
      }

      case false => ""
    }
    new DocResulttoSent(message, documentName, docDescription, false, false, Option(profilePic), None, Option(false))
  }
  /**
   * Save other documents
   */
  private def saveOtherDOcFromMainStream(documentName: String, docDescription: String, userId: ObjectId, docURL: String, docAccess: String, streamId: ObjectId, user: User, docNameOnAmazon: String) = {
    val documentCreated = new Document(new ObjectId, documentName, docDescription, docURL, DocType.Other, userId, DocumentAccess.withName(docAccess),
      streamId, new Date, new Date, 0, Nil, Nil, Nil, "")
    val documentId = Document.addDocument(documentCreated)
    val message = Message(new ObjectId, docURL, Option(MessageType.Document), Option(MessageAccess.withName(docAccess)), new Date, userId, Option(streamId), user.firstName, user.lastName, 0, Nil, Nil, 0, Nil, None, Option(documentId))
    val messageId = Message.createMessage(message)
    val userMedia = UserMedia.getProfilePicForAUser(userId)

    val profilePic = (!userMedia.isEmpty) match {
      case true => (userMedia.head.frameURL != "") match {
        case true => userMedia.head.frameURL
        case false => userMedia.head.mediaUrl
      }

      case false => ""
    }
    new DocResulttoSent(message, documentName, docDescription, false, false, Option(profilePic), None, Option(false))
  }

  /**
   * Get view count of a document
   */

  def viewCount(documentId: String) = Action { implicit request =>
    val mediaFile = UserMedia.findMediaById(new ObjectId(documentId))
    val viewCount = (mediaFile != None) match {
      case true => UserMedia.increaseViewCountOfUsermedia(mediaFile.get.id)
      case false => Document.increaseViewCountOfADocument(new ObjectId(documentId))
    }
    Ok(write(viewCount.toString)).as("application/json")
  }
}


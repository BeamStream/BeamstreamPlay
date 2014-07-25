package controllers

import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import org.bson.types.ObjectId
import models.Access
import models.DocResulttoSent
import models.DocType
import models.Document
import models.Documents
import models.DocumentsAndMedia
import models.Files
import models.Message
import models.Question
import models.Type
import models.User
import models.UserMedia
import models.UserMediaType
import net.liftweb.json.Serialization.write
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.AmazonUpload
import utils.ExtractFrameFromVideoUtil
import utils.ObjectIdSerializer
import utils.PreviewOfPDFUtil
import utils.TokenEmailUtil
import play.Logger
import play.api.mvc.AnyContent
import models.SocialToken
import utils.GoogleDocsUploadUtility
import play.api.libs.json.Json

/**
 * This controller class is used to store and retrieve all the information about documents.
 */

object DocumentController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter: SimpleDateFormat = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /**
   * Add a document
   */

  /*def newDocument = Action { implicit request =>
    val documentJson = request.body.asJson.get
    val name = (documentJson \ "docName").as[String]
    val url = (documentJson \ "docURL").as[String]
    //    val access = (documentJson \ "docAccess").as[String]
    val docType = (documentJson \ "docType").as[String]
    val description = (documentJson \ "docDescription").as[String]
    val userId = new ObjectId(request.session.get("userId").get)
    val streamId = (documentJson \ "streamId").as[String]
    val date = new Date
    val documentToCreate = new Document(new ObjectId, name, description, url, DocType.withName(docType), userId, Access.Public, new ObjectId(streamId), date, date, 0, Nil, Nil, Nil, "", 0)
    val docId = Document.addDocument(documentToCreate)
    val user = User.getUserProfile(userId)
    //Create A Message As Well To Display The Doc Creation In Stream
    val message = Message(new ObjectId, url, Option(Type.Document), Option(Access.Public), date, userId, Option(new ObjectId(streamId)), user.get.firstName, user.get.lastName, 0, Nil, Nil, 0, Nil, None, Option(docId))
    val messageId = Message.createMessage(message)
    val messageObtained = Message.findMessageById(messageId.get)
    val profilePicForUser = UserMedia.getProfilePicUrlString(messageObtained.get.userId)
    val docResults = DocResulttoSent(Option(messageObtained.get), None, name, description, false, false, Option(profilePicForUser), None, Option(false), User.giveMeTheRockers(messageObtained.get.rockers))
    Ok(write(docResults)).as("application/json")

  }*/

  def newGoogleDocument: Action[AnyContent] = Action { implicit request =>
    val result = request.body
    val data = request.body.asFormUrlEncoded.get
    val userId = request.session.get("userId").get
    val docUrl = data("docUrl").toList.head
    val tokenInfo = SocialToken.findSocialTokenObject(new ObjectId(userId)).get
    val newAccessToken = GoogleDocsUploadUtility.getNewAccessToken(tokenInfo.refreshToken)
    val fileIdList = docUrl.split("/")
    /*if (fileId.length >= 8) {
      GoogleDocsUploadUtility.makeGoogleDocPublicToClass(newAccessToken, fileId(7))
    }*/
    var docName: String = ""
    var fileId: String = ""  
    if (fileIdList.length >= 8) {
      docName = GoogleDocsUploadUtility.getGoogleDocData(newAccessToken, fileIdList(7))
      fileId = fileIdList(7)
    } else {
      docName = GoogleDocsUploadUtility.getGoogleDocData(newAccessToken, fileIdList(5))
      fileId = fileIdList(5)
    }

    docName match {
      case "Exception" => Ok
      case _ =>
        val description = data("description").toList.head
        val post = data("postToFileMedia").toList.head.toBoolean
        val streamId = data("streamId").toList.head
        val documentToCreate = new Document(new ObjectId, docName, description, docUrl, DocType.GoogleDocs, new ObjectId(userId), Access.PrivateToClass, new ObjectId(streamId), new Date, new Date, 0, Nil, Nil, Nil, "", 0, post, fileId)
        val docId = Document.addDocument(documentToCreate)
        val user = User.getUserProfile(new ObjectId(userId))

        //Create A Message As Well To Display The Doc Creation In Stream
        val message = Message(new ObjectId, docUrl, Option(Type.Document), Option(Access.PrivateToClass), new Date, new ObjectId(userId), Option(new ObjectId(streamId)), user.get.firstName, user.get.lastName, 0, Nil, Nil, 0, Nil, "", Option(docId), docName)
        val messageId = Message.createMessage(message)
        val resultToSend = DocResulttoSent(Option(message), None, docName, description, false, false, None, None, None, List())
        //Making Google Doc Public to Class

        /**
         * TODO Send an Alert/Request of Permission for Restricted Google Docs.
         */
        /*else {
      val docId = fileId(6).split("=")(1).split("&")(0)
      GoogleDocsUploadUtility.makeGoogleDocPublicToClass(newAccessToken, docId)
    }*/
        Ok(write(resultToSend)).as("application/json")
    }
  }

  /**
   * Get all Documents for a User
   */

  def getAllGoogleDocumentsForAUser: Action[AnyContent] = Action { implicit request =>
    val allDocumentsForAUser = Document.getAllGoogleDocumentsForAUser(new ObjectId(request.session.get("userId").get))
    Ok(write(Documents(allDocumentsForAUser))).as("application/json")
  }

  /**
   * Rock the document
   * Rocking any kind of Doc Audio, Video , PPT etc.
   */
  def rockTheDocument(documentId: String): Action[AnyContent] = Action { implicit request =>
    val totalRocks = Document.rockTheDocument(new ObjectId(documentId), new ObjectId(request.session.get("userId").get))
    Ok(write(totalRocks.toString)).as("application/json")
  }

  /**
   * Change the title and description
   */
  def changeTitleAndDescriptionForADocument(documentId: String): Action[AnyContent] = Action { implicit request =>
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

  /**
   * Rockers of a document
   */
  def giveMeRockersOfDocument(documentId: String): Action[AnyContent] = Action { implicit request =>
    val rockers = Document.rockersNames(new ObjectId(documentId))
    val rockersJson = write(rockers)
    Ok(rockersJson).as("application/json")
  }

  /**
   * Upload Media From HardDrive
   */

  def uploadDocumentFromDisk: Action[play.api.mvc.MultipartFormData[play.api.libs.Files.TemporaryFile]] = Action(parse.multipartFormData) { request =>
    val documentJsonMap = request.body.asFormUrlEncoded.toMap
    val streamId = documentJsonMap("streamId").toList(0)
    val docDescription = documentJsonMap("docDescription").toList(0)
    val uploadedFrom = documentJsonMap("uploadedFrom").toList(0)
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
          val docUniqueKey = TokenEmailUtil.securityToken
          val docNameOnAmazom = (docUniqueKey + documentName).replaceAll("\\s", "")
          val isFileUploaded = (new AmazonUpload).uploadFileToAmazon(docNameOnAmazom, documentReceived)
          val docURL = "https://s3.amazonaws.com/BeamStream/" + docNameOnAmazom
          val userId = new ObjectId(request.session.get("userId").get)
          val user = User.getUserProfile(userId)

          isFileUploaded match {
            case false => List(Option("Failure"), false)
            case true => List(Option(docURL), true)
            //TODO remove before pushing to Production
            /*if (isImage) {
              val uploadResults = saveImageFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user.get, uploadedFrom)
              List(Option(uploadResults), isFileUploaded)
            } else if (isVideo) {
              val uploadResults = saveVideoFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user.get, docNameOnAmazom, uploadedFrom)
              if (uploadResults.message == None && uploadResults.question == None)
                List(Option("Failure"), false)
              else
                List(Option(uploadResults), isFileUploaded)
            } else {
              if (isPdf) {
                val previewImageUrl = PreviewOfPDFUtil.convertPdfToImage(documentReceived, docNameOnAmazom)
                val uploadResults = savePdfFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user.get, docNameOnAmazom, previewImageUrl, uploadedFrom)
                List(Option(uploadResults), isFileUploaded)
              } else {
                val uploadResults = saveOtherDOcFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user.get, docNameOnAmazom, uploadedFrom)
                List(Option(uploadResults), isFileUploaded)
              }
            }*/
          }
        }.get
    }
    Ok(write(resultToSend)).as("application/json")
  }
  
  def postDocumentFromDisk: Action[play.api.mvc.MultipartFormData[play.api.libs.Files.TemporaryFile]] = Action(parse.multipartFormData) { request =>
    val documentJsonMap = request.body.asFormUrlEncoded.toMap
    val streamId = documentJsonMap("streamId").toList(0)
    val docDescription = documentJsonMap("docDescription").toList(0)
    val uploadedFrom = documentJsonMap("uploadedFrom").toList(0)
    val docURL = documentJsonMap("docURL").toList(0)
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
          val docUniqueKey = TokenEmailUtil.securityToken
          val docNameOnAmazom = (docUniqueKey + documentName).replaceAll("\\s", "")
          //val isFileUploaded = (new AmazonUpload).uploadFileToAmazon(docNameOnAmazom, documentReceived)
        //  val docURL = "https://s3.amazonaws.com/BeamStream/" + docNameOnAmazom
          val userId = new ObjectId(request.session.get("userId").get)
          val user = User.getUserProfile(userId)

          //isFileUploaded match {
            //case false => List(Option("Failure"), isFileUploaded)
            if (isImage) {
              val uploadResults = saveImageFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user.get, uploadedFrom)
              Option(uploadResults)
            } else if (isVideo) {
              val uploadResults = saveVideoFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user.get, docNameOnAmazom, uploadedFrom)
              if (uploadResults.message == None && uploadResults.question == None)
                Option("Failure")
              else
                Option(uploadResults)
            } else {
              if (isPdf) {
                val previewImageUrl = PreviewOfPDFUtil.convertPdfToImage(documentReceived, docNameOnAmazom)
                val uploadResults = savePdfFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user.get, docNameOnAmazom, previewImageUrl, uploadedFrom)
                Option(uploadResults)
              } else {
                val uploadResults = saveOtherDOcFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user.get, docNameOnAmazom, uploadedFrom)
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
   * Get All File Types (V)
   */
  def getAllFilesForAUser: Action[AnyContent] = Action { implicit request =>
    val allfiles = Files.getAllFileTypes(new ObjectId(request.session.get("userId").get))
    val mediaFiles = UserMedia.getAllMediaForAUser(new ObjectId(request.session.get("userId").get))
    val alluserdocsandfiles = List(DocumentsAndMedia(allfiles, mediaFiles))
    Ok(write(alluserdocsandfiles)).as("application/json")
  }

  /**
   * Get All AudioFiles
   */

  def getAllAudioFilesForAUser: Action[AnyContent] = Action { implicit request =>
    val audioFiles = Files.getAllAudioFiles(new ObjectId(request.session.get("userId").get))
    Ok(write(Documents(audioFiles))).as("application/json")
  }

  /**
   * Get All PPTFiles
   */

  def getAllPPTFilesForAUser: Action[AnyContent] = Action { implicit request =>
    val PPTFiles = Files.getAllPPTFiles(new ObjectId(request.session.get("userId").get))
    Ok(write(Documents(PPTFiles))).as("application/json")
  }

  /**
   * Get All PPTFiles
   */

  def getAllPDFFilesForAUser: Action[AnyContent] = Action { implicit request =>
    val PDFFiles = Files.getAllPDFFiles(new ObjectId(request.session.get("userId").get))
    Ok(write(Documents(PDFFiles))).as("application/json")
  }

  /**
   * Get All DOCSFiles
   */

  def getAllDOCSFilesForAUser: Action[AnyContent] = Action { implicit request =>
    val DocsFiles = Files.getAllDOCSFiles(new ObjectId(request.session.get("userId").get))
    Ok(write(Documents(DocsFiles))).as("application/json")
  }

  /**
   * Follow Document
   */

  def followDocument(documentId: String): Action[AnyContent] = Action { implicit request =>
    val followers = Document.followDocument(new ObjectId(request.session.get("userId").get), new ObjectId(documentId))
    Ok(write(followers.toString)).as("application/json")
  }

  /**
   * Save Image
   */
  private def saveImageFromMainStream(documentName: String, docDescription: String, userId: ObjectId, docURL: String, docAccess: String, streamId: ObjectId, user: User, uploadedFrom: String) = {
    val media = new UserMedia(new ObjectId, documentName, docDescription, userId, new Date, docURL, UserMediaType.Image, Access.PrivateToClass, false, Option(streamId), "", 0, Nil, Nil, 0)
    val mediaId = UserMedia.saveMediaForUser(media)
    //Create A Message As Well To Display The Doc Creation In Stream
    val profilePic = UserMedia.getProfilePicUrlString(userId)
    (uploadedFrom == "discussion") match {
      case true =>
        val message = Message(new ObjectId, docURL, Option(Type.Image), Option(Access.PrivateToClass), new Date, userId, Option(streamId), user.firstName, user.lastName, 0, Nil, Nil, 0, Nil, docURL, Option(mediaId.get))
        val messageId = Message.createMessage(message)
        DocResulttoSent(Option(message), None, documentName, docDescription, false, false, Option(profilePic), None, Option(false), User.giveMeTheRockers(message.rockers))
      case false =>
        val question = Question(new ObjectId, docURL, userId, Access.PrivateToClass, Type.Image, streamId, user.firstName, user.lastName, new Date, Nil, Nil, Nil, Nil, Nil, false, Option(docURL), Option(mediaId.get))
        Question.addQuestion(question)
        DocResulttoSent(None, Option(question), documentName, docDescription, false, false, Option(profilePic), None, Option(false), User.giveMeTheRockers(question.rockers))
    }

  }

  /**
   * Save Video
   */
  private def saveVideoFromMainStream(documentName: String, docDescription: String, userId: ObjectId, docURL: String, docAccess: String, streamId: ObjectId, user: User, docNameOnAmazon: String, uploadedFrom: String) = {
    val frameOfVideo = ExtractFrameFromVideoUtil.extractFrameFromVideo(docURL)
    //    (new AmazonUpload).uploadCompressedFileToAmazon(docNameOnAmazon + "Frame", frameOfVideo, 0, false, userId.toString)
    val isCompressedFileUploaded = (new AmazonUpload).uploadCompressedFileToAmazon(docNameOnAmazon + "Frame", frameOfVideo)
    if (isCompressedFileUploaded) {
      val videoFrameURL = "https://s3.amazonaws.com/BeamStream/" + docNameOnAmazon + "Frame"
      val media = UserMedia(new ObjectId, documentName, docDescription, userId, new Date, docURL, UserMediaType.Video, Access.PrivateToClass, false, Option(streamId), videoFrameURL, 0, Nil, Nil)
      val mediaId = UserMedia.saveMediaForUser(media)
      val profilePic = UserMedia.getProfilePicUrlString(userId)
      (uploadedFrom == "discussion") match {
        case true =>
          val message = Message(new ObjectId, docURL, Option(Type.Video), Option(Access.PrivateToClass), new Date, userId, Option(streamId), user.firstName, user.lastName, 0, Nil, Nil, 0, Nil, videoFrameURL, Option(mediaId.get))
          val messageId = Message.createMessage(message)
          DocResulttoSent(Option(message), None, documentName, docDescription, false, false, Option(profilePic), None, Option(false), User.giveMeTheRockers(message.rockers))
        case false =>
          val question = Question(new ObjectId, docURL, userId, Access.PrivateToClass, Type.Video, streamId, user.firstName, user.lastName, new Date, Nil, Nil, Nil, Nil, Nil, false, Option(videoFrameURL), Option(mediaId.get))
          Question.addQuestion(question)
          DocResulttoSent(None, Option(question), documentName, docDescription, false, false, Option(profilePic), None, Option(false), User.giveMeTheRockers(question.rockers))
      }
    } else { DocResulttoSent(None, None, "", "", false, false, None, None, Option(false), List()) }
  }

  /**
   * Save Pdf
   */
  private def savePdfFromMainStream(documentName: String, docDescription: String, userId: ObjectId, docURL: String, docAccess: String, streamId: ObjectId, user: User, docNameOnAmazon: String, previewImageUrl: String, uploadedFrom: String) = {
    val documentCreated = new Document(new ObjectId, documentName, docDescription, docURL, DocType.Other, userId, Access.PrivateToClass,
      streamId, new Date, new Date, 0, Nil, Nil, Nil, previewImageUrl)
    val documentId = Document.addDocument(documentCreated)
    val profilePic = UserMedia.getProfilePicUrlString(userId)
    (uploadedFrom == "discussion") match {
      case true =>
        val message = Message(new ObjectId, docURL, Option(Type.Document), Option(Access.PrivateToClass), new Date, userId, Option(streamId), user.firstName, user.lastName, 0, Nil, Nil, 0, Nil, previewImageUrl, Option(documentId))
        val messageId = Message.createMessage(message)
        DocResulttoSent(Option(message), None, documentName, docDescription, false, false, Option(profilePic), None, Option(false), User.giveMeTheRockers(message.rockers))
      case false =>
        val question = Question(new ObjectId, docURL, userId, Access.PrivateToClass, Type.Document, streamId, user.firstName, user.lastName, new Date, Nil, Nil, Nil, Nil, Nil, false, Option(previewImageUrl), Option(documentId))
        Question.addQuestion(question)
        DocResulttoSent(None, Option(question), documentName, docDescription, false, false, Option(profilePic), None, Option(false), User.giveMeTheRockers(question.rockers))
    }
  }
  /**
   * Save other documents
   */
  private def saveOtherDOcFromMainStream(documentName: String, docDescription: String, userId: ObjectId, docURL: String, docAccess: String, streamId: ObjectId, user: User, docNameOnAmazon: String, uploadedFrom: String) = {
    val documentCreated = new Document(new ObjectId, documentName, docDescription, docURL, DocType.Other, userId, Access.PrivateToClass,
      streamId, new Date, new Date, 0, Nil, Nil, Nil, "")
    val documentId = Document.addDocument(documentCreated)
    val profilePic = UserMedia.getProfilePicUrlString(userId)
    (uploadedFrom == "discussion") match {
      case true =>
        val message = Message(new ObjectId, docURL, Option(Type.Document), Option(Access.PrivateToClass), new Date, userId, Option(streamId), user.firstName, user.lastName, 0, Nil, Nil, 0, Nil, "", Option(documentId))
        val messageId = Message.createMessage(message)
        DocResulttoSent(Option(message), None, documentName, docDescription, false, false, Option(profilePic), None, Option(false), User.giveMeTheRockers(message.rockers))
      case false =>
        val question = Question(new ObjectId, docURL, userId, Access.PrivateToClass, Type.Document, streamId, user.firstName, user.lastName, new Date, Nil, Nil, Nil, Nil, Nil, false, None, Option(documentId))
        Question.addQuestion(question)
        DocResulttoSent(None, Option(question), documentName, docDescription, false, false, Option(profilePic), None, Option(false), User.giveMeTheRockers(question.rockers))
    }
  }

  /**
   * Get view count of a document
   */

  def viewCount(documentId: String): Action[AnyContent] = Action { implicit request =>
    val mediaFile = UserMedia.findMediaById(new ObjectId(documentId))
    val viewCount = (mediaFile != None) match {
      case true => UserMedia.increaseViewCountOfUsermedia(mediaFile.get.id)
      case false => Document.increaseViewCountOfADocument(new ObjectId(documentId))
    }
    Ok(write(viewCount.toString)).as("application/json")
  }
  
  def getGoogleDocURL(docId: String): Action[AnyContent] = Action { implicit request =>
    val googleDoc = Document.findDocumentById(new ObjectId(docId))
    googleDoc match{
      case None => Ok
      case Some(doc) => Ok(write(doc)).as("application/json")
    }																																																
  }

}

package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import play.api.mvc.Response
import models.Stream
import models.User
import org.bson.types.ObjectId
import play.api.cache.Cache
import models.Media
import com.mongodb.gridfs.GridFSDBFile
import models.UserType
import java.io.File
import play.api.libs.iteratee.Enumerator
import java.util.Date
import models.DocumentAccess
import models.DocType
import models.Message
import models.Document
import models.User
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import java.text.SimpleDateFormat
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import models.ResulttoSent
import play.api.libs.json._
import play.api.mvc.Action
import models.ProfileImageProviderCache
import utils.CompressFile
import models.UserMedia
import utils.tokenEmail
import utils.AmazonUpload
import models.Files
import utils.DocsUploadOnAmazon
import models.UserMediaType
import utils.ExtractFrameFromVideo
import models.MessageType
import models.MessageAccess
//import utils.PreviewOfPDF
import models.DocResulttoSent
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
    val documentJsonMap = request.body.asFormUrlEncoded.get
    (documentJsonMap.contains(("data"))) match {

      case false => Ok(write(new ResulttoSent("Failure", "Document data not found !!!")))

      case true =>

        try {

          val document = documentJsonMap("data").toList(0)
          val documentJson = net.liftweb.json.parse(document)
          val name = (documentJson \ "docName").extract[String]
          val url = (documentJson \ "docURL").extract[String]
          val access = (documentJson \ "docAccess").extract[String]
          val docType = (documentJson \ "docType").extract[String]
          val description = (documentJson \ "docDescription").extract[String]
          val userId = new ObjectId(request.session.get("userId").get)
          val streamId = (documentJson \ "streamId").extract[String]
          val date = new Date
          val documentToCreate = new Document(new ObjectId, name, description, url, DocType.withName(docType), userId, DocumentAccess.withName(access), new ObjectId(streamId), date, date, 0, List(), List(), List(), "")
          val docId = Document.addDocument(documentToCreate)
          val user = User.getUserProfile(userId)
          //Create A Message As Well To Display The Doc Creation In Stream
          val message = Message(new ObjectId, url, Option(MessageType.Document), Option(MessageAccess.withName(access)), date, userId, Option(new ObjectId(streamId)), user.firstName, user.lastName, 0, List(), List(), 0, List())
          Message.createMessage(message)
          val docObtained = Document.findDocumentById(docId)
          val docJson = write(List(docObtained))
          Ok(docJson).as("application/json")
        } catch {
          case ex => Ok(write(new ResulttoSent("Failure", "There Was Some Problem During Uploading Google Docs"))).as("application/json")
        }
    }
  }

  /**
   *  Get details of a document
   */

  def getDocument = Action { implicit request =>

    val documentIdJsonMap = request.body.asFormUrlEncoded.get

    (documentIdJsonMap.contains(("documentId"))) match {

      case false => Ok(write(new ResulttoSent("Failure", "No Document Available Having The Provided DocumentId !!!")))
      case true =>

        val documentId = documentIdJsonMap("documentId").toList(0)
        val docObtained = Document.findDocumentById(new ObjectId(documentId))
        val documentJSON = write(List(docObtained))
        Ok(documentJSON).as("application/json")
    }
  }

  /**
   * Get all Documents for a User (Modified)
   */

  def getAllGoogleDocumentsForAUser = Action { implicit request =>
    val allDocumentsForAUser = Document.getAllGoogleDocumentsForAUser(new ObjectId(request.session.get("userId").get))
    Ok(write(allDocumentsForAUser)).as("application/json")
  }

  /**
   * Rock the document (Modified)
   * Rocking any kind of Doc Audio, Video , PPT etc.
   */
  def rockTheDocument = Action { implicit request =>
    val documentIdJsonMap = request.body.asFormUrlEncoded.get
    val documentId = documentIdJsonMap("documentId").toList(0)
    val totalRocks = Document.rockedIt(new ObjectId(documentId), new ObjectId(request.session.get("userId").get))
    val totalRocksJson = write(totalRocks.toString)
    Ok(totalRocksJson).as("application/json")
  }

  /*
      * Change the title and description
      */
  def changeTitleAndDescriptionForADocument = Action { implicit request =>
    val documentIdJsonMap = request.body.asFormUrlEncoded.get
    val id = documentIdJsonMap("documentId").toList(0)
    val title = documentIdJsonMap("docName").toList(0)
    val description = documentIdJsonMap("docDescription").toList(0)
    Document.updateTitleAndDescription(new ObjectId(id), title, description)
    val docObtained = Document.findDocumentById(new ObjectId(id))
    val docJson = write(List(docObtained))
    Ok(docJson).as("application/json")
  }

  /*
    * Rockers of a document
    */
  def giveMeRockersOfDocument = Action { implicit request =>
    val documentIdJsonMap = request.body.asFormUrlEncoded.get
    val id = documentIdJsonMap("documentId").toList(0)
    val rockers = Document.rockersNames(new ObjectId(id))
    val rockersJson = write(rockers)
    Ok(rockersJson).as("application/json")
  }

  /**
   * Upload Media From HardDrive
   */
//
//  def getDocumentFromDisk = Action(parse.multipartFormData) { request =>
//
//    var resultToSend: Option[DocResulttoSent] = None
//    val documentJsonMap = request.body.asFormUrlEncoded.toMap
//    val streamId = documentJsonMap("streamId").toList(0)
//    val docDescription = documentJsonMap("docDescription").toList(0)
//    (request.body.file("docData").isEmpty) match {
//
//      case true => // No Docs Found
//      case false =>
//        // Fetch the image stream and details
//        request.body.file("docData").map { docData =>
//          val documentName = docData.filename
//          val contentType = docData.contentType.get
//          val isImage = contentType.contains("image")
//          val isVideo = contentType.contains("video")
//          val isPdf = contentType.contains("pdf")
//          val docAccess = documentJsonMap("docAccess").toList(0)
//          val uniqueString = tokenEmail.securityToken
//          val documentReceived: File = docData.ref.file.asInstanceOf[File]
//          val docUniqueKey = tokenEmail.securityToken
//          val docNameOnAmazom = (docUniqueKey + documentName).replaceAll("\\s", "")
//          DocsUploadOnAmazon.uploadFileToAmazon(docNameOnAmazom, documentReceived)
//          val docURL = "https://s3.amazonaws.com/BeamStream/" + docNameOnAmazom
//          val userId = new ObjectId(request.session.get("userId").get)
//          val user = User.getUserProfile(userId)
//
//          if (isImage == true) {
//            val uploadResults = saveImageFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user)
//            resultToSend = Option(uploadResults)
//          } else if (isVideo == true) {
//            val uploadResults = saveVideoFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user, docNameOnAmazom)
//            resultToSend = Option(uploadResults)
//          } else {
//            if (isPdf == true) {
//              val previewImageUrl = PreviewOfPDF.convertPdfToImage(documentReceived, docNameOnAmazom)
//              val uploadResults = savePdfFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user, docNameOnAmazom, previewImageUrl)
//              resultToSend = Option(uploadResults)
//            } else {
//              val uploadResults = saveOtherDOcFromMainStream(documentName, docDescription, userId, docURL, docAccess, new ObjectId(streamId), user, docNameOnAmazom)
//              resultToSend = Option(uploadResults)
//            }
//          }
//        }.get
//    }
//    Ok(write(resultToSend)).as("application/json")
//  }

  //---------------------------//
  // File Section Starts Here //
  //-------------------------//

  /**
   * Get All AudioFiles
   */

  def getAllAudioFilesForAUser = Action { implicit request =>
    val audioFiles = Files.getAllAudioFiles(new ObjectId(request.session.get("userId").get))
    Ok(write(audioFiles)).as("application/json")
  }

  /**
   * Get All PPTFiles
   */

  def getAllPPTFilesForAUser = Action { implicit request =>
    val PPTFiles = Files.getAllPPTFiles(new ObjectId(request.session.get("userId").get))
    Ok(write(PPTFiles)).as("application/json")
  }

  /**
   * Get All PPTFiles
   */

  def getAllPDFFilesForAUser = Action { implicit request =>
    val PDFFiles = Files.getAllPDFFiles(new ObjectId(request.session.get("userId").get))
    Ok(write(PDFFiles)).as("application/json")
  }

  /**
   * Get All DOCSFiles
   */

  def getAllDOCSFilesForAUser = Action { implicit request =>
    val DocsFiles = Files.getAllDOCSFiles(new ObjectId(request.session.get("userId").get))
    Ok(write(DocsFiles)).as("application/json")
  }

  /**
   * Follow Document
   */

  def followDocument = Action { implicit request =>
    val docIdToFollowJsonMap = request.body.asFormUrlEncoded.get
    val documentId = docIdToFollowJsonMap("documentId").toList(0)
    val followers = Document.followDocument(new ObjectId(request.session.get("userId").get), new ObjectId(documentId))
    Ok(write(followers.toString)).as("application/json")
  }

//  /**
//   * Save Image
//   */
//  private def saveImageFromMainStream(documentName: String, docDescription: String, userId: ObjectId, docURL: String, docAccess: String, streamId: ObjectId, user: User) = {
//    val media = new UserMedia(new ObjectId, documentName, docDescription, userId, new Date, docURL, UserMediaType.Image, DocumentAccess.withName(docAccess), false, "", 0, List(), List())
//    val mediaId = UserMedia.saveMediaForUser(media)
//    //Create A Message As Well To Display The Doc Creation In Stream
//    val message = Message(new ObjectId, docURL, Option(MessageType.Image), Option(MessageAccess.withName(docAccess)), new Date, userId, Option(streamId), user.firstName, user.lastName, 0, List(), List(), 0, List(), Option(docURL), Option(mediaId.get))
//    Message.createMessage(message)
//    new DocResulttoSent(message, documentName, docDescription)
//  }
//
//  /**
//   * Save Video
//   */
//  private def saveVideoFromMainStream(documentName: String, docDescription: String, userId: ObjectId, docURL: String, docAccess: String, streamId: ObjectId, user: User, docNameOnAmazon: String) = {
//    val frameOfVideo = ExtractFrameFromVideo.extractFrameFromVideo(docURL)
//    (new AmazonUpload).uploadCompressedFileToAmazon(docNameOnAmazon + "Frame", frameOfVideo, 0, false, userId.toString)
//    val videoFrameURL = "https://s3.amazonaws.com/BeamStream/" + docNameOnAmazon + "Frame"
//    val media = new UserMedia(new ObjectId, documentName, docDescription, userId, new Date, docURL, UserMediaType.Video, DocumentAccess.withName(docAccess), false, videoFrameURL, 0, List(), List())
//    val mediaId = UserMedia.saveMediaForUser(media)
//    val message = Message(new ObjectId, docURL, Option(MessageType.Video), Option(MessageAccess.withName(docAccess)), new Date, userId, Option(streamId), user.firstName, user.lastName, 0, List(), List(), 0, List(), Option(videoFrameURL), Option(mediaId.get))
//    Message.createMessage(message)
//    new DocResulttoSent(message, documentName, docDescription)
//  }

  /**
   * Save Pdf
   */
  private def savePdfFromMainStream(documentName: String, docDescription: String, userId: ObjectId, docURL: String, docAccess: String, streamId: ObjectId, user: User, docNameOnAmazon: String, previewImageUrl: String) = {
    val documentCreated = new Document(new ObjectId, documentName, docDescription, docURL, DocType.Other, userId, DocumentAccess.withName(docAccess),
      streamId, new Date, new Date, 0, List(), List(), List(), previewImageUrl)
    val documentId = Document.addDocument(documentCreated)
    val message = Message(new ObjectId, docURL, Option(MessageType.Document), Option(MessageAccess.withName(docAccess)), new Date, userId, Option(streamId), user.firstName, user.lastName, 0, List(), List(), 0, List(), Option(previewImageUrl), Option(documentId))
    Message.createMessage(message)
    new DocResulttoSent(message, documentName, docDescription)
  }
  /**
   * Save other documents
   */
  private def saveOtherDOcFromMainStream(documentName: String, docDescription: String, userId: ObjectId, docURL: String, docAccess: String, streamId: ObjectId, user: User, docNameOnAmazon: String) = {
    val documentCreated = new Document(new ObjectId, documentName, docDescription, docURL, DocType.Other, userId, DocumentAccess.withName(docAccess),
      streamId, new Date, new Date, 0, List(), List(), List(), "")
    val documentId = Document.addDocument(documentCreated)
    val message = Message(new ObjectId, docURL, Option(MessageType.Document), Option(MessageAccess.withName(docAccess)), new Date, userId, Option(streamId), user.firstName, user.lastName, 0, List(), List(), 0, List(), None, Option(documentId))
    Message.createMessage(message)
    new DocResulttoSent(message, documentName, docDescription)
  }

  /**
   * Get view count of a document
   */

  def viewCount = Action { implicit request =>
    val documentDetailsJsonMap = request.body.asFormUrlEncoded.get
    val docId = documentDetailsJsonMap("docId").toList(0)
    val mediaFile = UserMedia.findMediaById(new ObjectId(docId))
    if (mediaFile != None) {
      UserMedia.increaseViewCountOfUsermedia(mediaFile.get.id)
    } else Document.increaseViewCountOfADocument(new ObjectId(docId))
    Ok
  }
}


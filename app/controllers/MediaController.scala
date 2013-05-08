package controllers

import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import org.bson.types.ObjectId
import models.DocumentAccess
import models.ResulttoSent
import models.UserMedia
import models.UserMediaType
import net.liftweb.json.Serialization.write
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.AmazonUpload
import utils.ObjectIdSerializer
import utils.tokenEmailUtil
import utils.ExtractFrameFromVideoUtil
import models.ResulttoSent
import models.UserMediaDAO
import models.Document
import models.MediaResults
import models.Files

object MediaController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /**
   *  Upload File To Server and Then to Amazon
   *
   *
   * def getMedia = Action(parse.multipartFormData) { request =>
   * //        ProgressBar.setFlag(true)
   * //        ProgressBar.setProgressBar(request.session.get("userId").get, 0)
   * ProgressStatus.addProgress(request.session.get("userId").get, 0)
   * val mediaJsonMap = request.body.asFormUrlEncoded.toMap
   * val imageStatus = true //mediaJsonMap("imageStatus").toList.head.toBoolean
   * val videoStatus = false //mediaJsonMap("videoStatus").toList.head.toBoolean
   * var imageNameOnAmazon = ""
   * var videoFileNameOnnAmazon = ""
   * var imageNameToStore = ""
   * var videoNameToStore = ""
   *
   * var imageFileInputStream: InputStream = null
   * var videoFileObtained: File = null
   * var totalFileSize: Double = 0
   *
   * (request.body.file("imageData").isEmpty) match {
   *
   * case true => // No Image Found
   * case false =>
   * // Fetch the image stream and details
   * request.body.file("imageData").map { imageData =>
   * // val imageAuthenticationToken = tokenEmail.securityToken
   * val imageFilename = imageData.filename
   * val contentType = imageData.contentType.get
   * val uniqueString = tokenEmail.securityToken
   * val imageFileObtained: File = imageData.ref.file.asInstanceOf[File]
   * imageNameOnAmazon = uniqueString + imageFilename.replaceAll("\\s", "") // Security Over the images files
   * imageNameToStore = imageFilename
   * imageFileInputStream = CompressFile.compressImage(imageFileObtained, imageNameOnAmazon, 0.1f)
   * totalFileSize += imageFileInputStream.available //calculate total number of bytes transfered
   * }.get
   * }
   *
   * (request.body.file("videoData").isEmpty) match {
   * case true => // No Video Found
   * case false =>
   * // Fetch the video stream and details
   * request.body.file("videoData").map { videoData =>
   * // val videoAuthenticationToken = tokenEmail.securityToken
   * val videoFilename = videoData.filename
   * val contentType = videoData.contentType.get
   * val uniqueString = tokenEmail.securityToken
   * videoFileObtained = videoData.ref.file.asInstanceOf[File]
   * videoFileNameOnnAmazon = uniqueString + videoFilename.replaceAll("\\s", "")
   * videoNameToStore = videoFilename
   * totalFileSize += videoFileObtained.length ////calculate total number of bytes transfered
   * }.get
   * }
   *
   * if (imageFileInputStream != null) {
   * (new AmazonUpload).uploadCompressedFileToAmazon(imageNameOnAmazon, imageFileInputStream, totalFileSize, true, request.session.get("userId").get)
   * val imageURL = "https://s3.amazonaws.com/BeamStream/" + imageNameOnAmazon
   * val media = new UserMedia(new ObjectId, imageNameToStore, "", new ObjectId(request.session.get("userId").get), new Date, imageURL, UserMediaType.Image, DocumentAccess.Public, imageStatus, "", 0, List(), List())
   * UserMedia.saveMediaForUser(media)
   * ProfileImageProviderCache.setImage(media.userId.toString, media.mediaUrl)
   * }
   *
   * if (videoFileObtained != null) {
   * (new AmazonUpload).uploadFileToAmazon(videoFileNameOnnAmazon, videoFileObtained, totalFileSize, request.session.get("userId").get)
   * val videoURL = "https://s3.amazonaws.com/BeamStream/" + videoFileNameOnnAmazon
   * val frameOfVideo = ExtractFrameFromVideo.extractFrameFromVideo(videoURL)
   * (new AmazonUpload).uploadCompressedFileToAmazon(videoFileNameOnnAmazon + "Frame", frameOfVideo, totalFileSize, false, request.session.get("userId").get)
   * val videoFrameURL = "https://s3.amazonaws.com/BeamStream/" + videoFileNameOnnAmazon + "Frame"
   * val media = new UserMedia(new ObjectId, videoNameToStore, "", new ObjectId(request.session.get("userId").get), new Date, videoURL, UserMediaType.Video, DocumentAccess.Public, videoStatus, videoFrameURL, 0, List(), List())
   * UserMedia.saveMediaForUser(media)
   *
   * }
   * Ok(write(new ResulttoSent("Success", "Profile Photo Uploaded Successfully"))).as("application/json")
   *
   * }
   *
   */
  /**
   *
   * def returnProgress = Action { implicit request =>
   * val userId = request.session.get("userId").get
   * Ok(write(ProgressStatus.findProgress(request.session.get("userId").get).toString)).as("application/json")
   * // Ok(write( ProgressBar.progressMap(request.session.get("userId").get).toString)).as("application/json")
   * }
   *
   *
   * def returnFlag = Action { implicit request =>
   * val flag = ProgressBar.flag
   * Ok(write(flag.toString)).as("application/json")
   * // Ok(write( ProgressBar.progressMap(request.session.get("userId").get).toString)).as("application/json")
   * }
   */

  /**
   * Get All Photos for a user
   *
   */
  def getAllProfilePicForAUser = Action { implicit request =>
    val allProfileMediaForAUser = UserMedia.getAllProfilePicForAUser(new ObjectId(request.session.get("userId").get))
    Ok(write(allProfileMediaForAUser)).as("application/json")
  }

  /**
   * Get All Video for a user for a user
   * @Purpose : Show all Video For A User
   */
  def getAllProfileVideoForAUser = Action { implicit request =>
    val allProfileMediaForAUser = UserMedia.getAllProfileVideoForAUser(new ObjectId(request.session.get("userId").get))
    Ok(write(allProfileMediaForAUser)).as("application/json")
  }

  /**
   * Rock the UserMedia (Modified)
   *
   */
  def rockTheUsermedia(mediaId: String) = Action { implicit request =>
    val totalRocks = UserMedia.rockUserMedia(new ObjectId(mediaId), new ObjectId(request.session.get("userId").get))
    val totalRocksJson = write(totalRocks.toString)
    Ok(totalRocksJson).as("application/json")
  }

  /**
   * Rockers of a document
   */
  def giveMeRockersOfUserMedia(mediaId: String) = Action { implicit request =>
    val rockers = UserMedia.rockersNamesOfUserMedia(new ObjectId(mediaId))
    val rockersJson = write(rockers)
    Ok(rockersJson).as("application/json")
  }
  //TODO : To be removed. In Rearchitecture this functionality has been combined with DocumentController
  /**
   * Change the title and description
   */
  def changeTitleAndDescriptionUserMedia(mediaId: String, name: String, description: String) = Action { implicit request =>
    UserMedia.updateTitleAndDescription(new ObjectId(mediaId), name, description)
    val mediaObtained = UserMedia.findMediaById(new ObjectId(mediaId))
    val mediaJson = write(List(mediaObtained.get))
    Ok(mediaJson).as("application/json")
  }

  /**
   *  Get User Media
   */

  def getUserMedia = Action { implicit request =>
    val mediaIdJsonMap = request.body.asFormUrlEncoded.get
    (mediaIdJsonMap.contains(("userMediaId"))) match {
      case false => Ok(write(new ResulttoSent("Failure", "No Media Found")))
      case true =>
        val userMediaId = mediaIdJsonMap("userMediaId").toList(0)
        val mediaFound = UserMedia.findMediaById(new ObjectId(userMediaId))
        val mediaJson = write(List(mediaFound.get))
        Ok(mediaJson).as("application/json")
    }
  }

  /**
   * ***********************************************************REARCHITECTED CODE****************************************************************
   */

  def uploadMediaToAmazon = Action(parse.multipartFormData) { implicit request =>

    val media = request.body.file("profileData").map { profileData =>
      val Filename = profileData.filename
      val contentType = profileData.contentType.get
      val uniqueString = tokenEmailUtil.securityToken
      val FileObtained: File = profileData.ref.file.asInstanceOf[File]
      val fileNameOnAmazon = uniqueString + Filename.replaceAll("\\s", "") // Security Over the images files
      (new AmazonUpload).uploadFileToAmazon(fileNameOnAmazon, FileObtained)

      (contentType.contains("image")) match {
        case true =>
          val imageURL = "https://s3.amazonaws.com/BeamStream/" + fileNameOnAmazon

          UserMedia(new ObjectId, Filename, "", new ObjectId(request.session.get("userId").get), new Date, imageURL, UserMediaType.Image, DocumentAccess.Public, true, None, "", 0, List(), List(), 0)

        case false =>
          val videoURL = "https://s3.amazonaws.com/BeamStream/" + fileNameOnAmazon
          val frameOfVideo = ExtractFrameFromVideoUtil.extractFrameFromVideo(videoURL)
          (new AmazonUpload).uploadCompressedFileToAmazon(fileNameOnAmazon + "Frame", frameOfVideo)
          val frameURL = "https://s3.amazonaws.com/BeamStream/" + fileNameOnAmazon + "Frame"

          val imageURL = "https://s3.amazonaws.com/BeamStream/" + fileNameOnAmazon

          UserMedia(new ObjectId, Filename, "", new ObjectId(request.session.get("userId").get), new Date, imageURL, UserMediaType.Image, DocumentAccess.Public, true, None, frameURL, 0, List(), List(), 0)

      }

    }.get

    UserMedia.saveMediaForUser(media)
    Ok(write(media)).as("application/json")

  }

  /**
   * obtaining the profile Picture
   * @ Purpose: fetches the recent profile picture for a user
   */

  def getProfilePicForAUser(userId: String) = Action { implicit request =>
    val mediaObtained = UserMedia.getProfilePicForAUser(new ObjectId(userId))
    if (!mediaObtained.size.equals(0)) {
      val MediaJson = write(mediaObtained.last)
      Ok(MediaJson).as("application/json")
    } else {
      Ok(write(ResulttoSent("Failure", "No picture found for this user")))
    }
  }

  /**
   * Render Browse Media Page
   */
  def browseMedia = Action { implicit request =>
    Ok(views.html.browsemedia())
  }

  /**
   * Get Recent Media
   */
  def getRecentMediaAndDocs = Action { implicit request =>
    val recentImage = UserMedia.recentProfilePicForAUser(new ObjectId(request.session.get("userId").get))
    val recentVideo = UserMedia.recentProfileVideoForAUser(new ObjectId(request.session.get("userId").get))

    val recentDoc = Document.recentDocForAUser(new ObjectId(request.session.get("userId").get))
    val recentGoogleDoc = Document.recentGoogleDocsForAUser(new ObjectId(request.session.get("userId").get))

    val recentPPTs = Files.getAllPPTFiles(new ObjectId(request.session.get("userId").get))
    val recentPPT = (recentPPTs.isEmpty == false) match {
      case true => Option(recentPPTs.head)
      case false => None
    }

    val recentPDFs = Files.getAllPDFFiles(new ObjectId(request.session.get("userId").get))
    val recentPDF = (recentPDFs.isEmpty == false) match {
      case true => Option(recentPDFs.head)
      case false => None
    }

    val recentAudios = Files.getAllAudioFiles(new ObjectId(request.session.get("userId").get))
    val recentAudio = (recentAudios.isEmpty == false) match {
      case true => Option(recentAudios.head)
      case false => None
    }

    Ok(write(MediaResults(recentImage, recentVideo, recentDoc, recentGoogleDoc, recentAudio, recentPDF, recentPPT))).as("application/json")
  }

}
package controllers
import java.io.File
import java.io.InputStream
import org.bson.types.ObjectId
import models.ProfileImageProviderCache
import models.ResulttoSent
import models.UserMedia
import models.UserMediaType
import net.liftweb.json.Serialization.read
import net.liftweb.json.Serialization.write
import net.liftweb.json.DefaultFormats
import net.liftweb.json.parse
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.AmazonUpload
import utils.CompressFile
import utils.ExtractFrameFromVideo
import utils.ObjectIdSerializer
import utils.ProgressBar
import utils.tokenEmail
import utils.ProgressStatus
import java.util.Date
import java.text.SimpleDateFormat
import models.Message

object MediaController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer
  
/**   
 //Original Method
  def getMedia = Action(parse.multipartFormData) { request =>

    val mediaJsonMap = request.body.asFormUrlEncoded.toMap
    val imageStatus = mediaJsonMap("imageStatus").toList(0).toBoolean
    val videoStatus = mediaJsonMap("videoStatus").toList(0).toBoolean

    (request.body.file("imageData").isEmpty) match {

      case true => // No Image Found
      case false =>
        // Fetch the image stream and details
        request.body.file("imageData").map { imageData =>
          val imageAuthenticationToken = tokenEmail.securityToken
          val imageFilename = imageData.filename
          val contentType = imageData.contentType.get
          val uniqueString = tokenEmail.securityToken
          val imageFileObtained: File = imageData.ref.file.asInstanceOf[File]
          val imageNameOnAmazon = uniqueString + imageFilename.replaceAll("\\s", "") // Security Over the images files
          val imageFileInputStream = CompressFile.compressImage(imageFileObtained, imageNameOnAmazon, 0.1f)
          //AmazonUpload.uploadFileToAmazon(imageNameOnAmazon, imageFileObtained)
          AmazonUpload.uploadCompressedFileToAmazon(imageNameOnAmazon, imageFileInputStream)
          val imageURL = "https://s3.amazonaws.com/BeamStream/" + imageNameOnAmazon
          val media = new UserMedia(new ObjectId, new ObjectId(request.session.get("userId").get), imageURL, UserMediaType.Image, imageStatus, "",0,List())
          UserMedia.saveMediaForUser(media)
          ProfileImageProviderCache.setImage(media.userId.toString, media.mediaUrl)
          // For MongoDB
          /*
      val profileImage: File = imageData.ref.file.asInstanceOf[File]
      val profileImageInputStream = new FileInputStream(profileImage)
      new mediaComposite(imageFilename, contentType.get, profileImageInputStream)
      */
        }.get

    }

    (request.body.file("videoData").isEmpty) match {
      case true => // No Video Found
      case false =>
        // Fetch the video stream and details
        request.body.file("videoData").map { videoData =>
          val videoAuthenticationToken = tokenEmail.securityToken
          val videoFilename = videoData.filename
          val contentType = videoData.contentType.get
          val uniqueString = tokenEmail.securityToken
          val videoFileObtained: File = videoData.ref.file.asInstanceOf[File]
          val videoFileNameOnnAmazon = uniqueString + videoFilename.replaceAll("\\s", "") // Security Over the videos files
          println(videoFileNameOnnAmazon)
          AmazonUpload.uploadFileToAmazon(videoFileNameOnnAmazon, videoFileObtained)
          val videoURL = "https://s3.amazonaws.com/BeamStream/" + videoFileNameOnnAmazon

          val frameOfVideo = ExtractFrameFromVideo.extractFrameFromVideo(videoURL)
          AmazonUpload.uploadCompressedFileToAmazon(videoFileNameOnnAmazon + "Frame", frameOfVideo)
          val videoFrameURL = "https://s3.amazonaws.com/BeamStream/" + videoFileNameOnnAmazon + "Frame"

          val media = new UserMedia(new ObjectId, new ObjectId(request.session.get("userId").get), videoURL, UserMediaType.Video, videoStatus, videoFrameURL,0,List())
          UserMedia.saveMediaForUser(media)
          /*
      val profileVideo: File = videoData.ref.file.asInstanceOf[File]
      val profileVideoInputStream = new FileInputStream(profileVideo)
      new mediaComposite(videoFilename, contentType.get, profileVideoInputStream)
    */
        }.get
    }

    /*
    val mediaTransfrerObject = new MediaTransfer(new ObjectId(request.session.get("userId").get), MediaType.Image, true,
    imageComposite.inputStream, imageComposite.name, videoComposite.inputStream, videoComposite.name, mobileNo, uploadType)
    Profile.createMedia(mediaTransfrerObject)
    */

    Ok(write(new ResulttoSent("Success", "Profile Photo Uploaded Successfully"))).as("application/json")
  }

* 
 */
  
 //-------------------------//
 
  def getMedia = Action(parse.multipartFormData) { request =>
    ProgressBar.setProgressBar(request.session.get("userId").get, 0)
    //ProgressStatus.addProgress(request.session.get("userId").get,0)
    val mediaJsonMap = request.body.asFormUrlEncoded.toMap
    val imageStatus = mediaJsonMap("imageStatus").toList(0).toBoolean
    val videoStatus = mediaJsonMap("videoStatus").toList(0).toBoolean
    var imageNameOnAmazon = ""
    var videoFileNameOnnAmazon = ""
    var imageNameToStore=""
    var videoNameToStore=""
       
    var imageFileInputStream: InputStream = null
    var videoFileObtained: File = null
    var totalFileSize: Double = 0

    (request.body.file("imageData").isEmpty) match {

      case true => // No Image Found
      case false =>
        // Fetch the image stream and details
        request.body.file("imageData").map { imageData =>
          val imageAuthenticationToken = tokenEmail.securityToken
          val imageFilename = imageData.filename
          val contentType = imageData.contentType.get
          val uniqueString = tokenEmail.securityToken
          val imageFileObtained: File = imageData.ref.file.asInstanceOf[File]
          imageNameOnAmazon = uniqueString + imageFilename.replaceAll("\\s", "") // Security Over the images files
          imageNameToStore=imageFilename
          imageFileInputStream = CompressFile.compressImage(imageFileObtained, imageNameOnAmazon, 0.1f)
          totalFileSize += imageFileInputStream.available  //calculate total number of bytes transfered
        }.get
    }

    (request.body.file("videoData").isEmpty) match {
      case true => // No Video Found
      case false =>
        // Fetch the video stream and details
        request.body.file("videoData").map { videoData =>
          val videoAuthenticationToken = tokenEmail.securityToken
          val videoFilename = videoData.filename
          val contentType = videoData.contentType.get
          val uniqueString = tokenEmail.securityToken
          videoFileObtained = videoData.ref.file.asInstanceOf[File]
          videoFileNameOnnAmazon = uniqueString + videoFilename.replaceAll("\\s", "")
          videoNameToStore=videoFilename
          totalFileSize += videoFileObtained.length ////calculate total number of bytes transfered
        }.get
    }

    if (imageFileInputStream != null) {
      (new AmazonUpload).uploadCompressedFileToAmazon(imageNameOnAmazon, imageFileInputStream,totalFileSize,true,request.session.get("userId").get)
      val imageURL = "https://s3.amazonaws.com/BeamStream/" + imageNameOnAmazon
      val media = new UserMedia(new ObjectId,imageNameToStore,"", new ObjectId(request.session.get("userId").get),new Date, imageURL, UserMediaType.Image, imageStatus, "",0,List())
      UserMedia.saveMediaForUser(media)
      ProfileImageProviderCache.setImage(media.userId.toString, media.mediaUrl)
    }

    if (videoFileObtained != null) {
      (new AmazonUpload).uploadFileToAmazon(videoFileNameOnnAmazon, videoFileObtained,totalFileSize,request.session.get("userId").get)
      val videoURL = "https://s3.amazonaws.com/BeamStream/" + videoFileNameOnnAmazon
      val frameOfVideo = ExtractFrameFromVideo.extractFrameFromVideo(videoURL)
      (new AmazonUpload).uploadCompressedFileToAmazon(videoFileNameOnnAmazon + "Frame", frameOfVideo,totalFileSize,false,request.session.get("userId").get)
      val videoFrameURL = "https://s3.amazonaws.com/BeamStream/" + videoFileNameOnnAmazon + "Frame"
      val media = new UserMedia(new ObjectId,videoNameToStore,"",new ObjectId(request.session.get("userId").get), new Date,videoURL, UserMediaType.Video, videoStatus, videoFrameURL,0,List())
      UserMedia.saveMediaForUser(media)

    }
    Ok(write(new ResulttoSent("Success", "Profile Photo Uploaded Successfully"))).as("application/json")
  }

 def returnProgress = Action { implicit request =>
    val userId=request.session.get("userId").get
    Ok(write( ProgressStatus.findProgress(request.session.get("userId").get).toString)).as("application/json")
    // Ok(write( ProgressBar.progressMap(request.session.get("userId").get).toString)).as("application/json")
  }
  
  //-----------------------//
  /*
   * obtaining the profile Picture
   * @ Purpose: fetches the recent profile picture for a user
   */

  def getProfilePicForAUser = Action { implicit request =>
    val userIdJsonMap = request.body.asFormUrlEncoded.get
    val userIdReceived = userIdJsonMap("userId").toList(0)
    val mediaObtained = UserMedia.getProfilePicForAUser(new ObjectId(userIdReceived))
    if (!mediaObtained.size.equals(0)) {
      val MediaJson = write(mediaObtained.last)
      Ok(MediaJson).as("application/json")
    } else {
      Ok(write(new ResulttoSent("Failure", "No picture found for this user")))
    }

  }

  /*
   * Get All Photos for a user
   */
  def getAllProfilePicForAUser = Action { implicit request =>
    val allProfileMediaForAUser = UserMedia.getAllProfilePicForAUser(new ObjectId(request.session.get("userId").get))
    Ok(write(allProfileMediaForAUser)).as("application/json")
  }

  /*
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
  def rockTheUsermedia = Action { implicit request =>
    val userMediaIdJsonMap = request.body.asFormUrlEncoded.get
    val userMediaId = userMediaIdJsonMap("userMediaId").toList(0)
    val totalRocks = UserMedia.rockUserMedia(new ObjectId(userMediaId), new ObjectId(request.session.get("userId").get))
    val totalRocksJson = write(totalRocks.toString)
    Ok(totalRocksJson).as("application/json")
  }
  
  /*
    * Rockers of a document
    */
  def giveMeRockersOfUserMedia = Action { implicit request =>
     val userMediaIdJsonMap = request.body.asFormUrlEncoded.get
    val userMediaId = userMediaIdJsonMap("userMediaId").toList(0)
    val rockers = UserMedia.rockersNamesOfUserMedia(new ObjectId(userMediaId))
    val rockersJson = write(rockers)
    Ok(rockersJson).as("application/json")
  }
  
   /*
      * Change the title and description
      */
  def changeTitleAndDescriptionUserMedia = Action { implicit request =>
    val mediaIdJsonMap = request.body.asFormUrlEncoded.get
    val id = mediaIdJsonMap("userMediaId").toList(0)
    val title = mediaIdJsonMap("mediaName").toList(0)
    val description = mediaIdJsonMap("mediaDescription").toList(0)
    UserMedia.updateTitleAndDescription(new ObjectId(id), title, description)
    val mediaObtained = UserMedia.findMediaById(new ObjectId(id))
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


}
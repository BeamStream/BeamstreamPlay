package controllers
import play.api.mvc.Controller
import play.api.mvc.Action
import java.io.FileInputStream
import java.io.File
import com.mongodb.casbah.gridfs.GridFS
import utils.MongoHQConfig
import java.io.FileOutputStream
import models.MediaTransfer
import models.MediaType
import org.bson.types.ObjectId
import java.io.InputStream
import models.mediaComposite
import models.Profile
import models.ProfileMedia
import utils.tokenEmail
import models.ResulttoSent
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import utils.AmazonUpload
import utils.ObjectIdSerializer
import models.ProfileMediaType
object MediaController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
  } + new ObjectIdSerializer

  def getMedia = Action(parse.multipartFormData) { request =>

    (request.body.file("imageData").isEmpty) match {

      case true => println("No Image Found")
      case false =>
        println("Found an image")
        // Fetch the image stream and details
        request.body.file("imageData").map { imageData =>
          val imageAuthenticationToken = tokenEmail.securityToken
          val imageFilename = imageData.filename
          val contentType = imageData.contentType.get
          val uniqueString = tokenEmail.securityToken
          val imageFileObtained: File = imageData.ref.file.asInstanceOf[File]
          val imageNameOnAmazon = uniqueString + imageFilename // Security Over the images files
          AmazonUpload.uploadFileToAmazon(imageNameOnAmazon, imageFileObtained)
          val imageURL = "https://s3.amazonaws.com/Beamstream/" + imageNameOnAmazon
          val media = new ProfileMedia(new ObjectId, new ObjectId(request.session.get("userId").get), imageURL, ProfileMediaType.Image, true)
          ProfileMedia.saveMediaForUser(media)
          // For MongoDB
          /*
      val profileImage: File = imageData.ref.file.asInstanceOf[File]
      val profileImageInputStream = new FileInputStream(profileImage)
      new mediaComposite(imageFilename, contentType.get, profileImageInputStream)
      */
        }.get

    }

    (request.body.file("videoData").isEmpty) match {
      case true => println("No Video Found")
      case false =>
        println("Found an video")
        // Fetch the video stream and details
        request.body.file("videoData").map { videoData =>
          val videoAuthenticationToken = tokenEmail.securityToken
          val videoFilename = videoData.filename
          val contentType = videoData.contentType.get
          val uniqueString = tokenEmail.securityToken
          val videoFileObtained: File = videoData.ref.file.asInstanceOf[File]
          val videoFileNameOnnAmazon = uniqueString + videoFilename // Security Over the videos files
          AmazonUpload.uploadFileToAmazon(videoFileNameOnnAmazon, videoFileObtained)
          val videoURL = "https://s3.amazonaws.com/Beamstream/" + videoFileNameOnnAmazon
          val media = new ProfileMedia(new ObjectId, new ObjectId(request.session.get("userId").get), videoURL, ProfileMediaType.Video, true)
          ProfileMedia.saveMediaForUser(media)
          /*
      val profileVideo: File = videoData.ref.file.asInstanceOf[File]
      val profileVideoInputStream = new FileInputStream(profileVideo)
      new mediaComposite(videoFilename, contentType.get, profileVideoInputStream)
    */
        }.get
    }

    val mediaJsonMap = request.body.asFormUrlEncoded.toList
    val uploadType = mediaJsonMap(0)._2.toList(0)
    val mobileNo = mediaJsonMap(1)._2.toList(0)

   
    /*
    val mediaTransfrerObject = new MediaTransfer(new ObjectId(request.session.get("userId").get), MediaType.Image, true,
    imageComposite.inputStream, imageComposite.name, videoComposite.inputStream, videoComposite.name, mobileNo, uploadType)
    Profile.createMedia(mediaTransfrerObject)
    */

    Ok(write(new ResulttoSent("Success", "Profile Photo Uploaded Successfully"))).as("application/json")
  }

  
  /*
   * Get All Photos for a user
   */
    def getAllProfilePicForAUser = Action { implicit request =>
      val allProfileMediaForAUser = ProfileMedia.getAllProfilePicForAUser(new ObjectId(request.session.get("userId").get))
      Ok(write(allProfileMediaForAUser)).as("application/json")
    }
}
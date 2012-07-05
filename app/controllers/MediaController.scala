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

object MediaController extends Controller {
  
  var imageURL:String=""
  var videoURL:String=""

  def getMedia = Action(parse.multipartFormData) { request =>

    // Fetch the image stream and details
    val imageComposite = request.body.file("imageData").map { imageData =>
      val imageAuthenticationToken=tokenEmail.securityToken
      val imageFilename = imageData.filename
      val contentType = imageData.contentType
      val imageNameWithToken = imageAuthenticationToken+ imageFilename
      imageData.ref.moveTo(new File("./public/CDNFolder/" +imageNameWithToken ))
      imageURL=URLExternalizer.MediaLocationURL+"profilePic/"+imageNameWithToken
      
      // For MongoDB
      /*
      val profileImage: File = imageData.ref.file.asInstanceOf[File]
      val profileImageInputStream = new FileInputStream(profileImage)
      new mediaComposite(imageFilename, contentType.get, profileImageInputStream)
      */
    }.get

    // Fetch the video stream and details
    val videoComposite = request.body.file("videoData").map { videoData =>
       val videoAuthenticationToken=tokenEmail.securityToken
      val videoFilename = videoData.filename
      val contentType = videoData.contentType
      val videoNameWithToken=videoAuthenticationToken+ videoFilename
      videoData.ref.moveTo(new File("./public/CDNFolder/" +videoNameWithToken))
      videoURL= URLExternalizer.MediaLocationURL +"profilePic/"+videoNameWithToken
    /*
      val profileVideo: File = videoData.ref.file.asInstanceOf[File]
      val profileVideoInputStream = new FileInputStream(profileVideo)
      new mediaComposite(videoFilename, contentType.get, profileVideoInputStream)
    */
    }.get

    val mediaJsonMap = request.body.asFormUrlEncoded.toList
    val uploadType = mediaJsonMap(0)._2.toList(0)
    val mobileNo = mediaJsonMap(1)._2.toList(0)
    
    
    // Save the profile picture for a user
    val media=new ProfileMedia(new ObjectId,new ObjectId(request.session.get("userId").get),imageURL,videoURL,mobileNo,uploadType)
    ProfileMedia.saveMediaForUser(media)
    /*
    val mediaTransfrerObject = new MediaTransfer(new ObjectId(request.session.get("userId").get), MediaType.Image, true,
    imageComposite.inputStream, imageComposite.name, videoComposite.inputStream, videoComposite.name, mobileNo, uploadType)
    Profile.createMedia(mediaTransfrerObject)
    */
    Ok
  }
}
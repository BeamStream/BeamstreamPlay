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

object MediaController extends Controller {
  
 

  def getMedia = Action(parse.multipartFormData) { request =>
    
   
    
     // Fetch the image stream and details
    val imageComposite = request.body.file("imageData").map { imageData =>

      val imageFilename = imageData.filename
      val contentType = imageData.contentType
      val profileImage: File = imageData.ref.file.asInstanceOf[File]
      val profileImageInputStream = new FileInputStream(profileImage)
      new mediaComposite(imageFilename,contentType.get,profileImageInputStream)
    }.get
  
    // Fetch the video stream and details
   val videoComposite=request.body.file("videoData").map { videoData =>

      val videoFilename = videoData.filename
      val contentType = videoData.contentType
      val profileVideo: File = videoData.ref.file.asInstanceOf[File]
      val profileVideoInputStream = new FileInputStream(profileVideo)
      new mediaComposite(videoFilename,contentType.get,profileVideoInputStream)
    }.get
  
     val mediaJsonMap=request.body.asFormUrlEncoded.toList
     val uploadType =mediaJsonMap(0)._2.toList(0)
     val mobileNo =mediaJsonMap(1)._2.toList(0)
    
    
    val mediaTransfrerObject = new MediaTransfer(new ObjectId(request.session.get("userId").get), MediaType.Image, true,
    imageComposite.inputStream, imageComposite.name, videoComposite.inputStream, videoComposite.name, mobileNo,uploadType)
    Profile.createMedia(mediaTransfrerObject)
    
    Ok
  }
}
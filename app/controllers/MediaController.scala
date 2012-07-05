package controllers
import play.api.mvc.Controller
import play.api.mvc.Action
import java.io.FileInputStream
import java.io.File
import com.mongodb.casbah.gridfs.GridFS
import utils.MongoHQConfig
import java.io.FileOutputStream
import models.MediaTransfer
import java.awt.MediaType
import models.MediaType
import org.bson.types.ObjectId
import java.io.InputStream

object MediaController extends Controller {

  //def getMedia = Action(parse.multipartFormData) { implicit request =>

  //    val MediaAlongWithRequest = request.body.asFormUrlEncoded
  //    val imageData = MediaAlongWithRequest("imageData").toList(0)
  //
  //    val profileImagebyteArray = imageData.getBytes
  //    
  //    
  //   val fileOuputStream = new FileOutputStream("/home/neelkanth/Desktop/neel")
  //   fileOuputStream.write(profileImagebyteArray)
  //    println("*************************")
  //    
  //    
  ////    
  ////    val gridFS = GridFS(MongoHQConfig.mongoDB)
  ////    val gfsFile = gridFS.createFile(profileImagebyteArray)
  ////    gfsFile.filename = "Neel"
  ////    gfsFile.save
  ////    println("got the success")
  ////
  ////    val a = gridFS.findOne("Neel").get
  ////    a.writeTo("/home/neelkanth/Desktop/neel")
  //
  //    Ok
  //  }

  def getMedia = Action(parse.multipartFormData) { request =>

    request.body.file("imageData").map { imageData =>

      val imageFilename = imageData.filename
      val contentType = imageData.contentType
      val profileImage: File = imageData.ref.file.asInstanceOf[File]
      val profileImageInputStream = new FileInputStream(profileImage)
      val mediaTransfrerObject = new MediaTransfer(new ObjectId(request.session.get("userId").get), MediaType.Image, true, profileImageInputStream, imageFilename, profileImageInputStream, imageFilename, "")
      Ok
    }
      .getOrElse {
        println("i am here with no result")
        Ok

      }
  }
}
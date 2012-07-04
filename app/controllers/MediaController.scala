package controllers
import play.api.mvc.Controller
import play.api.mvc.Action
import java.io.FileInputStream
import java.io.File
import com.mongodb.casbah.gridfs.GridFS
import utils.MongoHQConfig
import java.io.FileOutputStream

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
     println("%%%%%%%%%%%%%%%%%%%%%%%")
     println(request.body)
    request.body.file("imageData").map { imageData =>
      println("i am here")
      import java.io.File
      val filename = imageData.filename
      val contentType = imageData.contentType
      
      println(filename + "******" + contentType)
      imageData.ref.moveTo(new File("/home/neelkanth/Desktop"))
      Ok("File uploaded")
    }.getOrElse {
       println("i am here with no result")
      Ok

    }
  }
}
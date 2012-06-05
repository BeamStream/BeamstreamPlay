package controllers
import play.api.mvc.Controller
import play.api.mvc.Action
import java.io.FileInputStream
import java.io.File

object MediaController extends Controller {

  def getMedia = Action(parse.multipartFormData) { implicit request =>

    println("I M here")
      println(request.body)
  


    //     val body = request.body.asMultipartFormData
    //      val picture = body.get.file("imageData")
    //    
    //      (picture.isEmpty) match {
    //      case true => println("Kuch nhi h")
    //      case _ => "Kuch h to sahi"
    //    }

    //     val imageData=request.body.file("imageData")
    //   
    //     println(imageData)

    //      val fileObtained: File = imageData.asInstanceOf[File]
    //     val inputStream = new FileInputStream(fileObtained)
    //    println(inputStream)
    
//    val aa = request.body.files
//    
//    println("Number of files sent: " + aa.size)
    
   
//    
    request.body.file("imageData").map { imageData =>
    
      imageData.ref.moveTo(new File("/home/neelkanth/Desktop"))
      println("FileUploaded")
      Ok
    }.getOrElse {
      println("No Result")
      Ok
    }
   
  }
}
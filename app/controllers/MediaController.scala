package controllers
import play.api.mvc.Controller
import play.api.mvc.Action
import java.io.FileInputStream
import java.io.File

object MediaController extends Controller {

  def getMedia = Action(parse.multipartFormData) { implicit request =>

    println("I M here")
    println(request.body)

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
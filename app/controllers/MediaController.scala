package controllers
import play.api.mvc.Controller
import play.api.mvc.Action

object MediaController extends Controller {

  def getMedia = Action { implicit request =>
    println("M here")
 val data=request.body.asMultipartFormData.get
    println(data)

    Ok

  }
}
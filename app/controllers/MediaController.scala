package controllers
import play.api.mvc.Controller
import play.api.mvc.Action

object MediaController extends Controller {

  def getMedia = Action { implicit request =>
    println("M here")

    println(request.body)

    Ok

  }
}
package controllers
import play.api.mvc._

object Registration extends Controller {

  def registration = Action {
    Ok(views.html.registration())
  }

}

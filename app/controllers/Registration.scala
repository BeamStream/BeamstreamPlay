package controllers
import play.api.mvc._
import models.Token

object Registration extends Controller {
  
  /**
   * Regsitration after Mail
   */
  def registration(token: String, userId: String) = Action {
    (Token.findToken(token).isEmpty) match {
      case false => Ok(views.html.registration(userId))
      case true => Ok("Token has been expired")
    }

  }

}

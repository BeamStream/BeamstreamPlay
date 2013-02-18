package controllers
import play.api.mvc._
import models.Token

object Registration extends Controller {

  
  /**
   * Regsitration after Mail
   */
  def registration(token: String, userId: String) = Action {

    (Token.findToken(token).isEmpty) match {
      case false => Ok(userId)
      Redirect("/renderRegistartion")
      case true => Ok("Token has been expired")
    }

  }
  
  def renderRegistartion = Action {

   Ok(views.html.registration())

  }

}

package controllers

import play.api.mvc._
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import utils.PasswordHashing

object Login extends Controller {
  implicit val formats = DefaultFormats
  /**
   * renders the login page
   * @return
   */
  def index = Action {
    Ok(views.html.login())
  }

}



package controllers

import play.api._
import play.api.mvc._
import models.Stream
import play.api.data._
import play.api.data.Forms._
import models.UserDAO
import com.codahale.jerkson.Json
import org.bson.types.ObjectId
import net.liftweb.json.DefaultFormats
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import models.Class
import java.text.SimpleDateFormat
import utils.ObjectIdSerializer


object TemplateController extends Controller {

  /**
   * Templating Demo
   */
  def index = Action { implicit request =>
      println("Templating Testing")
      Redirect("/beamstream/template.html")
  }


}
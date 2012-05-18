package controllers

import play.api.mvc._
import play.api._
import play.api.data._
import play.api.data.Forms._
import models.ClassForm
import models.Class
import org.bson.types.ObjectId
import models.ClassType
import java.text.DateFormat
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }

object ClassController extends Controller {

  implicit val formats = DefaultFormats
  /*
 * Map the fields value from html form
 */
  val classForm = Form(
    mapping(
      "className" -> nonEmptyText,
      "classCode" -> nonEmptyText,
      "classType" -> nonEmptyText,
      "schoolName" -> nonEmptyText)(ClassForm.apply)(ClassForm.unapply))

  /*
  * Displays all the classes        
  */
     
  def classes = Action {
    Ok(views.html.classes(classForm))
  }

  
  /*
   * Add a class to a user (Intact)
   */

  def addClass = Action { implicit request =>

    val classListJsonMap = request.body.asFormUrlEncoded.get
    val classJsonList = classListJsonMap("data").toList
    println("Here's the JSON String extracted for class" + classJsonList(0))
    Class.createClass(List())
    Ok
  }

}
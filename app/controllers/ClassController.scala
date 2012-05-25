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
import java.text.SimpleDateFormat
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import models.School

object ClassController extends Controller {

  val EnumList: List[Enumeration] = List(ClassType)
  
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new EnumerationSerializer(EnumList) + new ObjectIdSerializer

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
     val classList = net.liftweb.json.parse(classJsonList(0)).extract[List[Class]]
    println("Here is the class List"+ classList)
    Class.createClass(classList)
    //School.addClasstoSchool(classList(0).schoolId , classList )
    Ok
  }

}
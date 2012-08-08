package controllers

import play.api.mvc._
import play.api._
import play.api.data._
import play.api.data.Forms._
import models.Class
import org.bson.types.ObjectId
import models.ClassType
import java.text.DateFormat
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import java.text.SimpleDateFormat
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import models.UserSchool
import models.User
import models.ResulttoSent

object ClassController extends Controller {

  val EnumList: List[Enumeration] = List(ClassType)

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new EnumerationSerializer(EnumList) + new ObjectIdSerializer

  /*
   * Add a class to a user (Intact)
   */

  def addClass = Action { implicit request =>
    val classListJsonMap = request.body.asFormUrlEncoded.get
    val classJsonList = classListJsonMap("data").toList
    val classList = net.liftweb.json.parse(classJsonList(0)).extract[List[Class]]
    val listOfClassIds = Class.createClass(classList, new ObjectId(request.session.get("userId").get))
    (listOfClassIds.isEmpty) match {
      case true =>
        Ok(write(new ResulttoSent("Failure", "One of Your Class Code already exists")))
      case false =>
        User.addClassToUser(new ObjectId(request.session.get("userId").get), listOfClassIds)
        Ok(write(new ResulttoSent("Success", "Class added")))
    }

  }

  /*
   *  Return the class JSON for auto populate the classes on class stream
   */

  def findClasstoAutoPopulate = Action { implicit request =>

    val classCodeMap = request.body.asFormUrlEncoded.get
    val classCode = classCodeMap("data").toList(0)
    val userSchoolIdList = UserSchool.getAllSchoolforAUser(new ObjectId(request.session.get("userId").get))
    val classList = Class.findClassByCode(classCode, userSchoolIdList)
    val classListJson = write(classList)
    Ok(classListJson).as("application/json")
  }

}
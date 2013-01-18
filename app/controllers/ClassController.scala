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
import models.Class

object ClassController extends Controller {

  val EnumList: List[Enumeration] = List(ClassType)

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new EnumerationSerializer(EnumList) + new ObjectIdSerializer //+ new CollectionSerializer

  /**
   * Add a class to a user (Intact)
   */

  def addClass = Action { implicit request =>
    try {
      val classListJsonMap = request.body.asFormUrlEncoded.get
      val classJsonList = classListJsonMap("data").toList.head
      val classListTemp = net.liftweb.json.parse(classJsonList)
      val classList = net.liftweb.json.parse(classJsonList).extract[List[Class]]
      val resultToSent = Class.createClass(classList, new ObjectId(request.session.get("userId").get))
      val refreshedClasses = Class.getAllRefreshedClasss(classList)
      Ok(write((refreshedClasses))).as("application/json")
    } catch {
      case ex => Ok(write(new ResulttoSent("Failure", "There Was Some Problem During Class Creation")))
    }

  }

  /**
   *  Return the class JSON for auto populate the classes on class stream
   *  @Purpose : Class code and class name autopoulate on class stream page
   *  
   */

  def findClasstoAutoPopulatebyCode = Action { implicit request =>

    val classCodeMap = request.body.asFormUrlEncoded.get
    val classCode = classCodeMap("data").toList(0)
    val assosiatedSchoolId = classCodeMap("assosiatedSchoolId").toList(0)
    val classList = Class.findClassByCode(classCode, new ObjectId(assosiatedSchoolId))
    val classListJson = write(classList)
    Ok(classListJson).as("application/json")
  }

  /**
   *  Return the class JSON for auto populate the classes on class stream
   *  @Purpose : Class code and class name autopoulate on class stream page
   *  
   */

  def findClasstoAutoPopulatebyName = Action { implicit request =>

    val classNameMap = request.body.asFormUrlEncoded.get
    val className = classNameMap("data").toList(0)
    val assosiatedSchoolId = classNameMap("assosiatedSchoolId").toList(0)
    val classList = Class.findClassByName(className, new ObjectId(assosiatedSchoolId))
    val classListJson = write(classList)
    Ok(classListJson).as("application/json")

  }

  /**
   * Edit Class Functionality
   * @Purpose: Getting all classes for a user
   */
  def getAllClassesForAUser = Action { implicit request =>
    try {
      val userId = new ObjectId(request.session.get("userId").get)
      val classIdList = Class.getAllClassesIdsForAUser(userId)
      val getAllClassesForAUser = Class.getAllClasses(classIdList)
      val ClassListJson = write(getAllClassesForAUser)
      Ok(ClassListJson).as("application/json")
    } catch {
      case ex => Ok(write(new ResulttoSent("Failure", "There Was Some Problem To Get List Of Classes For A User")))
    }
  }

}
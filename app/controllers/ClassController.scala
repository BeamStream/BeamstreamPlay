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
import models.ResulttoSent
import models.Stream
import models.ClassResult

object ClassController extends Controller {

  val EnumList: List[Enumeration] = List(ClassType)

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new EnumerationSerializer(EnumList) + new ObjectIdSerializer //+ new CollectionSerializer

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
   *  Return the class JSON for auto populate the classes on class stream  (RA)
   *  @Purpose : Class code and class name autopopulate on class stream page
   *
   */

  def findClasstoAutoPopulatebyName = Action { implicit request =>
    try {
      val classNameMap = request.body.asFormUrlEncoded.get
      val className = classNameMap("data").toList(0)
      val assosiatedSchoolId = classNameMap("schoolId").toList(0)
      val classList = Class.findClassByName(className, new ObjectId(assosiatedSchoolId))
      val classListJson = write(classList)
      Ok(classListJson).as("application/json")
    } catch {
      case exception => InternalServerError("Class Autopopulate Failed")
    }
  }

  /**
   * Edit Class Functionality
   * @Purpose: Getting all classes for a user
   */
  def getAllClassesForAUser(userId: String) = Action { implicit request =>
    try {
      val id = new ObjectId(userId)
      val classIdList = Class.getAllClassesIdsForAUser(id)
      val getAllClassesForAUser = Class.getAllClasses(classIdList)
      val ClassListJson = write(getAllClassesForAUser)
      Ok(ClassListJson).as("application/json")
    } catch {
      case ex => Ok(write(new ResulttoSent("Failure", "There Was Some Problem To Get List Of Classes For A User")))
    }
  }

  /**
   * ------------------------- Re architecture  -----------------------------------------------------------------------------------
   */

  def renderClassPage = Action { implicit request =>
    Ok(views.html.classpage())
  }

  def createClass = Action { implicit request =>
    try {
      println(request.body.asJson.get)
      val jsonReceived = request.body.asJson.get
      val id = (jsonReceived \ "id").asOpt[String]
      if (id == None) {
        println("Create Stream Case")
        val classCreated = net.liftweb.json.parse(request.body.asJson.get.toString).extract[Class]
        val streamIdReturned = Class.createClass(classCreated, new ObjectId(request.session.get("userId").get))
        val stream = Stream.findStreamById(streamIdReturned)
        Ok(write(ClassResult(stream, ResulttoSent("Success", "Class Created Successfully")))).as("application/json")
      } else {
        println("Join Stream Case")
        val classesobtained = Class.findClasssById(new ObjectId(id.get))
        val resultToSend = models.Stream.joinStream(classesobtained.get.streams(0), new ObjectId(request.session.get("userId").get))
        if (resultToSend.status == "Success") User.addClassToUser(new ObjectId(request.session.get("userId").get), List(new ObjectId(id.get)))
        //TODO needs to be checked
        val stream = Stream.findStreamById(classesobtained.get.streams(0))
        Ok(write(ClassResult(stream, resultToSend))).as("application/json")
      }
    } catch {
      case exception => InternalServerError("Class Creation Failed")
    }
  }
}
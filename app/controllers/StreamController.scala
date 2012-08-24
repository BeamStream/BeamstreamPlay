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
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import models.ClassType
import models.User
import models.StreamType
import models.Class
import models.ResulttoSent

object StreamController extends Controller {

  val EnumList: List[Enumeration] = List(ClassType)
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new EnumerationSerializer(EnumList) + new ObjectIdSerializer

  def index = Action {
    Ok("This is BeamStream Application by Knoldus Software LLP  Neelkanth Sachdeva(Sr. Developer)")

  }

  /*
   * Get All Stream for a user
   * 
   */
  def getAllStreamForAUser = Action { implicit request =>
    val allStreamsForAUser = Stream.getAllStreamforAUser(new ObjectId(request.session.get("userId").get))
    val allStreamsForAUserJson = write(allStreamsForAUser)
    Ok(allStreamsForAUserJson).as("application/json")
  }

  /*
   * Get All Class Stream for a user
   * 
   */
  def allClassStreamsForAUser = Action { implicit request =>
    val allClassStreamsForAUser = Stream.allClassStreamsForAUser(new ObjectId(request.session.get("userId").get))
    val allStreamsForAUserJson = write(allClassStreamsForAUser)
    Ok(allStreamsForAUserJson).as("application/json")
  }

  /*
   * Creates a class and a new Stream
   * @Purpose: This will create a new class & correspondent stream
   * For class stream screen 
   * 
   */

  def newStream = Action { implicit request =>
    val classListJsonMap = request.body.asFormUrlEncoded.get

    val classJsonList = classListJsonMap("data").toList(0)
    val classList = net.liftweb.json.parse(classJsonList).extract[List[Class]]

    val listOfClassIds = Class.createClass(classList, new ObjectId(request.session.get("userId").get))

    (listOfClassIds.isEmpty) match {
      case true =>
        Ok(write(new ResulttoSent("Failure", "One of Your Class Code already exists")))

      case false =>
        User.addClassToUser(new ObjectId(request.session.get("userId").get), listOfClassIds)
        val classJson = net.liftweb.json.parse(classJsonList)
        val classTag = (classJson \ "classTag").extract[String]
        //updating Tags 
        val classToUpdateWithTags = Class.findClasssById(listOfClassIds(0))
        val streamId = classToUpdateWithTags.streams(0)
        Stream.addTagsToStream(List(classTag), streamId)
        Ok(write(new ResulttoSent("Success", "Class added")))
    }

  }

  /*
   * Join the stream (From class stream page)
   * @Purpose : User Joins a stream here
   * 
   */
  def joinStream = Action { implicit request =>
    val classListJsonMap = request.body.asFormUrlEncoded.get
    val classJsonList = classListJsonMap("data").toList(0)
    val classJson = net.liftweb.json.parse(classJsonList)
    val classId = (classJson \ "id").extract[String]
    val streamId = Class.findClasssById(new ObjectId(classId)).streams(0)
    Stream.joinStream(streamId, new ObjectId(request.session.get("userId").get))
    Ok(write(new ResulttoSent("Success", "User has SuccessFully Joined The Stream")))
  }

}
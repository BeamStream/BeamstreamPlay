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
import models.Message
import utils.onlineUserCache

object StreamController extends Controller {

  val EnumList: List[Enumeration] = List(ClassType)
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new EnumerationSerializer(EnumList) + new ObjectIdSerializer

  def index = Action { implicit request =>
    val playCookiee = request.cookies.get("PLAY_SESSION")
    if (playCookiee == None) Redirect("/beamstream/home.html")
    else {
      val noOfOnLineUsers = onlineUserCache.setOnline(request.session.get("userId").get)
      println("Online Users" + noOfOnLineUsers)
      Redirect("/beamstream/index.html#streams")
    }
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
   * Show the no. of users attending classes
   * @Purpose: For Showing no. of classes
   */

  def noOfUsersAttendingAClass = Action { implicit request =>
    val StreamIdJsonMap = request.body.asFormUrlEncoded.get
    val streamId = StreamIdJsonMap("streamId").toList(0)
    val usersAttendingClass = Stream.usersAttendingClass(new ObjectId(streamId))
    val rolesOfUsers = User.countRolesOfAUser(usersAttendingClass)
    Ok(write(rolesOfUsers)).as("application/json")
  }

  /*
   * Get All Public Messages For A User
   * @Purpose: For Public Profile
   */
  def allPublicMessagesFromAllStreamsForAUser = Action { implicit request =>
    val UserIdJsonMap = request.body.asFormUrlEncoded.get
    val userId = UserIdJsonMap("userId").toList(0)
    val classListForAUser = Class.getAllClassesForAUser(new ObjectId(userId))
    val allPublicMessagesForAUserAcrossTheirStreams = Message.getAllPublicMessagesForAUser(classListForAUser)
    Ok(write(allPublicMessagesForAUserAcrossTheirStreams)).as("application/json")

  }

  /**
   *  Delete A Stream
   */
  def deleteTheStream = Action { implicit request =>
    val DetailsJsonMap = request.body.asFormUrlEncoded.get
    val streamId = DetailsJsonMap("StreamId").toList(0)
    val deleteStream = DetailsJsonMap("deleteStream").toList(0).toBoolean
    val removeAccess = DetailsJsonMap("removeAccess").toList(0).toBoolean
    val result = Stream.deleteStreams(new ObjectId(request.session.get("userId").get), new ObjectId(streamId), deleteStream, removeAccess)
    println(write(result))
    Ok(write(result)).as("application/json")

  }

}
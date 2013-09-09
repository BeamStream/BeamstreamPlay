package controllers

import java.text.SimpleDateFormat
import org.bson.types.ObjectId
import models.Class
import models.ClassType
import models.Message
import models.Stream
import models.User
import net.liftweb.json.Serialization.write
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import utils.OnlineUserCache
import play.api.Routes

object StreamController extends Controller {

  val EnumList: List[Enumeration] = List(ClassType)
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new EnumerationSerializer(EnumList) + new ObjectIdSerializer

  /**
   * Check the cookies if login exists & take corresponding actions
   */

  def index = Action { implicit request =>
    val playCookiee = request.cookies.get("PLAY_SESSION")
    (playCookiee == None) match {
      case true => Redirect("/")
      case false =>
        val noOfOnLineUsers = OnlineUserCache.setOnline(request.session.get("userId").get)
        println("Online Users" + noOfOnLineUsers)
        Redirect("/stream")
    }

  }
  /**
   * On Error Redirect to error page
   */
  def onError = Action { implicit request =>
    Ok(views.html.error())
  }

  /**
   * Get All Stream for a user(V)
   */
  def getAllStreamForAUser = Action { implicit request =>
    val allStreamsForAUser = Stream.getAllStreamforAUser(new ObjectId(request.session.get("userId").get))
    Ok(write(allStreamsForAUser)).as("application/json")
  }

  /**
   * Get All Class Stream for a user
   */
  def allClassStreamsForAUser = Action { implicit request =>
    val allClassStreamsForAUser = Stream.allClassStreamsForAUser(new ObjectId(request.session.get("userId").get))
    val allStreamsForAUserJson = write(allClassStreamsForAUser)
    Ok(allStreamsForAUserJson).as("application/json")
  }

  /**
   * Show the no. of users attending classes
   * @Purpose: For Showing no. of classes
   */

  def noOfUsersAttendingAClass(streamId: String) = Action { implicit request =>
    val usersAttendingClass = Stream.usersAttendingClass(new ObjectId(streamId))
    val rolesOfUsers = User.countRolesOfAUser(usersAttendingClass)
    Ok(write(rolesOfUsers)).as("application/json")
  }

  /**
   * Get All Public Messages For A User
   * @Purpose: For Public Profile (Stream Specific Results)
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
  def deleteTheStream(streamId: String) = Action { implicit request =>
    val result = Stream.deleteStreams(new ObjectId(request.session.get("userId").get), new ObjectId(streamId))
    Ok(write(result)).as("application/json")

  }
  /**
   * ****************************************** Re-architecture ****************************************************
   */

  /**
   * Renders the stream page
   */
  def renderStreamPage = Action { implicit request =>
    Ok(views.html.stream())
  }

  /**
   * Java Script Routes
   */
  def javascriptRoutes = Action { implicit request =>

    Ok(
      Routes.javascriptRouter("jsRoutes")(
        routes.javascript.UserController.checkForChat)).as("text/javascript")
  }

}
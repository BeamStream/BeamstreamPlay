package controllers

import java.text.SimpleDateFormat

import org.bson.types.ObjectId

import models.ClassType
import models.Stream
import models.Token
import models.User
import models.UserMedia
import net.liftweb.json.Serialization.write
import play.api.Play
import play.api.Routes
import play.api.mvc.Action
import play.api.mvc.AnyContent
import play.api.mvc.Controller
import play.api.mvc.Cookie
import play.api.mvc.DiscardingCookie
import utils.EnumerationSerializer
import utils.ObjectIdSerializer

object StreamController extends Controller {

  val EnumList: List[Enumeration] = List(ClassType)
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter: SimpleDateFormat = new SimpleDateFormat("MM/dd/yyyy")
  } + new EnumerationSerializer(EnumList) + new ObjectIdSerializer

  /**
   * Check the cookies if login exists & take corresponding actions
   */

  /*def index: Action[AnyContent] = Action { implicit request =>
    // val playCookiee = request.cookies.get("PLAY_SESSION")
    (request.session.get("userId") == None) match {
      case true => Redirect("/")
      case false =>

        Future {
          val utcMilliseconds = OnlineUserCache.returnUTCTime
          OnlineUserCache.setOnline(request.session.get("userId").get, utcMilliseconds)
        }
        val userFound = User.getUserProfile(new ObjectId(request.session.get("userId").get))
        userFound.get.classes.isEmpty match {
          case true => Redirect("/class")
          case false => Redirect("/stream")

        }
    }

  }*/
  /**
   * On Error Redirect to error page
   */
  def onError: Action[AnyContent] = Action { implicit request =>
    Ok(views.html.error())
  }

  /**
   * Get All Stream for a user(V)
   */
  def getAllStreamForAUser: Action[AnyContent] = Action { implicit request =>
    val allStreamsForAUser = Stream.getAllStreamforAUser(new ObjectId(request.session.get("userId").get))
    Ok(write(allStreamsForAUser)).as("application/json")
  }

  /**
   * Get All Class Stream for a user
   */
  def allClassStreamsForAUser: Action[AnyContent] = Action { implicit request =>
    val allClassStreamsForAUser = Stream.allClassStreamsForAUser(new ObjectId(request.session.get("userId").get))
    val allStreamsForAUserJson = write(allClassStreamsForAUser)
    Ok(allStreamsForAUserJson).as("application/json")
  }

  /**
   * Show the no. of users attending classes
   * @Purpose: For Showing no. of classes
   */

  def noOfUsersAttendingAClass(streamId: String): Action[AnyContent] = Action { implicit request =>
    val usersAttendingClass = Stream.usersAttendingClass(new ObjectId(streamId))
    val rolesOfUsers = User.countRolesOfAUser(usersAttendingClass)
    Ok(write(rolesOfUsers)).as("application/json")
  }

  /**
   * Get All Public Messages For A User
   * @Purpose: For Public Profile (Stream Specific Results)
   */
  /* def allPublicMessagesFromAllStreamsForAUser: Action[AnyContent] = Action { implicit request =>
    val UserIdJsonMap = request.body.asFormUrlEncoded.get
    val userId = UserIdJsonMap("userId").toList(0)
    val classListForAUser = Class.getAllClassesForAUser(new ObjectId(userId))
    val allPublicMessagesForAUserAcrossTheirStreams = Message.getAllPublicMessagesForAUser(classListForAUser)
    Ok(write(allPublicMessagesForAUserAcrossTheirStreams)).as("application/json")

  }*/

  /**
   *  Delete A Stream
   */
  def deleteTheStream(streamId: String): Action[AnyContent] = Action { implicit request =>
    val result = Stream.deleteStreams(new ObjectId(request.session.get("userId").get), new ObjectId(streamId))
    Ok(write(result)).as("application/json")

  }
  /**
   * ****************************************** Re-architecture ****************************************************
   */

  /**
   * Renders the stream page
   */
  def renderStreamPage: Action[AnyContent] = Action { implicit request =>
    (request.session.get("userId")) match {
      case Some(userId) =>
        val userFound = User.getUserProfile(new ObjectId(userId))
        userFound match {
          case Some(user) =>
            user.classes.isEmpty match {
              case true => Redirect("/class").withCookies(Cookie("Beamstream", userId.toString() + " class", Option(864000))) //Ok(views.html.classpage())
              case false => Ok(views.html.stream("ok")).withCookies(Cookie("Beamstream", userId.toString() + " stream", Option(864000)))
            }
          case None => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
        }
      case None =>
        request.cookies.get("Beamstream") match {
          case None => Redirect("/login").discardingCookies(DiscardingCookie("Beamstream"))
          case Some(cookie) =>
            val userId = cookie.value.split(" ")(0)
            val userFound = User.getUserProfile(new ObjectId(userId))
            cookie.value.split(" ")(1) match {
              case "class" => Redirect("/class").withSession("userId" -> userId).withCookies(Cookie("Beamstream", userId.toString() + " class", Option(864000)))
              case "stream" => Redirect("/stream").withSession("userId" -> userId)
                .withCookies(Cookie("Beamstream", userId.toString() + " stream", Option(864000)))
              case "browsemedia" => Redirect("/browsemedia").withSession("userId" -> userId)
                .withCookies(Cookie("Beamstream", userId.toString() + " browsemedia", Option(864000)))
              case "registration" =>
                val tokenFound = Token.findTokenByUserId(userId)
                userFound match {
                  case Some(user) =>
                    val server = Play.current.configuration.getString("server").get
                    user.firstName match {
                      case "" => Redirect(server + "/registration?userId=" + userId + "&token=" + tokenFound(0).tokenString)
                        .withSession("token" -> tokenFound(0).tokenString)
                        .withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000)))
                      case _ =>
                        val userMedia = UserMedia.findUserMediaByUserId(new ObjectId(userId))
                        userMedia.isEmpty match {
                          case true => Redirect(server + "/registration?userId=" + userId + "&token=" + tokenFound(0).tokenString)
                            .withSession("token" -> tokenFound(0).tokenString)
                            .withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000)))
                          case false => Redirect("/class").withSession("userId" -> userId)
                            .withCookies(Cookie("Beamstream", userId.toString() + " class", Option(864000)))
                        }
                    }
                  case None => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
                }
              case _ => Redirect("/" + cookie.value.split(" ")(1)).withSession("userId" -> userId)
                .withCookies(Cookie("Beamstream", userId.toString() + " " + cookie.value.split(" ")(1), Option(864000)))
            }
        }
    }
  }
  /*    OnlineUserCache.returnOnlineUsers.isEmpty match {
      case false =>
        OnlineUserCache.returnOnlineUsers(0).onlineUsers.isEmpty match {
          case true => Ok(views.html.login())
          case false =>
            val userID = request.session.get("userId")
            userID match {
              case Some(id) =>
                val loggedInUser = User.getUserProfile(new ObjectId(id))
                loggedInUser.get.classes.isEmpty match {
                  case true => Ok(views.html.classpage())
                  case false => Ok(views.html.stream("ok"))
                }
              case None => Redirect("/login")
            }
        }
      case true =>
        Redirect("/signOut")
    }
  }
*/

  def getStreamData(streamId: String): Action[AnyContent] = Action { implicit request =>
    if (streamId.length() <= 24) {
      val streamfound = Stream.findStreamById(new ObjectId(streamId))
      streamfound match {
        case None => Ok
        case Some(streamData) => Ok(write(streamData)).as("application/json")
      }
    } else {
      Ok
    }
  }
  /**
   * Ajax Support
   */

  def javascriptRoutes: Action[AnyContent] = Action { implicit request =>
    import routes.javascript._
    Ok(
      Routes.javascriptRouter("jsRoutes")(
        routes.javascript.WebsocketCommunicationController.chat)).as("text/javascript")
  }

}

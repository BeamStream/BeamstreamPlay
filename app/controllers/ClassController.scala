package controllers

import org.bson.types.ObjectId
import models.ClassType
import java.text.DateFormat
import net.liftweb.json.Serialization.{ read, write }
import java.text.SimpleDateFormat
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import models.User
import models.Class
import models.ResulttoSent
import models.Stream
import models.ClassResult
import models.Token
import models.UserMedia
import play.api.mvc.AnyContent
import play.api.mvc.Action
import play.api.mvc.Controller
import play.api.mvc.DiscardingCookie
import play.api.mvc.Cookie
import play.api.Play
import play.api.Logger
import java.util.Date

object ClassController extends Controller {

  val EnumList: List[Enumeration] = List(ClassType)

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter: SimpleDateFormat = new SimpleDateFormat("MM/dd/yyyy")
  } + new EnumerationSerializer(EnumList) + new ObjectIdSerializer //+ new CollectionSerializer

  /**
   *  Return the class JSON for auto populate the classes on class stream
   *  Purpose : Class code and class name auto-populate on class stream page
   */

  def findClasstoAutoPopulatebyCode: Action[AnyContent] = Action { implicit request =>

    val classCodeMap = request.body.asFormUrlEncoded.get
    val classCode = classCodeMap("data").toList(0)
    val assosiatedSchoolId = classCodeMap("assosiatedSchoolId").toList(0)
    val classList = Class.findClassByCode(classCode, new ObjectId(assosiatedSchoolId))
    val classListJson = write(classList)
    Ok(classListJson).as("application/json")
  }

  /**
   *  Return the class JSON for auto populate the classes on class stream  (RA)
   *  Purpose : Class code and class name autopopulate on class stream page
   *
   */

  def findClasstoAutoPopulatebyName: Action[AnyContent] = Action { implicit request =>
    try {
      val classNameMap = request.body.asFormUrlEncoded.get
      val className = classNameMap("data").toList(0)
      val assosiatedSchoolId = classNameMap("schoolId").toList(0)
      val classList = Class.findClassByName(className, new ObjectId(assosiatedSchoolId))
      Ok(write(classList)).as("application/json")
    } catch {
      case exception: Throwable =>
        Logger.error("This error occurred while Auto-Populating the Class by Name :- ", exception)
        InternalServerError("Class Autopopulate Failed")
    }
  }

  /**
   * Edit Class Functionality
   * Purpose: Getting all classes for a user
   */
  def getAllClassesForAUser(userId: String): Action[AnyContent] = Action { implicit request =>
    try {
      val classIdList = Class.getAllClassesIdsForAUser(new ObjectId(userId))
      val getAllClassesForAUser = Class.getAllClasses(classIdList)
      val ClassListJson = write(getAllClassesForAUser)
      Ok(ClassListJson).as("application/json")
    } catch {
      case exception: Throwable =>
        Logger.error("This error occurred while fetching all Classes for a User :- ", exception)
        BadRequest(write(new ResulttoSent("Failure", "There Was Some Problem To Get List Of Classes For A User")))
    }
  }

  /**
   * ------------------------- Re architecture  -----------------------------------------------------------------------------------
   */

  /**
   * Display Class Page (V)
   */
  def renderClassPage: Action[AnyContent] = Action { implicit request =>
    val server = Play.current.configuration.getString("server").get
    (request.session.get("userId")) match {
      case Some(userId) =>
        val tokenFound = Token.findTokenByUserId(userId)
        tokenFound.isEmpty match {
          case false =>
            tokenFound(0).used match {
              case true => Ok(views.html.classpage(true)).withCookies(Cookie("Beamstream", userId.toString() + " class", Option(864000)))
              case false =>
                val userData = User.getUserProfile(new ObjectId(userId))
                userData.get.firstName match {
                  case "" => Redirect(server + "/registration?userId=" + userId + "&token=" + tokenFound(0).tokenString)
                    .withSession("token" -> tokenFound(0).tokenString).withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000)))
                  case _ =>
                    val userMedia = UserMedia.findUserMediaByUserId(new ObjectId(userId))
                    userMedia.isEmpty match {
                      case true => Redirect(server + "/registration?userId=" + userId + "&token=" + tokenFound(0).tokenString)
                        .withSession("token" -> tokenFound(0).tokenString).withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000)))
                      case false => Ok(views.html.classpage()).withCookies(Cookie("Beamstream", userId.toString() + " class", Option(864000)))
                    }
                }
            }
          case true => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
        }
      case None =>
        request.cookies.get("Beamstream") match {
          case None => Redirect("/login").discardingCookies(DiscardingCookie("Beamstream"))
          case Some(cookie) =>
            val userId = cookie.value.split(" ")(0)
            val userFound = User.getUserProfile(new ObjectId(userId))
            cookie.value.split(" ")(1) match {
              case "class" => Redirect("/class").withSession("userId" -> userId)
                .withCookies(Cookie("Beamstream", userId.toString() + " class", Option(864000)))
              case "stream" => Redirect("/stream").withSession("userId" -> userId)
                .withCookies(Cookie("Beamstream", userId.toString() + " stream", Option(864000)))
              case "registration" =>
                val tokenFound = Token.findTokenByUserId(userId)
                userFound match {
                  case Some(user) =>
                    user.firstName match {
                      case "" => Redirect(server + "/registration?userId=" + userId + "&token=" + tokenFound(0).tokenString).withSession("token" -> tokenFound(0).tokenString)
                        .withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000)))
                      case _ =>
                        val userMedia = UserMedia.findUserMediaByUserId(new ObjectId(userId))
                        userMedia.isEmpty match {
                          case true => Redirect(server + "/registration?userId=" + userId + "&token=" + tokenFound(0).tokenString)
                            .withSession("token" -> tokenFound(0).tokenString).withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000)))
                          case false => Redirect("/class").withSession("userId" -> userId)
                            .withCookies(Cookie("Beamstream", userId.toString() + " class", Option(864000)))
                        }
                    }
                  case None => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
                }
              case _ => Redirect("/" + cookie.value.split(" ")(1))
            }
        }
    }
  }
  //TODO remove them before pushing to Production.
  /* OnlineUserCache.returnOnlineUsers.isEmpty match {
      case false =>
        OnlineUserCache.returnOnlineUsers(0).onlineUsers.isEmpty match {
          case true => Ok(views.html.login())
          case false =>
            val userID = request.session.get("userId")
            userID match {
              case Some(id) => Ok(views.html.classpage())
                              val userToken = Token.findTokenByUserId(id)
                userToken.head.used match {
                  case true => Ok(views.html.classpage())
                  case false => Ok(views.html.login())
                }
              case None => Redirect("/login")
            }

        }
      case true =>
        Redirect("/signOut")
    }
  }
*/
  /**
   * Create Class (V)
   */
  def createClass: Action[AnyContent] = Action { implicit request =>
    try {
      val jsonReceived = request.body.asJson.get
      val id = (jsonReceived \ "id").asOpt[String]
      val userIdFound = request.session.get("userId")
      userIdFound match {
        case None => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
        case Some(userId) =>
          id match {
            case None =>
              val schoolId=(jsonReceived \ "schoolId").as[String]
              val classCode=(jsonReceived \ "classCode").as[String]
              val className=(jsonReceived \ "className").as[String]
              val classTime=(jsonReceived \ "classTime").as[String]
              val classType=(jsonReceived \ "classType").as[String]
              val classCreated=new Class(new ObjectId,classCode,className,ClassType.withName(classType),classTime,new Date(),new ObjectId(schoolId),List())
              //val classCreated = net.liftweb.json.parse(request.body.asJson.get.toString).extract[Class]
              val streamIdReturned = Class.createClass(classCreated, new ObjectId(userId))
              val stream = Stream.findStreamById(streamIdReturned)
              Ok(write(ClassResult(stream.get, ResulttoSent("Success", "Class Created Successfully")))).as("application/json")
            case Some(id) =>
              val classesobtained = Class.findClasssById(new ObjectId(id))
              val resultToSend = Stream.joinStream(classesobtained.get.streams(0), new ObjectId(userId))
              if (resultToSend.status == "Success") User.addClassToUser(new ObjectId(userId), List(new ObjectId(id)))
              val stream = Stream.findStreamById(classesobtained.get.streams(0))
              Ok(write(ClassResult(stream.get, resultToSend))).as("application/json")
          }
      }
    } catch {
      case exception: Throwable =>
        Logger.error("This error occurred while creating a Class :- ", exception)
        InternalServerError("Class Creation Failed")
    }
  }
}

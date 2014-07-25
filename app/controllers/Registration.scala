package controllers

import java.text.SimpleDateFormat
import java.util.Date
import org.bson.types.ObjectId
import models.Degree
import models.DegreeExpected
import models.Graduated
import models.RegistrationResults
import models.Token
import models.User
import models.UserSchool
import models.Year
import net.liftweb.json.Serialization.write
import play.api.libs.json.JsValue
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.ObjectIdSerializer
import utils.OnlineUserCache
import models.RegistrationResults
import java.util.Calendar
import scala.concurrent.Future
import play.api.libs.concurrent.Execution.Implicits._
import models.School
import models.ResulttoSent
import models.LoginResult
import play.api.Play
import play.api.mvc.Cookie
import models.UserMedia
import com.ning.http.client.Response
import play.api.cache.Cache
import play.api.Play.current
import play.api.mvc.AnyContent
import play.api.libs.json._
import utils.FetchLocationUtil
import play.api.mvc.DiscardingCookie
import models.ResulttoSent

object Registration extends Controller {
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter: SimpleDateFormat = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /**
   * Registration after Mail ((VA))
   */
  def registration: Action[AnyContent] = Action { implicit request =>
    val token = request.queryString("token").toList(0)
    request.session.get("userId") match {
      case None =>
        request.cookies.get("Beamstream") match {
          case Some(cookie) =>
            val userId = cookie.value.split(" ")(0)
            val tokenReceived = Token.findToken(token)
            (tokenReceived.isEmpty) match {
              case false =>
                if (tokenReceived.head.userId == userId && tokenReceived.head.tokenString == token) {
                  tokenReceived.head.used match {
                    case false =>
                      cookie.value.split(" ")(1) match {
                        case "class" => Redirect("/class").withSession("userId" -> userId)
                        case _ =>
                          val userFound = User.getUserProfile(new ObjectId(userId))
                          userFound match {
                            case Some(user) =>
                              val server = Play.current.configuration.getString("server").get
                              user.firstName match {
                                case "" => Redirect(server + "/registration?userId=" + userId + "&token=" + token).withSession("userId" -> userId).withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000)))
                                case _ =>
                                  val userMedia = UserMedia.findUserMediaByUserId(new ObjectId(userId))
                                  userMedia.isEmpty match {
                                    case true => Redirect(server + "/registration?userId=" + userId + "&token=" + token).withSession("userId" -> userId).withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000)))
                                    case false => Redirect("/class").withSession("userId" -> userId).withCookies(Cookie("Beamstream", userId.toString() + " class", Option(864000)))
                                  }
                              }
                            case None => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
                          }
                      }
                    case true => cookie.value.split(" ")(1) match {
                      case "registration" => Redirect("/stream").withSession("userId" -> userId).withCookies(Cookie("Beamstream", userId.toString() + cookie.value.split(" ")(1), Option(864000)))
                      case _ => Redirect("/" + cookie.value.split(" ")(1)).withSession("userId" -> userId).withCookies(Cookie("Beamstream", userId.toString() + cookie.value.split(" ")(1), Option(864000)))
                    }
                  }
                } else {
                  Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
                }
              case true => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
            }
          case None =>
            val userId = request.queryString("userId").toList(0)
            val tokenReceived = Token.findToken(token)
            (tokenReceived.isEmpty) match {
              case false =>
                if (tokenReceived.head.userId == userId && tokenReceived.head.tokenString == token) {
                  tokenReceived.head.used match {
                    case false =>
                      val userFound = User.getUserProfile(new ObjectId(userId))
                      userFound match {
                        case Some(user) =>
                          val server = Play.current.configuration.getString("server").get
                          user.firstName match {
                            case "" => Redirect(server + "/registration?userId=" + userId + "&token=" + token).withSession("userId" -> userId).withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000)))
                            case _ =>
                              val userMedia = UserMedia.findUserMediaByUserId(new ObjectId(userId))
                              userMedia.isEmpty match {
                                case true => Redirect(server + "/registration?userId=" + userId + "&token=" + token).withSession("userId" -> userId).withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000)))
                                case false => Redirect("/class").withSession("userId" -> userId).withCookies(Cookie("Beamstream", userId.toString() + " class", Option(864000)))
                              }
                          }
                        case None => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
                      }
                    case true => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
                  }
                } else {
                  Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
                }
              case true => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
            }
        }
      case Some(userId) =>
        val tokenReceived = Token.findToken(token)
        (tokenReceived.isEmpty) match {
          case false =>
            if (tokenReceived.head.userId == userId && tokenReceived.head.tokenString == token) {
              tokenReceived.head.used match {
                case false =>
                  val userFound = User.getUserProfile(new ObjectId(userId))
                  userFound match {
                    case Some(user) =>
                      user.firstName match {
                        case "" => Ok(views.html.registration(userId, None)).withSession("token" -> token).withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000))) //Redirect(server + "/registration?userId=" + userId + "&token=" + token).withSession("userId" -> userId).withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000)))
                        case _ =>
                          val userMedia = UserMedia.findUserMediaByUserId(new ObjectId(userId))
                          userMedia.isEmpty match {
                            case true => Ok(views.html.registration(userId, Cache.getAs(userId))).withSession("token" -> token).withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000))) //Redirect(server + "/registration?userId=" + userId + "&token=" + token).withSession("userId" -> userId).withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000)))
                            case false => Redirect("/class").withSession("userId" -> userId).withCookies(Cookie("Beamstream", userId.toString() + " class", Option(864000)))
                          }
                      } //Ok(views.html.registration(userId, Cache.getAs("userData"))).withSession("token" -> token).withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000))).withHeaders(CACHE_CONTROL -> "max-age=1")
                    case None => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
                  }
                case true => Redirect("/stream").withSession("userId" -> userId).withCookies(Cookie("Beamstream", userId.toString() + " stream", Option(864000)))
              }
            } else {
              Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
            }
          case true => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
        }
      /*    (request.session.get("userId") == None) match {

      case true =>

        val token = request.queryString("token").toList(0)
        val userId = request.queryString("userId").toList(0)
        val tokenReceived = Token.findToken(token)
        (tokenReceived.isEmpty) match {
          case false =>
            if (tokenReceived.head.userId == userId && tokenReceived.head.tokenString == token) {
              (tokenReceived.head.used == false) match {
                case true => Ok(views.html.registration(userId, None)).withSession("token" -> token)
                case false => Ok("This user has already been registered. Please login with your username and password or register using a new email address.")
              }
            } else {
              Redirect("/login")
            }
          case true =>
            Ok("Token not found")
        }
      case false =>
        val token = request.queryString("token").toList(0)
        val userId = request.queryString("userId").toList(0)
        val tokenReceived = Token.findToken(token)
        val userFound = User.getUserProfile(new ObjectId(request.session.get("userId").get))
        userFound match {
          case Some(user) => user.classes.isEmpty match {
            case true => Redirect("/class")
            case false => Redirect("/stream")
          }
          case None =>
            Redirect("/signOut")
        }
    }
*/ }
  }

  /**
   * renders the login page
   * @return
   */
  def loginPage: Action[AnyContent] = Action { implicit request =>
    (request.session.get("userId")) match {
      case Some(userId) =>
        val userFound = User.getUserProfile(new ObjectId(userId))
        userFound match {
          case Some(user) =>
            user.classes.isEmpty match {
              case true => Redirect("/class")
              case false => Redirect("/stream")
            }
          case None => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
        }
      case None =>
        request.cookies.get("Beamstream") match {
          case None => Ok(views.html.login())
          case Some(cookie) =>
            val userFound = User.getUserProfile(new ObjectId(cookie.value.split(" ")(0)))
            userFound match {
              case Some(user) =>
                user.classes.isEmpty match {
                  case true => Redirect("/class").withSession("userId" -> user.id.toString()).withCookies(Cookie("Beamstream", user.id.toString() + " class", Option(864000)))
                  case false => Redirect("/" + cookie.value.split(" ")(1)).withSession("userId" -> user.id.toString()).withCookies(Cookie("Beamstream", user.id.toString() + " " + cookie.value.split(" ")(1), Option(864000)))
                }
              case None => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
            }
        }
    }
  }

  /**
   * User Registration In Detail (V)
   */
  def registerUser: Action[AnyContent] = Action { implicit request =>
    val jsonReceived = request.body.asJson.get
    val associatedSchoolId = (jsonReceived \ "associatedSchoolId").as[String]
    val schoolName = (jsonReceived \ "schoolName").as[String]

    School.findSchoolsById(new ObjectId(associatedSchoolId)).get.schoolName == schoolName match {
      case true =>

        val userUpdate = updateUser(jsonReceived)
        userUpdate._1 match {
          case true =>

            val userId = (jsonReceived \ "userId").as[String]
            val major = (jsonReceived \ "major").as[String]
            val gradeLevel = (jsonReceived \ "gradeLevel").as[String]
            val degreeProgram = (jsonReceived \ "degreeProgram").as[String]
            val otherDegree = (jsonReceived \ "otherDegree").asOpt[String]
            val graduate = (jsonReceived \ "graduate").as[String]
            val degreeExpected = (jsonReceived \ "degreeExpected").asOpt[String]

            /**
             * Setting User Info in Cache for Autofill feature
             */
            Cache.set(userId, jsonReceived)

            val degreeExpectedSeason = (degreeExpected != None) match {
              case true => Option(DegreeExpected.withName(degreeExpected.get))
              case false => None
            }

            val graduationDate = (jsonReceived \ "graduationDate").asOpt[String]
            val graduationDateFound = (graduationDate != None) match {

              case true => Option(new SimpleDateFormat("MM/dd/yyyy").parse(graduationDate.get))
              case false => None
            }

            val userSchool = new UserSchool(new ObjectId, new ObjectId(associatedSchoolId), schoolName, Year.withName(gradeLevel), Degree.withName(degreeProgram), major, Graduated.withName(graduate),
              graduationDateFound, degreeExpectedSeason, None)
            UserSchool.createSchool(userSchool)
            User.addInfo(List(userSchool), new ObjectId(userId))
            val userCreated = User.getUserProfile(new ObjectId(userId))

            val utcMilliseconds = OnlineUserCache.returnUTCTime
            OnlineUserCache.setOnline(userId, utcMilliseconds)
            //retrieve token in session and invalidate
            //            val token = request.session.get("token").get
            //            Token.updateToken(token)

            Ok(write(RegistrationResults(userCreated.get, userSchool))).as("application/json").withSession("userId" -> userId)

          case false => Ok(write(userUpdate._2)).as("application/json")
        }

      case false => Ok(write("Please select an existing school or create your own one")).as("application/json")
    }
  }

  /**
   * User Registration In Detail (VA)
   */
  def editUserInfo(userId: String): Action[AnyContent] = Action { implicit request =>

    val jsonReceived = request.body.asJson.get

    val associatedSchoolId = (jsonReceived \ "associatedSchoolId").as[String]
    val schoolName = (jsonReceived \ "schoolName").as[String]

    School.findSchoolsById(new ObjectId(associatedSchoolId)).get.schoolName == schoolName match {
      case true =>

        val userUpdate = updateUser(jsonReceived)
        userUpdate._1 match {
          case true =>

            val major = (jsonReceived \ "major").as[String]
            val gradeLevel = (jsonReceived \ "gradeLevel").as[String]
            val degreeProgram = (jsonReceived \ "degreeProgram").as[String]
            val otherDegree = (jsonReceived \ "otherDegree").asOpt[String]
            val graduate = (jsonReceived \ "graduate").as[String]
            val degreeExpected = (jsonReceived \ "degreeExpected").asOpt[String]

            val degreeExpectedSeason = (degreeExpected != None) match {
              case true => Option(DegreeExpected.withName(degreeExpected.get))
              case false => None
            }

            val graduationDate = (jsonReceived \ "graduationDate").asOpt[String]
            val graduationDateFound = (graduationDate != None) match {

              case true => Option(new SimpleDateFormat("MM/dd/yyyy").parse(graduationDate.get))
              case false => None
            }

            val userSchoolId = (jsonReceived \ "userSchoolId").as[String]

            val userSchool = new UserSchool(new ObjectId(userSchoolId), new ObjectId(associatedSchoolId), schoolName, Year.withName(gradeLevel), Degree.withName(degreeProgram), major, Graduated.withName(graduate),
              graduationDateFound, degreeExpectedSeason, None)
            UserSchool.updateUserSchool(userSchool)
            val userCreated = User.getUserProfile(new ObjectId(userId))
            Ok(write(RegistrationResults(userCreated.get, userSchool))).as("application/json").withSession("userId" -> userId)
          case false => Ok(write(userUpdate._2)).as("application/json")
        }

      case false => Ok(write("Please select an existing school or create your own one")).as("application/json")
    }
  }

  /**
   * Update User (VA)
   */
  private def updateUser(userJson: JsValue): (Boolean, String) = {
    val userId = (userJson \ "userId").as[String]
    val firstName = (userJson \ "firstName").as[String]
    val email = (userJson \ "mailId").asOpt[String]
    val lastName = (userJson \ "lastName").as[String]
    val userName = (userJson \ "username").as[String]
    val location = (userJson \ "location").as[String]
    val about = (userJson \ "aboutYourself").as[String]
    val cellNumber = (userJson \ "cellNumber").as[String]

    val canUserRegisterWithThisUsername = User.canUserRegisterWithThisUsername(userName)

    def canUserRegister: (Boolean, String) = {
      canUserRegisterWithThisUsername match {
        case false =>
          val currentUser = User.getUserProfile(new ObjectId(userId))
          (currentUser.get.userName == userName) match {
            case true => (true, "Register")
            case false => (false, "Username Already Exists")
          }

        case true => (true, "Register")

      }
    }

    val canRegister = (email != None) match {
      case true =>
        val canUserRegisterWithThisEmail = User.canUserRegisterWithThisEmail(email.get)
        canUserRegisterWithThisEmail match {
          case false => (false, "EmailId Already Exists")
          case true => canUserRegister

        }

      case false =>
        canUserRegister
    }

    val emailId = (email != None) match {
      case true => email.get
      case false => User.getUserProfile(new ObjectId(userId)).get.email
    }

    if (canRegister._1) {
      User.updateUser(new ObjectId(userId), firstName, lastName, userName, emailId, location, about, cellNumber)
    }
    canRegister
  }

  def registrationComplete: Action[AnyContent] = Action { implicit request =>
    val userId = request.session.get("userId").get
    val tokenFound = Token.findTokenByUserId(userId)
    Token.updateToken(tokenFound(0).tokenString)
    Cache.remove(userId)
    Ok
  }

  def getUserDataFromCache: Action[AnyContent] = Action { implicit request =>
    val cookieFound = request.cookies.get("Beamstream") //.get.value.split(" ")(0)
    cookieFound match {
      case None => Redirect("/signup")
      case Some(cookie) =>
        val userId = cookie.value.split(" ")(0)
        val userInfo: Option[JsValue] = Cache.getAs[JsValue](userId)
        val ipAddress = request.remoteAddress
        val location = FetchLocationUtil.getLocation(ipAddress)
        val locationJsonString = """{"location": """" + location + """"}"""
        val locationJson: JsValue = play.api.libs.json.Json.parse(locationJsonString)
        userInfo match {
          case None => Ok(Json.obj("data" -> locationJson))
          case Some(userData) => Ok(Json.obj("data" -> userData))
        }
    }
  }

  // Cancel Registration
  def cancelRegistration: Action[AnyContent] = Action { implicit request =>
    val cookieFound = request.cookies.get("Beamstream") //.get.value.split(" ")(0)
    cookieFound match {
      case None => Redirect("/signup").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
      case Some(cookie) =>
        val userId = cookie.value.split(" ")(0)
        val tokenFound = Token.findTokenByUserId(userId)
        User.removeUser(new ObjectId(userId))
        Token.removeToken(tokenFound.head)
        Redirect("/signup").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
    }
  }

  def isUserNameAvailable: Action[AnyContent] = Action { implicit request =>
        val userName = request.body.asJson
        userName match {
          case None => Ok("false").as("application/json")
          case Some(userName) =>
            val userNameToCheck = (userName \ "username").as[String]
            val isUserNameAvailable = User.canUserRegisterWithThisUsername(userNameToCheck)
            Ok(isUserNameAvailable.toString).as("application/json")
    }
  }
}

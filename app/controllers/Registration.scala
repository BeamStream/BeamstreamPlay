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
import java.util.GregorianCalendar

object Registration extends Controller {
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /**
   * Registration after Mail ((VA))
   */
  def registration = Action { implicit request =>

    (request.session.get("userId") == None) match {

      case true =>

        val token = request.queryString("token").toList(0)
        val userId = request.queryString("userId").toList(0)
        val tokenReceived = Token.findToken(token)
        if (tokenReceived.head.id == userId && tokenReceived.head.tokenString == token) {
          (tokenReceived.isEmpty) match {
            case false =>
              (tokenReceived.head.used == false) match {
                case true =>
                  Ok(views.html.registration(userId, None)).withSession("token" -> token)
                case false => Ok("This user has already been registered. Please login with your username and password or register using a new email address.")
              }

            case true =>
              Ok("Token not found")
          }
        } else {
          Redirect("/login")
        }
      case false =>
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
  }

  /**
   * renders the login page
   * @return
   */
  def loginPage = Action { implicit request =>
    (request.session.get("userId")) match {
      case None =>
        Ok(views.html.login())
      case Some(user) =>
        val userFound = User.getUserProfile(new ObjectId(request.session.get("userId").getOrElse("")))
        userFound match {
          case Some(user) => {
            user.classes.isEmpty match {
              case true => Redirect("/class")
              case false => Redirect("/stream")
            }
          }
          case None => Redirect("/signOut")
        }
    }
  }

  /**
   * User Registration In Detail (V)
   */
  def registerUser = Action { implicit request =>
    val jsonReceived = request.body.asJson.get

    val associatedSchoolId = (jsonReceived \ "associatedSchoolId").as[String]
    val schoolName = (jsonReceived \ "schoolName").as[String]

    School.findSchoolsById(new ObjectId(associatedSchoolId)).get.schoolName == schoolName match {
      case true =>

        val userUpdate = updateUser(jsonReceived)
        (userUpdate._1 == true) match {
          case true =>

            val userId = (jsonReceived \ "userId").as[String]
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

              case true => Option(new Date(graduationDate.get))
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
            val token = request.session.get("token").get
            Token.updateToken(token)

            Ok(write(RegistrationResults(userCreated.get, userSchool))).as("application/json").withSession("userId" -> userId)

          case false => Ok(write(userUpdate._2)).as("application/json")
        }

      case false => Ok(write("Please select an existing school or create your own one")).as("application/json")
    }
  }

  /**
   * User Registration In Detail (VA)
   */
  def editUserInfo(userId: String) = Action { implicit request =>

    val jsonReceived = request.body.asJson.get

    val associatedSchoolId = (jsonReceived \ "associatedSchoolId").as[String]
    val schoolName = (jsonReceived \ "schoolName").as[String]

    School.findSchoolsById(new ObjectId(associatedSchoolId)).get.schoolName == schoolName match {
      case true =>

        val userUpdate = updateUser(jsonReceived)
        (userUpdate._1 == true) match {
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

              case true => Option(new Date(graduationDate.get))
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

    def canUserRegister = {
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

    if (canRegister._1 == true) {
      User.updateUser(new ObjectId(userId), firstName, lastName, userName, emailId, location, about, cellNumber)
    }
    canRegister
  }
}

package controllers

import java.text.SimpleDateFormat
import org.bson.types.ObjectId
import actors.UtilityActor
import models.ResulttoSent
import models.User
import models.UserType
import net.liftweb.json.Serialization.write
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.ObjectIdSerializer
import utils.PasswordHashingUtil
import utils.TokenEmailUtil
import java.util.Date
import play.api.mvc.AnyContent
import play.api.mvc.DiscardingCookie
import play.api.mvc.Cookie
import models.Token
import play.api.Play
import models.UserMedia

object BasicRegistration extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter: SimpleDateFormat = new SimpleDateFormat("dd/MM/yyyy")
  } + new ObjectIdSerializer

  /**
   * ***************************************************** Re architecture ******************************
   */

  /**
   * SignUp Page Rendering (V)
   */
  def signUpPage: Action[AnyContent] = Action { implicit request =>
    (request.session.get("userId")) match {
      case None =>
        request.cookies.get("Beamstream") match {
          case None => Ok(views.html.signup()).discardingCookies(DiscardingCookie("Beamstream"))
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
              case _ => Redirect("/" + cookie.value.split(" ")(1))
            }
        }
      case Some(user) =>
        val userFound = User.getUserProfile(new ObjectId(request.session.get("userId").getOrElse((new ObjectId).toString())))
        userFound match {
          case Some(user) => {
            user.classes.isEmpty match {
              case true => Redirect("/class")
              case false => Redirect("/stream")
            }
          }
          case None => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
        }
    }
  }

  /**
   * Registering a new User to Beamstream
   */

  def signUpUser: Action[AnyContent] = Action { implicit request =>
    val userInfoJsonMap = request.body.asJson.get

    val iam = (userInfoJsonMap \ "iam").as[String]
    val emailId = (userInfoJsonMap \ "mailId").as[String]
    val password = (userInfoJsonMap \ "password").as[String]
    val confirmPassword = (userInfoJsonMap \ "confirmPassword").as[String]
    val encryptedPassword = (new PasswordHashingUtil).encryptThePassword(password)
    val encryptedConfirmPassword = (new PasswordHashingUtil).encryptThePassword(confirmPassword)
    val canUserRegister = User.canUserRegisterWithThisEmail(emailId)

    canUserRegister match {
      case true =>
        iam match {
          case "8080" => Ok(write(new ResulttoSent("Success", "This User Email Is Available to Register"))).as("application/json")
          case _ =>
            (encryptedPassword == encryptedConfirmPassword) match {
              case true =>
                val userToCreate = new User(new ObjectId, UserType.apply(iam.toInt), emailId, "", "", "",
                  Option(encryptedPassword), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
                val IdOfUserCreted = User.createUser(userToCreate)
                val createdUser = User.getUserProfile(IdOfUserCreted.get)
                UtilityActor.sendMailAfterUserSignsUp(IdOfUserCreted.get.toString, TokenEmailUtil.securityToken, emailId)
                Ok(write(new ResulttoSent("Success", "SignUp Successful"))).as("application/json")
              case false => Ok(write(new ResulttoSent("Failure", "Password Do Not Match"))).as("application/json")
            }
        }
      case false =>
        Ok(write(new ResulttoSent("Failure", "This User Email Is Already Taken"))).as("application/json")
    }
  }
}

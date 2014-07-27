package controllers

import org.bson.types.ObjectId
import actors.UtilityActor
import models.BetaUser
import models.ResulttoSent
import models.User
import net.liftweb.json.DefaultFormats
import net.liftweb.json.Serialization.write
import play.api.Logger
import play.api.mvc.Action
import play.api.mvc.Controller
import play.api.mvc.AnyContent

object JoinBeamStream extends Controller {

  implicit val formats = DefaultFormats

  /**
   *  Beta User Page Rendering & if session exists take the user directs to application
   */

  def betaUserRegistration: Action[AnyContent] = Action { implicit request =>
    try {
      request.cookies.get("PLAY_SESSION") match {
        case Some(cookie) =>
          val userId = request.session.get("userId").get
          val loggedInUser = User.getUserProfile(new ObjectId(userId))

          loggedInUser.get.schools.isEmpty match {
            case true => Ok(views.html.betaUser())
            case false =>
              loggedInUser.get.classes.isEmpty match {
                case true => Redirect("/class")
                case false => Redirect("/stream")
              }
          }

        case None => Ok(views.html.betaUser())
      }
    } catch {
      case ex: Exception =>
        Logger.debug(ex.toString);
        Ok(views.html.betaUser())
    }

  }

  /**
   *  Beta Users Registration(T)
   */
  def regsisterToBeamStreamBeta: Action[AnyContent] = Action { implicit request =>
    try {
      val userInfoJsonMap = request.body.asJson.get
      val emailId = (userInfoJsonMap \ "mailId").as[String]

      val betaUsersFound = BetaUser.findBetaUserbyEmail(emailId)
      (!betaUsersFound.isEmpty) match {
        case true => Ok(write(new ResulttoSent("Success", "You've been already added to the Beamstream's beta users list"))).as("application/json")
        case false =>
          val userToCreate = new BetaUser(new ObjectId, emailId)
          BetaUser.addBetaUser(userToCreate)
          UtilityActor.sendMailWhenBetaUserRegisters(userToCreate.emailId)
          Ok(write(new ResulttoSent("Success", "Allow To Register"))).as("application/json")
      }
    } catch {
      case ex: Exception => Logger.error("This error occurred while Registering User to Beta List :- ", ex)
      Ok(write(new ResulttoSent("Success", "You've been already added to the Beamstream's beta users list"))).as("application/json")
    }
  }

}

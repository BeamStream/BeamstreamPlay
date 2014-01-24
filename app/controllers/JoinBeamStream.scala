package controllers

import org.bson.types.ObjectId

import actors.UtilityActor
import models.BetaUser
import models.ResulttoSent
import models.User
import net.liftweb.json.DefaultFormats
import net.liftweb.json.Serialization.write
import play.api.mvc.Action
import play.api.mvc.Controller

object JoinBeamStream extends Controller {

  implicit val formats = DefaultFormats

  /**
   *  Beta User Page Rendering (V) & if session exists take the user directs to application
   */

  def betaUserRegistration = Action { implicit request =>
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

  }

  /**
   *  Beta Users Registration (V)
   */
  def regsisterToBeamStreamBeta = Action { implicit request =>
    val userInfoJsonMap = request.body.asJson.get
    val emailId = (userInfoJsonMap \ "mailId").as[String]
    val userToCreate = new BetaUser(new ObjectId, emailId)

    val betaUsersFound = BetaUser.findBetaUserbyEmail(emailId)
    (!betaUsersFound.isEmpty) match {
      case true => Ok(write(new ResulttoSent("Success", "You've been already added to the Beamstream's beta users list"))).as("application/json")
      case false =>
        BetaUser.addBetaUser(userToCreate)
        UtilityActor.sendMailWhenBetaUserRegisters(userToCreate.emailId)
        Ok(write(new ResulttoSent("Success", "Allow To Register"))).as("application/json")
    }
  }

}  
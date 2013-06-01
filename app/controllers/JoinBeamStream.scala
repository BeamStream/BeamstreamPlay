package controllers

import org.bson.types.ObjectId

import actors.UtilityActor
import models.BetaUser
import models.ResulttoSent
import net.liftweb.json.DefaultFormats
import net.liftweb.json.Serialization.write
import play.api.mvc.Action
import play.api.mvc.Controller

object JoinBeamStream extends Controller {

  implicit val formats = DefaultFormats

  /**
   *  Beta User Page Rendering (RA)
   */

  def betaUserRegistration = Action {
    Ok(views.html.betaUser())
  }

  /**
   *  Beta Users Registration (RA)
   */
  def regsisterToBeamStreamBeta = Action { implicit request =>
    val userInfoJsonMap = request.body.asJson.get
    val emailId = (userInfoJsonMap \ "mailId").as[String]
    // Create Beta User
    val userToCreate = new BetaUser(new ObjectId, emailId)

    val betaUsersFound = BetaUser.findBetaUserbyEmail(emailId)
    (!betaUsersFound.isEmpty) match {
      case true => Ok(write(new ResulttoSent("Success", "You've been already added to the Beamstream's beta users list"))).as("application/json")
      case false =>
        BetaUser.addBetaUser(userToCreate)
        UtilityActor.sendMailWhenBetaUserRegisters(userToCreate.emailId)
        val successJson = write(new ResulttoSent("Success", "Allow To Register"))
        Ok(successJson).as("application/json")
    }
  }

}  
package controllers
import play.api.mvc._
import models.ResulttoSent
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import models.BetaUser
import org.bson.types.ObjectId
import models.UserType
import actors.UtilityActor
import play.api.data._
import play.api.data.Forms._

object JoinBeamStream extends Controller {

  implicit val formats = DefaultFormats

  /**
   * Beta User Registration Form
   */
  val betaUserRegsitrationForm = Form("email" -> email)

  /**
   *  Beta User Page Rendering
   */

  def betaUserRegistration = Action {
    Ok(views.html.betaUser(betaUserRegsitrationForm, ""))
  }

  /**
   *  Beta Users Registration
   */
  def regsisterToBeamStreamBetaviaTeplate = Action { implicit request =>

    betaUserRegsitrationForm.bindFromRequest.fold(
      errors => BadRequest(views.html.betaUser(errors, "")),
      betaUserRegsitrationForm => {
        println(request.body.asFormUrlEncoded.get("email").toList(0))
        UtilityActor.sendMailWhenBetaUserRegisters(request.body.asFormUrlEncoded.get("email").toList(0))
        Ok(views.html.betaUser(JoinBeamStream.betaUserRegsitrationForm,  "Congratulations! You've been added to the Beamstream's beta users list"))
      })

  }

  
  
  /**
   *  Beta Users Registration
   */
  def regsisterToBeamStreamBeta = Action { implicit request =>

    val userInfoJsonMap = request.body.asFormUrlEncoded.get
    val emailId = userInfoJsonMap("email").toList(0)
    val userToCreate = new BetaUser(new ObjectId, emailId)

    val betaUsersFound = BetaUser.findBetaUserbyEmail(emailId)
    (!betaUsersFound.isEmpty) match {
      case true => Ok(write(new ResulttoSent("Success", "You've been already added to the Beamstream's beta users list")))
      case false =>
        BetaUser.addBetaUser(userToCreate)
        UtilityActor.sendMailWhenBetaUserRegisters(userToCreate.emailId)
        Ok(write(new ResulttoSent("Success", "Congratulations! You've been added to the Beamstream's beta users list")))
    }
  }
}
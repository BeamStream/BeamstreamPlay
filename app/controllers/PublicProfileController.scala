package controllers

import play.api.mvc.Controller
import java.text.SimpleDateFormat
import utils.ObjectIdSerializer
import play.api.mvc.Action
import models.Message
import org.bson.types.ObjectId
import net.liftweb.json.Serialization.{ read, write }
import models.Document
import play.api.mvc.AnyContent

object PublicProfileController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter: SimpleDateFormat = new SimpleDateFormat("dd/MM/yyyy")
  } + new ObjectIdSerializer

  /**
   * All Public Messages For A User
   */

  def getAllPublicMessagesForAUser(userId: String): Action[AnyContent] = Action { implicit request =>
    val messages = Message.getAllPublicMessagesForAUser(new ObjectId(userId))
    Ok(write(messages)).as("application/json")
  }

  /**
   * Get All Public Documents For A User
   */
  def getAllPublicDocumentForAUser(userId: String): Action[AnyContent] = Action { implicit request =>
    val publicDocsForAUser = Document.getAllPublicDocumentForAUser(new ObjectId(userId))
    Ok(write(publicDocsForAUser)).as("application/json")
  }

  /**
   * ******************************************Rearchitecture*************************************************
   */

  def renderProfilePage: Action[AnyContent] = Action { implicit request =>
    Ok(views.html.profile())
  }
}

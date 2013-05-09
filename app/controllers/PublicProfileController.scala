package controllers
import play.api.mvc.Controller
import java.text.SimpleDateFormat
import utils.ObjectIdSerializer
import play.api.mvc.Action
import models.Message
import org.bson.types.ObjectId
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import models.User
import models.Document

object PublicProfileController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("dd/MM/yyyy")
  } + new ObjectIdSerializer

  /**
   * All Public Messages For A User
   */

  def getAllPublicMessagesForAUser(userId: String) = Action { implicit request =>
    val messages = Message.getAllPublicMessagesForAUser(new ObjectId(userId))
    Ok(write(messages)).as("application/json")
  }

  /**
   * Get User Profile
   */
  //  def getPublicProfileOfAUser = Action { implicit request =>
  //    val userIdJsonMap = request.body.asFormUrlEncoded.get
  //    val userIdJson = userIdJsonMap("data").toList(0)
  //    val parsedUserIdjson = net.liftweb.json.parse(userIdJson)
  //    val userId = (parsedUserIdjson \ "userId").extract[String]
  //    val user = User.getUserProfile(new ObjectId(userId))
  //    Ok(write(User(user.id, user.userType, user.email, user.firstName, user.lastName.charAt(0).toString, user.userName, user.alias, "", user.orgName, user.location, user.socialProfile, List(), List(), List(), List(), List(), user.followers)))
  //  }

  /**
   * Get All Public Documents For A User
   */
  def getAllPublicDocumentForAUser(userId: String) = Action { implicit request =>
    val publicDocsForAUser = Document.getAllPublicDocumentForAUser(new ObjectId(userId))
    Ok(write(publicDocsForAUser)).as("application/json")
  }

  /**
   * ******************************************Rearchitecture*************************************************
   */

  def renderProfilePage = Action { implicit request =>
    Ok(views.html.profile())
  }
}
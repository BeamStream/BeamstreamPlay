package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import models.Stream
import play.api.data._
import play.api.data.Forms._
import org.bson.types.ObjectId
import play.api.libs.json.DefaultFormat
import net.liftweb.json.DefaultFormats
import models.Class

object JoinStream extends Controller {

  implicit val formats=DefaultFormats
  /*
   * User Joins a Stream 
   */
  
  def joinStream = Action { implicit request =>
    val classListJsonMap = request.body.asFormUrlEncoded.get
    val classJsonList = classListJsonMap("data").toList(0)
    val classJson = net.liftweb.json.parse(classJsonList)
    val classId = (classJson \ "id").extract[String]
    val streamId=Class.findClasssById(new ObjectId(classId)).streams(0)
    Stream.joinStream(streamId , new ObjectId(request.session.get("userId").get))
    Ok
  }

}
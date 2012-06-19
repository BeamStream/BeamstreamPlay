package controllers

import play.api._
import play.api.mvc._
import models.Stream
import play.api.data._
import play.api.data.Forms._
import models.UserDAO
import com.codahale.jerkson.Json
import org.bson.types.ObjectId
import net.liftweb.json.DefaultFormats
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import models.Class
import java.text.SimpleDateFormat
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import models.ClassType
import models.User

object Application extends Controller {

  val EnumList: List[Enumeration] = List(ClassType)
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new EnumerationSerializer(EnumList) + new ObjectIdSerializer

  def index = Action {
    Ok("This is BeamStream Application by Knoldus Software")
  }

  def streams = Action { implicit request =>
    Stream.obtainUser(new ObjectId(request.session.get("userId").get))

    Ok
  }

  /*
   * Creates a class and a new Stream
   */
  
  def newStream = Action { implicit request =>

    val classListJsonMap = request.body.asFormUrlEncoded.get
    val classJsonList = classListJsonMap("data").toList(0)
    val classList = net.liftweb.json.parse(classJsonList).extract[List[Class]]
    val listOfClassIds = Class.createClass(classList)
    User.addClassToUser(new ObjectId(request.session.get("userId").get), listOfClassIds)

    val classJson = net.liftweb.json.parse(classJsonList)
    val classTag = (classJson \ "classTag").extract[String]
    println(classTag)
    Ok
  }

}
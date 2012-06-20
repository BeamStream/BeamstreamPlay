package controllers
import play.api.mvc._
import play.api._
import play.api.data._
import play.api.data.Forms._
import models.School
import org.bson.types.ObjectId
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import java.text.SimpleDateFormat
import utils.EnumerationSerializer
import utils.ObjectIdSerializer

object SchoolController extends Controller {
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /*
 * Provides All School For a User
 */
  def getAllSchoolForAUser = Action { implicit request =>
    val userId = new ObjectId(request.session.get("userId").get)
    val schoolIdList = School.getAllSchoolforAUser(userId)
    val getAllSchoolsForAUser = School.getAllSchools(schoolIdList)
    val SchoolListJson = write(getAllSchoolsForAUser)
    Ok(SchoolListJson).as("application/json")
  }

  def getSchoolName = Action { implicit request =>
    println(request.body)
    val schoolIdJsonMap = request.body.asFormUrlEncoded.get
    val schoolId = schoolIdJsonMap("schoolId").toList(0)
    val schoolName = School.findSchoolsById(new ObjectId(schoolId))
    Ok(write(schoolName)).as("application/json")
  }

  /*
   * Sends the obtained fields value from html to model for saving it
   */

  def addSchool = Action { implicit request =>

    //    schoolForm.bindFromRequest.fold(
    //      errors => BadRequest(views.html.school(School.allSchools(), errors)),
    //      schoolForm => {
    //        School.addSchool(schoolForm)
    //        Redirect(routes.MessageController.messages)
    //      Ok
    //      })
    Ok
  }

}
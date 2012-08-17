package controllers
import play.api.mvc._
import play.api._
import play.api.data._
import play.api.data.Forms._
import models.UserSchool
import org.bson.types.ObjectId
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import java.text.SimpleDateFormat
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import models.School

object SchoolController extends Controller {
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /*
 * Provides All School For a User
 */
  def getAllSchoolForAUser = Action { implicit request =>
    val userId = new ObjectId(request.session.get("userId").get)
    val schoolIdList = UserSchool.getAllSchoolforAUser(userId)
    val getAllSchoolsForAUser = UserSchool.getAllSchools(schoolIdList)
    val SchoolListJson = write(getAllSchoolsForAUser)
    Ok(SchoolListJson).as("application/json")
    
  }

  /*
   * Returns school name by schoolId
   */

  def getSchoolName = Action { implicit request =>
    val schoolIdJsonMap = request.body.asFormUrlEncoded.get
    val schoolId = schoolIdJsonMap("schoolId").toList(0)
    val schoolName = School.findSchoolsById(new ObjectId(schoolId))
    Ok(write(schoolName)).as("application/json")
  }

  
  /*
   * All Schools From database
   * @Purpose: For autopopulate schools on school screen'
   */
  def getAllSchoolsForAutopopulate = Action { implicit request =>
    val allSchools = School.getAllSchools
    Ok(write(allSchools)).as("application/json")
  }
  
  
  /*
   * Get all user school
   * @Purpose :-  For implementing Edit Schools by a user
   */

   def getAllUserSchools = Action { implicit request =>
   
    Ok
  }
  
  
}
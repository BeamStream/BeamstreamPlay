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
import models.SchoolDAO
import com.mongodb.casbah.commons.MongoDBObject
import java.util.regex.Pattern

object SchoolController extends Controller {
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /**
   * Add a new school (RA)
   */
  def addANewSchool = Action { implicit request =>
    val schoolInfojsonMap = request.body.asJson.get
    val schoolName = (schoolInfojsonMap \ "schoolName").as[String]
    val schoolWebsite = (schoolInfojsonMap \ "schoolWebsite").as[String]
    val schools = School.findSchoolByName(schoolName)
    if (!schools.isEmpty) Ok(write("School Already Exists")).as("application/json")
    else {
      val schoolToCreate = new School(new ObjectId, schoolName, schoolWebsite)
      val schoolId = School.addNewSchool(schoolToCreate)
      Ok(write(schoolToCreate)).as("application/json")
    }
  }

  /**
   * Provides All School For a User (Duplicacy seen : exactly like /schoolJson)
   */
  def getAllSchoolForAUser = Action { implicit request =>
    val userId = new ObjectId(request.session.get("userId").get)
    val schoolIdList = UserSchool.getAllSchoolforAUser(userId)
    val getAllSchoolsForAUser = UserSchool.getAllSchools(schoolIdList)
    val SchoolListJson = write(getAllSchoolsForAUser)
    Ok(SchoolListJson).as("application/json")

  }

  /**
   * Returns school name by schoolId
   */

  def getSchoolName = Action { implicit request =>
    val schoolIdJsonMap = request.body.asFormUrlEncoded.get
    val schoolId = schoolIdJsonMap("schoolId").toList(0)
    val schoolName = School.findSchoolsById(new ObjectId(schoolId))
    Ok(write(schoolName)).as("application/json")
  }

  /**
   * All Schools From database
   * @Purpose: For autopopulate schools on school screen'
   */
  def getAllSchoolsForAutopopulate = Action { implicit request =>
    val schoolNameStartingStringJsonMap = request.body.asFormUrlEncoded.get
    val schoolNamesStartingCharacter = schoolNameStartingStringJsonMap("data").toList(0)
    val allSchools = School.getAllSchoolsFromDB(schoolNamesStartingCharacter)
    Ok(write(allSchools)).as("application/json")
  }

}
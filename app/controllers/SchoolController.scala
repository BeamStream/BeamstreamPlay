package controllers

import java.text.SimpleDateFormat
import org.bson.types.ObjectId
import models.School
import models.UserSchool
import net.liftweb.json.Serialization.write
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.ObjectIdSerializer

object SchoolController extends Controller {
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /**
   * Add a new school (V)
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
   * Provides All School For a User (RA)
   */
  def getAllSchoolForAUser = Action { implicit request =>
    try {
      val userId = new ObjectId(request.session.get("userId").get)
      val schoolIdList = UserSchool.getAllSchoolforAUser(userId)
      val getAllSchoolsForAUser = UserSchool.getAllSchools(schoolIdList)
      val SchoolListJson = write(getAllSchoolsForAUser)
      Ok(SchoolListJson).as("application/json")
    } catch {
      case exception => InternalServerError(write("There was some errors during fetching the schools")).as("application/json")

    }
  }

  /**
   * Returns school name by schoolId
   */

  def getSchoolName(schoolId: String) = Action { implicit request =>
    val school = School.findSchoolsById(new ObjectId(schoolId))
    Ok(write(school)).as("application/json")
  }

  /**
   * All Schools From database(V)
   * @Purpose: For auto populate schools on school screen'
   */
  def getAllSchoolsForAutopopulate = Action { implicit request =>
    try {
      val schoolNameStartingStringJsonMap = request.body.asFormUrlEncoded.get
      val schoolNamesStartingCharacter = schoolNameStartingStringJsonMap("data").toList(0)
      val allSchools = School.getAllSchoolsFromDB(schoolNamesStartingCharacter)
      Ok(write(allSchools)).as("application/json")
    } catch {
      case ex => InternalServerError(write("There was some errors while autopopulating schools")).as("application/json")
    }

  }
}
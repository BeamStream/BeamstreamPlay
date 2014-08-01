package controllers

import java.text.SimpleDateFormat

import org.bson.types.ObjectId

import models.School
import models.UserSchool
import net.liftweb.json.Serialization.write
import play.api.Logger
import play.api.mvc.Action
import play.api.mvc.AnyContent
import play.api.mvc.Controller
import utils.ObjectIdSerializer

object SchoolController extends Controller {
  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter: SimpleDateFormat = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer

  /**
   * Add a new school (V)
   */
  def addANewSchool: Action[AnyContent] = Action { implicit request =>
    val schoolInfojsonMap = request.body.asJson.get
    val schoolName = (schoolInfojsonMap \ "schoolName").as[String]
    val schoolWebsite = (schoolInfojsonMap \ "schoolWebsite").as[String]
    val schools = School.findSchoolByName(schoolName)
    schools.isEmpty match {
      case false => Ok(write("School Already Exists")).as("application/json")
      case true =>
        val schoolToCreate = new School(new ObjectId, schoolName, schoolWebsite)
        val schoolId = School.addNewSchool(schoolToCreate)
        School.allSchoolsInDatabase ++= List(schoolToCreate)
        Ok(write(schoolToCreate)).as("application/json")
    }
  }

  /**
   * Provides All School For a User (V)
   */
  def getAllSchoolForAUser: Action[AnyContent] = Action { implicit request =>
    try {
      val userId = new ObjectId(request.session.get("userId").get)
      val schoolIdList = UserSchool.getAllSchoolforAUser(userId)
      val getAllSchoolsForAUser = UserSchool.getAllSchools(schoolIdList)
      val SchoolListJson = write(getAllSchoolsForAUser)
      Ok(SchoolListJson).as("application/json")
    } catch {
      case exception: Throwable =>
        Logger.error("This error occurred while fetching all Schools of a User :- ", exception)
        InternalServerError("There was some errors during fetching the schools").as("application/json")

    }
  }

  /**
   * Returns school name by schoolId
   */

  def getSchoolName(schoolId: String): Action[AnyContent] = Action { implicit request =>
    val school = School.findSchoolsById(new ObjectId(schoolId))
    Ok(write(school)).as("application/json")
  }

  /**
   * All Schools From database(V)
   * Purpose: For auto populate schools on school screen'
   */
  def getAllSchoolsForAutopopulate: Action[AnyContent] = Action { implicit request =>
    val schoolNameStartingStringJsonMap = request.body.asFormUrlEncoded.get
    val schoolNamesStartingCharacter = schoolNameStartingStringJsonMap("data").toList(0)

    School.allSchoolsInDatabase.isEmpty match {
      case true =>
        val listOfAllSchools = School.getAllSchools
        School.allSchoolsInDatabase ++= listOfAllSchools

        Ok(write(returnedMatchedSchoolNames(schoolNamesStartingCharacter)))

      case false =>
        Ok(write(returnedMatchedSchoolNames(schoolNamesStartingCharacter)))

    }

  }

  private def returnedMatchedSchoolNames(schoolNamesStartingCharacter: String): List[School] = {
    val allSchools = School.allSchoolsInDatabase map {
      case school =>
        (school.schoolName.toLowerCase().startsWith(schoolNamesStartingCharacter.toLowerCase())) match {
          case true => Option(school)
          case _ => None
        }
    }
    val schoolsToBereturned = allSchools.filter(a => a != None)
    (schoolsToBereturned.isEmpty) match {
      case true => Nil
      case false =>
        schoolsToBereturned map {
          case school => school.get
        }
    }
  }
}

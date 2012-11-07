package models
import com.novus.salat.dao.SalatDAO
import com.novus.salat.annotations.Key
import com.novus.salat.global._
import org.bson.types.ObjectId
import utils.MongoHQConfig
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern
import java.util.regex.Pattern
case class School(@Key("_id") id: ObjectId, schoolName: String, schoolWebsite: String)

object School {

  /*
   * Add New School
   */

  def addNewSchool(school: School): ObjectId = {
    val schoolId = SchoolDAO.insert(school)
    schoolId.get
  }

  /*
   * Get All School for autopopulate school screen
   */

  def getAllSchoolsFromDB(patternReceived: String): List[School] = {
    val namePattern = Pattern.compile(patternReceived, Pattern.CASE_INSENSITIVE)
    SchoolDAO.find(MongoDBObject("schoolName" -> namePattern)).toList
  }

  /*
   * Find a school by Id
   */

  def findSchoolsById(schoolId: ObjectId): String = {
    val schoolName = SchoolDAO.find(MongoDBObject("_id" -> schoolId)).toList(0).schoolName
    schoolName
  }


  /*
   * Update the School
   * @Purpose : For Edit School Functionality
   */

  def updateSchool(schoolId: ObjectId, updatedSchoolname: String) {
    val school = SchoolDAO.find(MongoDBObject("_id" -> schoolId)).toList(0)
    SchoolDAO.update(MongoDBObject("_id" -> schoolId), school.copy(schoolName = updatedSchoolname), false, false, new WriteConcern)
  }
  
   /**
   * Find A School By Name
   */

  def findSchoolByName(schoolName: String) = {
    val schoolNamePattern = Pattern.compile(schoolName, Pattern.CASE_INSENSITIVE)
    SchoolDAO.find(MongoDBObject("schoolName" -> schoolNamePattern)).toList
  }

}

object SchoolDAO extends SalatDAO[School, ObjectId](collection = MongoHQConfig.mongoDB("school"))
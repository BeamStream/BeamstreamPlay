package models
import com.novus.salat.dao.SalatDAO
import com.novus.salat.annotations.Key
import com.novus.salat.global._
import org.bson.types.ObjectId
import utils.MongoHQConfig
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern
case class School(@Key("_id") id: ObjectId, schoolName: String)

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

  def getAllSchoolsFromDB(startsWith: String): List[School] = {
    val regexp = ("^" + startsWith).r
    SchoolDAO.find(MongoDBObject("schoolName" -> regexp)).toList
  }

  /*
   * Find a school by Id
   */

  def findSchoolsById(schoolId: ObjectId): String = {
    val schoolName = SchoolDAO.find(MongoDBObject("_id" -> schoolId)).toList(0).schoolName
    schoolName
  }

  /*
   * Find a school by name
   */

  def findSchoolByName(schoolName: String): List[School] = {
    val schools = SchoolDAO.find(MongoDBObject("schoolName" -> schoolName)).toList
    schools
  }

  /*
   * Update the School
   * @Purpose : For Edit School Functionality
   */

  def updateSchool(schoolId: ObjectId, updatedSchoolname: String) {
    val school = SchoolDAO.find(MongoDBObject("_id" -> schoolId)).toList(0)
    SchoolDAO.update(MongoDBObject("_id" -> schoolId), school.copy(schoolName = updatedSchoolname), false, false, new WriteConcern)
  }

}

object SchoolDAO extends SalatDAO[School, ObjectId](collection = MongoHQConfig.mongoDB("school"))
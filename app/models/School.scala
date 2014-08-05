package models

import com.novus.salat.dao.SalatDAO
import com.novus.salat.annotations.raw.Key
import org.bson.types.ObjectId
import utils.MongoHQConfig
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern
import java.util.regex.Pattern
import models.mongoContext._

case class School(@Key("_id") id: ObjectId,
  schoolName: String,
  schoolWebsite: String)

object School {

  var allSchoolsInDatabase: List[School] = Nil

  /**
   * Get all Schools
   */

  def getAllSchools: List[School] = {
    SchoolDAO.find(MongoDBObject()).toList
  }

  /**
   * Add New School (RA)
   */

  def addNewSchool(school: School): Option[ObjectId] = {
    SchoolDAO.insert(school)

  }

  /**
   * Get All School for autopopulate school screen (V)
   */

  def getAllSchoolsFromDB(patternReceived: String): List[School] = {
    val namePattern = Pattern.compile(patternReceived, Pattern.CASE_INSENSITIVE)
    SchoolDAO.find(MongoDBObject("schoolName" -> namePattern)).toList
  }

  /*
   * Find a school by Id
   */

  def findSchoolsById(schoolId: ObjectId): Option[School] = {
    val schoolFound = SchoolDAO.find(MongoDBObject("_id" -> schoolId)).toList
    schoolFound.isEmpty match {
      case true => None
      case false => Option(schoolFound.head)
    }

  }

  /**
   * Update the School
   * Purpose : For Edit School Functionality
   */

  def updateSchool(schoolId: ObjectId, updatedSchoolname: String) {
    val school = SchoolDAO.find(MongoDBObject("_id" -> schoolId)).toList(0)
    SchoolDAO.update(MongoDBObject("_id" -> schoolId), school.copy(schoolName = updatedSchoolname), false, false, new WriteConcern)
  }

  /**
   * Find A School By Name
   */

  def findSchoolByName(schoolName: String): List[School] = {
    val schoolNamePattern = Pattern.compile(schoolName, Pattern.CASE_INSENSITIVE)
    SchoolDAO.find(MongoDBObject("schoolName" -> schoolNamePattern)).toList
  }
  /**
   * is School already in database
   * param schoolId of the school to be searched
   */

  def isSchoolinDatabaseAlready(schoolId: ObjectId): List[School] = {
    SchoolDAO.find(MongoDBObject("_id" -> schoolId)).toList
  }
}

object SchoolDAO extends SalatDAO[School, ObjectId](collection = MongoHQConfig.mongoDB("school"))

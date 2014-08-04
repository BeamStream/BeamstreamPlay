package models

import com.novus.salat.annotations.raw.Key
import com.novus.salat.dao.SalatDAO
import com.mongodb.casbah.Imports._
import utils.MongoHQConfig
import java.util.Date
import net.liftweb.json.{ parse, DefaultFormats }
import models.mongoContext._

case class UserSchool(@Key("_id") id: ObjectId,
  assosiatedSchoolId: ObjectId,
  schoolName: String,
  year: Year.Value,
  degree: Degree.Value,
  major: String,
  graduated: Graduated.Value,
  graduationDate: Option[Date],
  degreeExpected: Option[DegreeExpected.Value],
  otherDegree: Option[String])

object UserSchool {

  implicit val formats = DefaultFormats

  /**
   * Get UserSchoolById
   */

  def getUserSchoolById(userSchoolId: ObjectId): Option[UserSchool] = {
    val userSchoolsFound = UserSchoolDAO.find(MongoDBObject("_id" -> userSchoolId)).toList
    userSchoolsFound.isEmpty match {
      case true => None
      case false => Option(userSchoolsFound.head)
    }
  }

  /**
   * Create a new User School (V)
   * @param userSchool is the DetailedInfo object to be stored
   */
  def createSchool(userSchool: UserSchool): Option[ObjectId] = {
    UserSchoolDAO.insert(userSchool)
  }
  /**
   * Removes a school
   * @param userSchool is the DetailedInfo object to be removed
   */
  def removeSchool(userSchool: UserSchool) {
    UserSchoolDAO.remove(userSchool)

  }

  /**
   * Get all school for a user
   * @param userId is the id of user
   */
  def getAllSchoolforAUser(userId: ObjectId): List[ObjectId] = {
    val userSchools = UserDAO.find(MongoDBObject("_id" -> userId)).toList
    (userSchools.isEmpty) match {
      case true => Nil
      case false => userSchools.head.schools
    }

  }

  /**
   * Update User School(For SchoolAutopoulate thing)
   */
  def updateUserSchoolWithOriginalSchoolId(userSchoolToUpdate: ObjectId, originalSchoolId: ObjectId) {
    val userSchool = UserSchoolDAO.find(MongoDBObject("_id" -> userSchoolToUpdate)).toList(0)
    UserSchoolDAO.update(MongoDBObject("_id" -> userSchoolToUpdate), userSchool.copy(assosiatedSchoolId = originalSchoolId), false, false, new WriteConcern)
  }

  /**
   * Get all schools List (V)
   */

  def getAllSchools(schoolsIdList: List[ObjectId]): List[UserSchool] = {
    schoolsIdList map { schoolId => UserSchoolDAO.find(MongoDBObject("_id" -> schoolId)).toList.head }
  }

  /**
   * Is user contains already the Coming School that he wants to Join
   */

  def isUserAlreadyContainsTheSchoolThatUserWantsToJoin(assosiatedSchoolId: ObjectId, userId: ObjectId): Boolean = {
    val userSchoolsIdListOfAUser = UserSchool.getAllSchoolforAUser(userId)

    userSchoolsIdListOfAUser.contains(assosiatedSchoolId)

  }

  /**
   * Update User School (V)
   */
  def updateUserSchool(userSchool: UserSchool) {
    UserSchoolDAO.update(MongoDBObject("_id" -> userSchool.id), userSchool, false, false, new WriteConcern)
  }
}

object Year extends Enumeration {

  val Freshman = Value(0, "Freshman")
  val Sophomore = Value(1, "Sophomore")
  val Junior = Value(2, "Junior")
  val Senior = Value(3, "Senior")
  val Graduated_Masters = Value(4, "Graduated(Master's)")
  val Graduated_Phd = Value(5, "Graduated(Phd)")
  val Other = Value(6, "Other")
}

object DegreeExpected extends Enumeration {
  val Winter2012 = Value(0, "Winter 2012")
  val Summer2013 = Value(1, "Summer 2013")
  val Winter2013 = Value(2, "Winter 2013")
  val Summer2014 = Value(3, "Summer 2014")
  val Winter2014 = Value(4, "Winter 2014")
  val Summer2015 = Value(5, "Summer 2015")
  val Winter2015 = Value(6, "Winter 2015")
  val Summer2016 = Value(7, "Summer 2016")
  val Winter2016 = Value(8, "Winter 2016")
  val Summer2017 = Value(9, "Summer 2017")
  val Winter2017 = Value(10, "Winter 2017")
  val Summer2018 = Value(11, "Summer 2018")
  val Winter2018 = Value(12, "Winter 2018")
  val NoDegreeExpected = Value(13, "No Degree Expected")

}

object Degree extends Enumeration {
  val Bachelors = Value(0, "Bachelor's")
  val Masters = Value(1, "Master's")
  val Assosiates = Value(2, "Associate's(AA)")
  val Doctorate = Value(3, "Doctorate(Phd)")
  val Other = Value(4, "Other")

}

object Graduated extends Enumeration {
  val Yes = Value(0, "yes")
  val No = Value(1, "no")
  val StillAttending = Value(2, "attending")

}

object UserSchoolDAO extends SalatDAO[UserSchool, ObjectId](collection = MongoHQConfig.mongoDB("userschool"))

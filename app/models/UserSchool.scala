package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import org.joda.time.DateTime
import org.bson.types.ObjectId
import utils.MongoHQConfig
import java.util.Date
import java.text.DateFormat
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }

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

  def getUserSchoolById(userSchoolId: ObjectId): UserSchool = {
    UserSchoolDAO.find(MongoDBObject("_id" -> userSchoolId)).toList.head
  }

  /*
    * Method for creating a school (For SchoolAutopoulate thing)
    * 
    * @Purpose : Will Edit The schools as well with Creation
    */

  //  def createSchool(userSchools: List[UserSchool], userId: ObjectId): ResulttoSent = {
  //
  //    var resultToSend = new ResulttoSent("", "")
  //
  //    if (UserSchool.duplicateSchoolExistesInSubmittedList(userSchools) == true) {
  //      resultToSend = ResulttoSent("Failure", "Do Not Enter The Same School Twice")
  //      resultToSend
  //    } else {
  //      for (userSchool <- userSchools) {
  //        val userSchoolObtained = UserSchool.userSchoolsForAUser(userSchool.id)
  //        if (userSchoolObtained.size == 1) {
  //          UserSchoolDAO.update(MongoDBObject("_id" -> userSchool.id), userSchool, false, false, new WriteConcern)
  //          resultToSend = ResulttoSent("Success", "Schools Updated Successfully")
  //          println("CheckPoint 1")
  //        } else if (isUserAlreadyContainsTheSchoolThatUserWantsToJoin(userSchool.assosiatedSchoolId, userId) == true) {
  //          resultToSend = ResulttoSent("Success", "You've already Joined The  School") //#413
  //          println("CheckPoint 2")
  //        } else {
  //          UserSchoolDAO.insert(userSchool)
  //          resultToSend = ResulttoSent("Success", "Schools Added Successfully")
  //          println("CheckPoint 3")
  //        }
  //      }
  //      resultToSend
  //    }
  //
  //  }

  /**
   * Create a new User School (RA)
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
   * Get UserSchool
   * @param userSchoolId is the id of user school to be searched
   */

  def userSchoolsForAUser(userSchoolId: ObjectId): List[UserSchool] = {
    UserSchoolDAO.find(MongoDBObject("_id" -> userSchoolId)).toList
  }

  /**
   * Get all school for a user
   * @param userId is the id of user
   */
  def getAllSchoolforAUser(userId: ObjectId): List[ObjectId] = {
    UserDAO.find(MongoDBObject("_id" -> userId)).toList.head.schools
  }

  /**
   * Update User School(For SchoolAutopoulate thing)
   */
  def updateUserSchoolWithOriginalSchoolId(userSchoolToUpdate: ObjectId, originalSchoolId: ObjectId) {
    val userSchool = UserSchoolDAO.find(MongoDBObject("_id" -> userSchoolToUpdate)).toList(0)
    UserSchoolDAO.update(MongoDBObject("_id" -> userSchoolToUpdate), userSchool.copy(assosiatedSchoolId = originalSchoolId), false, false, new WriteConcern)
  }

  /**
   * get all schools List
   */

  def getAllSchools(schoolsIdList: List[ObjectId]): List[UserSchool] = {
    schoolsIdList map { schoolId => UserSchoolDAO.find(MongoDBObject("_id" -> schoolId)).toList.head }
  }

  /**
   * Is user contains already the Coming School that he wants to Join
   */

  def isUserAlreadyContainsTheSchoolThatUserWantsToJoin(assosiatedSchoolId: ObjectId, userId: ObjectId): Boolean = {
    var statusToreturn = false
    val userSchoolsIdListOfAUser = UserSchool.getAllSchoolforAUser(userId)
   
    (!userSchoolsIdListOfAUser.isEmpty) match {
      case true =>
        val userSchoolsOfAUser = UserSchool.getAllSchools(userSchoolsIdListOfAUser)
        for (userSchool <- userSchoolsOfAUser) {
          if (userSchool.assosiatedSchoolId == assosiatedSchoolId) statusToreturn = true
        }
        statusToreturn
      case false => statusToreturn
    }

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
  val NoDegreeExpected = Value(7, "No Degree Expected")
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
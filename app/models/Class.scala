package models

import org.joda.time.DateTime
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import com.mongodb.casbah.commons.conversions.scala._
import org.bson.types.ObjectId
import utils.MongoHQConfig
import java.util.Date
import java.util.regex.Pattern
import java.text._
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import utils.ObjectIdSerializer
import utils.SendEmailUtility
import actors.UtilityActor

case class Class(@Key("_id") id: ObjectId,
  classCode: String,
  className: String,
  classType: ClassType.Value,
  classTime: String,
  startingDate: Date,
  schoolId: ObjectId,
  streams: List[ObjectId])

object Class {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
  implicit val formats = DefaultFormats

  /**
   * Delete A Class
   * @Purpose Delete A Class
   */
  def deleteClass(myclass: Class): Unit = {
    ClassDAO.remove(myclass)
  }

  /**
   * Finding the class by Code (RA)
   */

  def findClassByCode(code: String, schoolId: ObjectId): List[ClassWithNoOfUsers] = {
    val codePattern = Pattern.compile("^" + code, Pattern.CASE_INSENSITIVE)
    var classesWithNoofUsers: List[ClassWithNoOfUsers] = List()
    val classFound = ClassDAO.find(MongoDBObject("schoolId" -> schoolId, "classCode" -> codePattern)).toList
    (classFound.isEmpty) match {
      case true =>
      case false =>
        for (eachClass <- classFound) {
          val stream = Stream.findStreamById(eachClass.streams(0))
          val mapOfUsersAttendingTheClassSeparatedbyCatagory = User.countRolesOfAUser(stream.usersOfStream)
          classesWithNoofUsers ++= List(ClassWithNoOfUsers(mapOfUsersAttendingTheClassSeparatedbyCatagory, eachClass))
        }
    }
    classesWithNoofUsers
  }

  /**
   * Finding the class by Time
   */

  def findClassByTime(time: String): List[Class] = {
    val regexp = (""".*""" + time + """.*""").r
    for (theclass <- ClassDAO.find(MongoDBObject("classTime" -> regexp)).toList) yield theclass
  }

  /**
   * Find a class by Id (RA)
   */

  def findClasssById(classId: ObjectId): Option[Class] = {
    val classFound = ClassDAO.find(MongoDBObject("_id" -> classId)).toList
    (classFound.isEmpty.equals(false)) match {
      case true => Option(classFound.head)
      case false => None
    }
  }

  /**
   * Get all classes for a user (RA)
   */
  def getAllClassesIdsForAUser(userId: ObjectId): List[ObjectId] = {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    user.classes
  }

  /**
   * get all class List (RA)
   */

  def getAllClasses(classIdList: List[ObjectId]): List[Class] = {
    var classList: List[Class] = List()
    for (classId <- classIdList) {
      val classObtained = ClassDAO.find(MongoDBObject("_id" -> classId)).toList
      classList ++= classObtained
    }
    classList
  }

  /**
   * @Purpose :   Getting All Classes for a user
   *
   */
  def getAllClassesForAUser(userId: ObjectId): List[Class] = {
    val classesIdsOfAUser = Class.getAllClassesIdsForAUser(userId)
    val classesOfAUser = getAllClasses(classesIdsOfAUser)
    classesOfAUser
  }

  /**
   * Get All Refreshed Classes
   */

  def getAllRefreshedClasss(classes: List[Class]): List[Class] = {
    var classList: List[Class] = List()
    for (eachClass <- classes) {
      val classObtained = ClassDAO.find(MongoDBObject("_id" -> eachClass.id)).toList
      classList ++= classObtained
    }
    classList
  }

  /**
   * ********************************************** Re architecture ****************************************
   */
  def createClass(classCreated: Class, userId: ObjectId) {
    val classId = ClassDAO.insert(classCreated)
    User.addClassToUser(userId, List(classId.get))
    // Create the Stream for this class
    val streamToCreate = new Stream(new ObjectId, classCreated.className, StreamType.Class, userId, List(userId), true, List())
    val streamId = Stream.createStream(streamToCreate)
    Stream.attachStreamtoClass(streamId, classId.get)
    val user = User.getUserProfile(userId)
    UtilityActor.sendEmailAfterStreamCreation(user.get.email, classCreated.className, true)
  }

  /**
   * Find the class by name with no of users return (RA)
   */

  def findClassByName(name: String, schoolId: ObjectId): List[ClassWithNoOfUsers] = {
    val namePattern = Pattern.compile("^" + name, Pattern.CASE_INSENSITIVE)
    var classesWithNoofUsers: List[ClassWithNoOfUsers] = List()
    val classFound = ClassDAO.find(MongoDBObject("schoolId" -> schoolId, "className" -> namePattern)).toList
    (classFound.isEmpty) match {
      case true =>
      case false =>
        for (eachClass <- classFound) {
          val stream = Stream.findStreamById(eachClass.streams(0))
          val mapOfUsersAttendingTheClassSeparatedbyCatagory = User.countRolesOfAUser(stream.usersOfStream)
          classesWithNoofUsers ++= List(ClassWithNoOfUsers(mapOfUsersAttendingTheClassSeparatedbyCatagory, eachClass))
        }
    }
    classesWithNoofUsers
  }

}

object ClassType extends Enumeration {
  val Semester = Value(0, "semester")
  val Quarter = Value(1, "quarter")
  val Yearly = Value(2, "yearly")
}

object ClassDAO extends SalatDAO[Class, ObjectId](collection = MongoHQConfig.mongoDB("class"))
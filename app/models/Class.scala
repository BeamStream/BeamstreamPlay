package models

import java.text.DateFormat
import java.util.Date
import java.util.regex.Pattern

import org.bson.types.ObjectId

import com.mongodb.casbah.commons.MongoDBObject
import com.novus.salat.dao.SalatDAO
import com.novus.salat.annotations.raw.Key

import actors.UtilityActor
import models.mongoContext.context
import net.liftweb.json.DefaultFormats
import utils.MongoHQConfig

case class Class(@Key("_id") id: ObjectId,
  classCode: String,
  className: String,
  classType: ClassType.Value,
  classTime: String,
  startingDate: Date,
  schoolId: ObjectId,
  weekDays:List[String],
  streams: List[ObjectId])

object Class {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
  implicit val formats = DefaultFormats

  /**
   * Delete A Class
   * Purpose Delete A Class
   */
  def deleteClass(classToBeRemoved: Class): Unit = {
    ClassDAO.remove(classToBeRemoved)
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
    UserDAO.find(MongoDBObject("_id" -> userId)).toList.head.classes
  }

  /**
   * get all class List (RA)
   */

  def getAllClasses(classIdList: List[ObjectId]): List[Class] = {
    classIdList map { classId => ClassDAO.find(MongoDBObject("_id" -> classId)).toList(0) }
  }

  /**
   * Purpose :   Getting All Classes for a user
   *
   */
  def getAllClassesForAUser(userId: ObjectId): List[Class] = {
    val classesIdsOfAUser = Class.getAllClassesIdsForAUser(userId)
    getAllClasses(classesIdsOfAUser)
  }

  /**
   * ********************************************** Re architecture ****************************************
   */

  /**
   * Create class (V)
   */
  def createClass(classCreated: Class, userId: ObjectId): ObjectId = {
    val classId = ClassDAO.insert(classCreated)
    User.addClassToUser(userId, List(classId.get))
    // Create the Stream for this class
    val streamToCreate = Stream(new ObjectId, classCreated.className, StreamType.Class, userId, List(userId), true, Nil)
    val streamId = Stream.createStream(streamToCreate)
    Stream.attachStreamtoClass(streamId.get, classId.get)
    val user = User.getUserProfile(userId)
    UtilityActor.sendEmailAfterStreamCreation(user.get.email, classCreated.className, true)
    streamId.get
  }

  private def classWithNoOfUsers(classes: List[Class]): List[ClassWithNoOfUsers] = {
    classes map {
      eachClass =>
        val stream = Stream.findStreamById(eachClass.streams(0))
        val mapOfUsersAttendingTheClassSeparatedbyCatagory = User.countRolesOfAUser(stream.get.usersOfStream)
        ClassWithNoOfUsers(mapOfUsersAttendingTheClassSeparatedbyCatagory, eachClass)
    }
  }

  /**
   * Find the class by name with no of users return (RA)
   */

  def findClassByName(name: String, schoolId: ObjectId): List[ClassWithNoOfUsers] = {
    val namePattern = Pattern.compile(name, Pattern.CASE_INSENSITIVE)
    val classesFound = ClassDAO.find(MongoDBObject("schoolId" -> schoolId, "className" -> namePattern)).toList

    classesFound.isEmpty match {
      case true =>
        val mixNamePattern = Pattern.compile(name, Pattern.CASE_INSENSITIVE)
        val classesFoundThen = ClassDAO.find(MongoDBObject("schoolId" -> schoolId, "className" -> namePattern)).toList
        classWithNoOfUsers(classesFoundThen)
      case false =>
        classWithNoOfUsers(classesFound)
    }

  }

  /**
   * Finding the class by Code (RA)
   */

  def findClassByCode(code: String, schoolId: ObjectId): List[ClassWithNoOfUsers] = {
    val codePattern = Pattern.compile(code, Pattern.CASE_INSENSITIVE)
    val classesFound = ClassDAO.find(MongoDBObject("schoolId" -> schoolId, "classCode" -> codePattern)).toList
    classesFound.isEmpty match {
      case true =>
        val mixCodePattern = Pattern.compile(code, Pattern.CASE_INSENSITIVE)
        val classesFoundThen = ClassDAO.find(MongoDBObject("schoolId" -> schoolId, "className" -> mixCodePattern)).toList
        classWithNoOfUsers(classesFoundThen)
      case false =>
        classWithNoOfUsers(classesFound)
    }
  }
}

object ClassType extends Enumeration {
  val Semester = Value(0, "semester")
  val Quarter = Value(1, "quarter")
  val Yearly = Value(2, "yearly")
}

object ClassDAO extends SalatDAO[Class, ObjectId](collection = MongoHQConfig.mongoDB("class"))

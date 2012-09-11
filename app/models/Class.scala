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
import java.text._
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }

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

  /*
   * Create the new Classes
   */
  def createClass(classList: List[Class], userId: ObjectId): List[ObjectId] = {

    /*
 * Check if the duplicate code exists in database
 * @if yes then return true else return false
 * Local Function for duplication removal
 */

    /*
   * is Duplicate Class Exists In List (Local Function)
   */
    def duplicateClassExistesInSubmittedList(classList: List[Class]): Boolean = {
      var classFetchCount: Int = 0
      for (eachClass <- classList) {
        val classFetchedbyFilteringClassCode = classList.filter(x => x.classCode == eachClass.classCode)
        val classFetchedbyFilteringClassName = classList.filter(x => x.className == eachClass.className)
        if (classFetchedbyFilteringClassCode.size > 1 || classFetchedbyFilteringClassName.size > 1) classFetchCount += 1
      }

      if (classFetchCount == 0) false else true
    }

    //Class Creation Starts Here by calling the duplicate code validation method
    if (duplicateClassExistesInSubmittedList(classList) == true) List()

    else {

      var classIdList: List[ObjectId] = List()

      for (eachclass <- classList) {
        //        println(eachclass.schoolId + "schoolId")
        //        val eligiblilityStatus = UserSchool.isUserEligibleForJoinAStream(userId, eachclass.schoolId)
        //        println("eligibility Status" + eligiblilityStatus)
        //        if (!getClassByCode(eachclass).isEmpty && eligiblilityStatus == true) {
        //          println("Join Stream Case")
        //          Stream.joinStream(getClassByCode(eachclass)(0).streams(0), userId)
        //          classIdList ++= List(getClassByCode(eachclass)(0).id)
        //        } 

        val classesobtained = Class.findClassListById(eachclass.id)
        if (!classesobtained.isEmpty) {
          println("Join Stream Case")
          Stream.joinStream(classesobtained(0).streams(0), userId)
          classIdList ++= List(getClassByCode(eachclass)(0).id)
        } else {
          println("Create class Case")
          //Insert then class
          val classId = ClassDAO.insert(eachclass)
          classIdList ++= List(new ObjectId(classId.get.toString))
          // Create the Stream for this class
          val streamToCreate = new Stream(new ObjectId, eachclass.className, StreamType.Class, userId, List(userId), true, List())
          val streamId = Stream.createStream(streamToCreate)
          Stream.attachStreamtoClass(streamId, new ObjectId(classId.get.toString))
        }
      }
      classIdList
    }

  }

  /*
   * Removes a class
   */
  def deleteClass(myclass: Class) {
    ClassDAO.remove(myclass)
  }

  /*
   * Finding the class by Name
   */

  def findClassByName(name: String): List[Class] = {
    val regexp = (""".*""" + name + """.*""").r
    for (theclass <- ClassDAO.find(MongoDBObject("className" -> regexp)).toList) yield theclass
  }

  /*
   * Finding the class by Code
   */

  def findClassByCode(code: String, schoolId: ObjectId): List[Class] = {
    val regexp = ("^" + code).r
    var classes: List[Class] = List()
    val classFound = ClassDAO.find(MongoDBObject("schoolId" -> schoolId, "classCode" -> regexp)).toList
    (classFound.isEmpty) match {
      case true =>
      case false => classes ++= classFound
    }
    classes
  }

  /*
   * Finding the class by Code
   */

  def findClassByName(name: String, schoolId: ObjectId): List[Class] = {
    val regexp = ("^" + name).r
    var classes: List[Class] = List()
    val classFound = ClassDAO.find(MongoDBObject("schoolId" -> schoolId, "className" -> regexp)).toList
    (classFound.isEmpty) match {
      case true =>
      case false => classes ++= classFound
    }
    classes
  }

  /*
   * Get class by code
   * 
   */
  def getClassByCode(classToSearch: Class): List[Class] = {
    val classesFetched = ClassDAO.find(MongoDBObject("classCode" -> classToSearch.classCode)).toList
    classesFetched
  }

  /*
   * Finding the class by Time
   */

  def findClassByTime(time: String): List[Class] = {
    val regexp = (""".*""" + time + """.*""").r
    for (theclass <- ClassDAO.find(MongoDBObject("classTime" -> regexp)).toList) yield theclass
  }

  /*
   * Find a class by Id
   */

  def findClasssById(classId: ObjectId): Class = {
    val classObtained = ClassDAO.find(MongoDBObject("_id" -> classId)).toList(0)
    classObtained
  }

  /*
   * Find a class List by Id
   */

  def findClassListById(classId: ObjectId): List[Class] = {
    val classObtained = ClassDAO.find(MongoDBObject("_id" -> classId)).toList
    classObtained
  }

  /*
   * Get all classes for a user
   */
  def getAllClassesIdsForAUser(userId: ObjectId): List[ObjectId] = {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    user.classId

  }

  /*
   * get all class List
   */

  def getAllClasses(classIdList: List[ObjectId]): List[Class] = {
    var classList: List[Class] = List()
    for (classId <- classIdList) {
      val classObtained = ClassDAO.find(MongoDBObject("_id" -> classId)).toList
      classList ++= classObtained
    }
    classList
  }

  /*
   * @Purpose :   Getting All Classes for a user
   * 
   */
  def getAllClassesForAUser(userId: ObjectId): List[Class] = {
    val classesIdsOfAUser = Class.getAllClassesIdsForAUser(userId)
    val classesOfAUser = getAllClasses(classesIdsOfAUser)
    classesOfAUser
  }

}

object ClassType extends Enumeration {
  val Semester = Value(0, "semester")
  val Quarter = Value(1, "quarter")
  val Yearly = Value(2, "yearly")
}

object ClassDAO extends SalatDAO[Class, Int](collection = MongoHQConfig.mongoDB("class"))
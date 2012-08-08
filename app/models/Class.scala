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
    def duplicateExistes(classList: List[Class]): Boolean = {
      var classesFetchCount: Int = 0
      for (eachClass <- classList) {
        val classesFetched = ClassDAO.find(MongoDBObject("classCode" -> eachClass.classCode)).toList
        if (!classesFetched.isEmpty) classesFetchCount += 1
      }
      if (classesFetchCount == 0) false else true
    }
    
    //Class Creation Starts Here by calling the duplicate code validation method
    
    if (duplicateExistes(classList) == true) List()

    else {

      var classIdList: List[ObjectId] = List()
      for (eachclass <- classList) {
        //Insert then class
        val classId = ClassDAO.insert(eachclass)
        classIdList ++= List(new ObjectId(classId.get.toString))

        // Create the Stream for this class
        val streamToCreate = new Stream(new ObjectId, eachclass.className, StreamType.Class, userId, List(userId), true, List())
        val streamId = Stream.createStream(streamToCreate)
        Stream.attachStreamtoClass(streamId, new ObjectId(classId.get.toString))
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

  //  /*
  //   * Finding the class by Code
  //   */
  //
  //  def findClassByCode(code : String): List[Class] = {
  //    val regexp = (""".*""" + code + """.*""").r
  //    for (theclass <- ClassDAO.find(MongoDBObject("classCode" -> regexp)).toList) yield theclass
  //  }

  /*
   * Finding the class by Code
   */

  def findClassByCode(code: String, userSchoolIdList: List[ObjectId]): List[Class] = {
    var classes: List[Class] = List()
    for (userSchoolId <- userSchoolIdList) {
      val userSchool = UserSchool.getUserSchoolById(userSchoolId)
      val classFound = ClassDAO.findOne(MongoDBObject("schoolId" -> userSchool.assosiatedSchoolId))
      (classFound.isEmpty) match {
        case true =>
        case false => classes ++= classFound
      }

    }
    classes
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

}

object ClassType extends Enumeration {
  val Semester = Value(0, "semester")
  val Quarter = Value(1, "quarter")
  val Yearly = Value(2, "yearly")
}

object ClassDAO extends SalatDAO[Class, Int](collection = MongoHQConfig.mongoDB("class"))
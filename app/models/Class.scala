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

case class Class(@Key("_id") id: ObjectId, classCode: String, className: String, classType: ClassType.Value, classTime: String, startingDate: Date, schoolId: ObjectId, streams: List[ObjectId])

object Class {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
  implicit val formats = DefaultFormats

  /*
 * Will display all class types on html form
 */

  def classtypes: Seq[(String, String)] = {
    val classes = for (value <- ClassType.values) yield (value.id.toString, value.toString)
    classes.toSeq
  }

  /*
 * Displays the all existing School list
 */

  def schoolnames: Seq[(String, String)] = {
    val school = SchoolDAO.find(MongoDBObject("schoolName" -> ".*".r))
    val schools = for (value <- school) yield (value.id.toString, value.schoolName)
    schools.toSeq
  }

  /*
   * Create the new Classes
   */
  def createClass(classList: List[Class]): List[ObjectId] = {
    var classIdList: List[ObjectId] = List()
    for (eachclass <- classList) {

      //Insert then class
      val classId = ClassDAO.insert(eachclass)
      val classObjectId = new ObjectId(classId.get.toString)
      classIdList ++= List(classObjectId)

    }
    classIdList
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

  def findClassByCode(code: String, schoolIdList: List[ObjectId]): List[Class] = {
    var classes: List[Class] = List()
    for (schoolId <- schoolIdList) {
      val classFound = ClassDAO.findOne(MongoDBObject("schoolId" -> schoolId))

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

}

object ClassType extends Enumeration {
  val Semester = Value(0, "semester")
  val Quarter = Value(1, "quarter")
  val Yearly = Value(2, "yearly")
}

object ClassDAO extends SalatDAO[Class, Int](collection = MongoHQConfig.mongoDB("class"))
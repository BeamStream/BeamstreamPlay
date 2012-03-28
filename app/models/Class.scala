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

case class Class(@Key("_id") id: ObjectId, classCode: String, className: String, classType: ClassType.Value, classDate: String, schoolId: ObjectId,streams:List[ObjectId])
case class ClassForm(className: String, classCode: String, classType: String, schoolId: String)

object Class {

  /*
   * Add a new class and make an entry of the same in the coming School's classes list
   */
  def addClass(classForm: ClassForm) {
    val myClass = Class(new ObjectId, classForm.classCode, classForm.className, ClassType.apply(classForm.classType.toInt), "12 Mar", new ObjectId(classForm.schoolId),List())
    Class.createClass(myClass)
    School.addClasstoSchool(new ObjectId(classForm.schoolId), myClass)

  }
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

  //    RegisterConversionHelpers
  //    RegisterJodaTimeConversionHelpers

  /*
   * Create a new Class
   */
  def createClass(myclass: Class) {
    ClassDAO.insert(myclass)
  }

  /*
   * Removes a class
   */
  def deleteClass(myclass: Class) {
    ClassDAO.remove(myclass)
  }
  
  /*
   * Attach a Stream to a Class
   */
  def attachStreamtoClass(streamId:ObjectId,classId:ObjectId){
    val expectedClass = ClassDAO.find(MongoDBObject("_id" -> classId)).toList(0)
    ClassDAO.update(MongoDBObject("_id" -> classId), expectedClass.copy(streams = (expectedClass.streams ++ List(streamId))), false, false, new WriteConcern)
  }
  
  /*
   * Finding the class by Name
   */
  
  def findClassByName(name: String): List[Class] = {
    val regexp = (""".*""" + name + """.*""").r
    for (theclass <- ClassDAO.find(MongoDBObject("className" -> regexp)).toList) yield theclass
  }
}

object ClassType extends Enumeration {
  val Semester = Value(0, "Semester")
  val Quarter = Value(1, "Quarter")
  val Yearly = Value(2, "Yearly")

}

object ClassDAO extends SalatDAO[Class, Int](collection = MongoConnection()("beamstream")("class"))
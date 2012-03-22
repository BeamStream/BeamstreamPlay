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

case class Class(@Key("_id") id: ObjectId, classCode: Int, className: String, classType: ClassType.Value, classDate: String,schoolId:ObjectId)
case class ClassForm(className:String,classCode:Int,classType:String,schoolId:String)

object Class {
  
  def addClass(classForm:ClassForm){
   
    val myClass =Class(new ObjectId,classForm.classCode,classForm.className,ClassType.apply(classForm.classType.toInt),"12 Mar",new ObjectId(classForm.schoolId))
    Class.createClass(myClass)
    School.addClasstoSchool(new ObjectId(classForm.schoolId),myClass)
    
  
  }

   def classtypes: Seq[(String, String)] = {
    val c = for (value <- ClassType.values) yield (value.id.toString, value.toString)  
    c.toSeq
    
  }
   
 def schoolnames: Seq[(String, String)] = {
   val school=SchoolDAO.find(MongoDBObject("schoolName" -> ".*".r))
   val c = for (value <- school) yield (value.id.toString, value.schoolName)  
   c.toSeq
   }
  
  //    RegisterConversionHelpers
  //    RegisterJodaTimeConversionHelpers

  def createClass(myclass: Class) {
    ClassDAO.insert(myclass)
  }

  def deleteClass(myclass: Class) {
    ClassDAO.remove(myclass)
  }
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
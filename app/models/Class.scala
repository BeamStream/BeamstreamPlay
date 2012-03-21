package models

import org.joda.time.DateTime
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import com.mongodb.casbah.commons.conversions.scala._

case class Class(@Key("_id") id: ObjectId, classCode: Int, className: String, classType: ClassType.Value, classDate: String)
case class ClassForm(className:String,classCode:Int,classType:String,schoolName:String)

object Class {
  
  def addClass(classForm:ClassForm){
    print(classForm.classCode)
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
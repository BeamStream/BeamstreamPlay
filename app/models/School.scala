package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import org.joda.time.DateTime

case class School(@Key("_id") id: ObjectId, schoolName: String,classes:List[Class])
case class SchoolForm(schoolName:String)
object School {
  
   val myDate = DateTime.now.toString()
   val class1 = Class(new ObjectId, 201, "IT", ClassType.Quarter, myDate)

  
  def all(): List[School] = Nil
  def addSchool(schoolForm: SchoolForm) {
    School.createSchool(new School(new ObjectId,schoolForm.schoolName,List(class1)))
  
  }
  
  def createSchool(school:School){
    SchoolDAO.insert(school)
  }
  
  def removeSchool(school:School){
    SchoolDAO.remove(school)
  }
  
  def findSchoolsByName(name:String):List[School] = {
    val regexp = (""".*""" + name + """.*""").r
    for (school <- SchoolDAO.find(MongoDBObject("schoolName" -> regexp)).toList) yield school 
  }

}

object SchoolDAO extends SalatDAO[School, Int](collection = MongoConnection()("beamstream")("school"))
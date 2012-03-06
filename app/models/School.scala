package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection

case class School(@Key("_id") id: ObjectId, schoolName: String)

object School {
  
  def createSchool(school:School){
    SchoolDAO.insert(school)
  }
  
  def removeSchool(school:School){
    SchoolDAO.remove(school)
  }
  
  def findSchoolsByName(name:String):List[String] = {
    val regexp = (""".*""" + name + """.*""").r
    for (school <- SchoolDAO.find(MongoDBObject("schoolName" -> regexp)).toList) yield school.schoolName 
  }

}

object SchoolDAO extends SalatDAO[School, Int](collection = MongoConnection()("beamstream")("school"))
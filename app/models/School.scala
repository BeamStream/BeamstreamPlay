package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import org.joda.time.DateTime
import org.bson.types.ObjectId
import utils.MongoHQConfig

case class School(@Key("_id") id: ObjectId, schoolName: String, classes: List[Class])
case class SchoolForm(schoolName: String)
object School {

  val myDate = DateTime.now.toString()

  def allSchools(): List[School] = Nil
  /*
   * Will add a new School
   */
  def addSchool(schoolForm: SchoolForm) {
    School.createSchool(new School(new ObjectId, schoolForm.schoolName, List()))
  }

  /*
   * Add a class to a school
   */
  def addClasstoSchool(schoolId: ObjectId, anotherclass: Class) {
    val school = SchoolDAO.find(MongoDBObject("_id" -> schoolId)).toList(0)
    SchoolDAO.update(MongoDBObject("_id" -> schoolId), school.copy(classes = (school.classes ++ List(anotherclass))), false, false, new WriteConcern)
  }
  /*
    * Method for creating a school
    */
  def createSchool(school: School) {
    SchoolDAO.insert(school)
  }

  /*
   * Removes a school
   */
  def removeSchool(school: School) {
    SchoolDAO.remove(school)
  }

  /*
   * Find a school by name
   */

  def findSchoolsByName(name: String): List[School] = {
    val regexp = (""".*""" + name + """.*""").r
    for (school <- SchoolDAO.find(MongoDBObject("schoolName" -> regexp)).toList) yield school
  }

}

object SchoolDAO extends SalatDAO[School, Int](collection =  MongoHQConfig.mongoDB("school"))
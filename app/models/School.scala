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
import java.util.Date
import java.text.DateFormat

case class School(@Key("_id") id: ObjectId,  schoolName: String,year:Year.Value,degreeExpected:DegreeExpected.Value,
    major:String,degree:Degree.Value,previousSchool:String,graduated:Boolean,graduationDate:Date,
    previousMajor:String,previousDegree:PreviousDegree.Value,classes: List[Class])

case class SchoolForm(schoolName: String)
object School {

 val formatter : DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  def allSchools(): List[School] = Nil
  /*
   * Will add a new School
   */
  def addSchool(schoolForm: SchoolForm) {
    School.createSchool(new School(new ObjectId, schoolForm.schoolName,Year.FirstYear,DegreeExpected.Spring2012,
        "CSE",Degree.Masters,"Cambridge",true,formatter.parse("12-07-2011"),"CSE",PreviousDegree.Masters,List()))
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

object Year extends Enumeration {
  val FirstYear = Value(0, "1st Year")
  val SecondYear = Value(1, "2nd Year")
  val ThirdYear = Value(2, "3rd Year")
  val FourthYear = Value(3, "4th Year")
}


object DegreeExpected extends Enumeration {
  val Spring2012 = Value(0, "Spring 2012")
  val Summer2012 = Value(1, "Summer 2012")
  val Spring2013 = Value(2, "Spring 2013")
  val Summer2013 = Value(3, "Summer 2013")
}

object Degree extends Enumeration {
  val Bachelors = Value(0, "Bachelors")
  val Masters = Value(1, "Masters")
  
}

object PreviousDegree extends Enumeration {
  val Bachelors = Value(0, "Bachelors")
  val Masters = Value(1, "Masters")
  
}

object SchoolDAO extends SalatDAO[School, Int](collection = MongoHQConfig.mongoDB("school"))
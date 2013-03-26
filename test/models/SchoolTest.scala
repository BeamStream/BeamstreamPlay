package models
//import org.scalatest.FunSuite
//import org.scalatest.BeforeAndAfter
//import org.junit.runner.RunWith
//import org.scalatest.junit.JUnitRunner
//import com.mongodb.casbah.commons.MongoDBObject
//import org.bson.types.ObjectId
//import java.text.DateFormat
//
//@RunWith(classOf[JUnitRunner])
//class SchoolTest extends FunSuite with BeforeAndAfter {
//
//  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
//
//  val myschool1 = UserSchool(new ObjectId, "MPS", new ObjectId, Year.Freshman, Degree.Assosiates,
//    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), "", List())
//
//  val myschool2 = UserSchool(new ObjectId, "DonBosco", new ObjectId, Year.Freshman, Degree.Assosiates,
//    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), "", List())
//
//  val myschool3 = UserSchool(new ObjectId, "DPS", new ObjectId, Year.Freshman, Degree.Assosiates,
//    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), "", List())
//
//  before {
//    UserSchool.createSchool(List(myschool1, myschool2, myschool3),new ObjectId)
//
//  }
//
//  test("Check the School Creation") {
//    val schoolA = UserSchoolDAO.find(MongoDBObject("schoolName" -> "MPS"))
//    assert(schoolA.size === 1)
//
//    val schoolB = UserSchoolDAO.find(MongoDBObject("schoolName" -> "DPS"))
//    assert(schoolB.size === 1)
//
//  }
//
//  test("finding all schools by school ids") {
//    val schoolsReturnedByName = UserSchoolDAO.find(MongoDBObject("schoolName" -> "DPS")).toList
//    assert(schoolsReturnedByName.size === 1)
//    val id = schoolsReturnedByName(0).id
//
//    val schoolsReturnedById = UserSchoolDAO.find(MongoDBObject("_id" -> id)).toList
//    assert(schoolsReturnedById.size === 1)
//
//    val schoolObjectIdList: List[ObjectId] = List(id)
//    val schoolsList = UserSchool.getAllSchools(schoolObjectIdList)
//    assert(schoolsList.size === 1)
//
//  }
//
//  test("Find School By Name") {
//    val schools = School.getAllSchoolsFromDB("D")
//    assert(schools.size === 2)
//    val againSchools = School.getAllSchoolsFromDB("Do")
//    assert(againSchools.size === 1)
//
//  }
//
//  after {
//    UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
//    SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
//  }
//}

import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import java.text.DateFormat

@RunWith(classOf[JUnitRunner])
class SchoolTest extends FunSuite with BeforeAndAfter {
  
  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val myUserSchool1 = UserSchool(new ObjectId, new ObjectId, "MPS", Year.Freshman, Degree.Assosiates,
    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), None, List())

  test("Create User School") {
    UserSchool.createSchool(myUserSchool1)
    assert(UserSchoolDAO.find(MongoDBObject()).size === 1)
  }

  after {
    UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
  }
}
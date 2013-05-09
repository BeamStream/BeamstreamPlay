package models

import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId

@RunWith(classOf[JUnitRunner])
class SchoolTest extends FunSuite with BeforeAndAfter {

  val school = School(new ObjectId, "Cambridge", "www.cambridge.com")

  before {
    SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
  }

  test("Add a school") {
    val schoolId = School.addNewSchool(school)
    val schools = SchoolDAO.find(MongoDBObject())
    assert(schools.size === 1)
  }

  test("Get School By School Name") {
    val schoolId = School.addNewSchool(school)
    val schools = SchoolDAO.find(MongoDBObject())
    assert(schools.size === 1)
    val schoolsObtained = School.getAllSchoolsFromDB("Camb")
    assert(schoolsObtained.size === 1)
  }

  test("Get School By School Id") {
    val schoolId = School.addNewSchool(school)
    val schools = SchoolDAO.find(MongoDBObject())
    assert(schools.size === 1)
    val schoolsObtained = School.findSchoolsById(schoolId.get)
    assert(schoolsObtained.size === 1)
  }

  test("Update School Name") {
    val schoolId = School.addNewSchool(school)
    val schools = SchoolDAO.find(MongoDBObject())
    assert(schools.size === 1)
    val schoolsObtained = School.findSchoolsById(schoolId.get)
    assert(schoolsObtained.head.schoolName === "Cambridge")
    School.updateSchool(schoolId.get, "Davis")
    val updatedSchool = School.findSchoolsById(schoolId.get)
    assert(updatedSchool.head.schoolName === "Davis")
  }
  test("Find School By School Name") {
    val schoolId = School.addNewSchool(school)
    val schools = SchoolDAO.find(MongoDBObject())
    assert(schools.size === 1)
    val schoolsObtained = School.findSchoolByName("Cambridge")
    assert(schoolsObtained.size === 1)
  }

  test("Is School Already Exist") {
    val schoolId = School.addNewSchool(school)
    val schools = SchoolDAO.find(MongoDBObject())
    assert(schools.size === 1)
    val schoolsObtained = School.isSchoolinDatabaseAlready(schoolId.get)
    assert(schoolsObtained.size != 0)
  }

  after {
    SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))

  }

}
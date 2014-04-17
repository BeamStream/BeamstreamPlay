package controllers

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.BetaUserDAO
import play.api.test.FakeApplication
import play.api.test.Helpers._
import org.scalatest.junit.JUnitRunner
import play.api.test.FakeRequest
import play.api.libs.json._
import models.UserSchoolDAO
import models.SchoolDAO
import models.UserDAO
import models.User
import org.bson.types.ObjectId
import models.UserType
import java.util.Date
import models.UserSchool
import models.Year
import models.Degree
import models.Graduated
import models.DegreeExpected
import java.text.DateFormat
import models.School

@RunWith(classOf[JUnitRunner])
class SchoolControllerTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
      SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    }
  }

  test("Add School") {
    val jsonString = """{"schoolName": "Cambridge","schoolWebsite": "www.cambridge.com"}"""
    val json: JsValue = play.api.libs.json.Json.parse(jsonString)
    running(FakeApplication()) {
      val result = route(
        FakeRequest(POST, "/school").
          withJsonBody(json))
      assert(status(result.get) === 200)
    }
  }

  test("Get All Schools for Auto Populate") {
    running(FakeApplication()) {
      val result = route(
        FakeRequest(POST, "/getAllSchoolsForAutopopulate").withFormUrlEncodedBody("data" -> "IIIT-Delhi"))
      assert(status(result.get) === 200)
    }
  }

  test("Get All Schools of a User") {
    running(FakeApplication()) {
      val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
      val myUserSchool = UserSchool(new ObjectId, new ObjectId("5347af57c4aa242096d8eb4d"), "IIITD", Year.Graduated_Masters, Degree.Masters,
        "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Winter2014), None)
      val userSchoolId = UserSchool.createSchool(myUserSchool)
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, List(userSchoolId.get), Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val result = route(FakeRequest(GET, "/getAllSchoolForAUser").withSession("userId" -> userId.get.toString()))
      assert(status(result.get) === 200)
    }
  }

  test("Get School Name") {
    running(FakeApplication()) {
      val school = School(new ObjectId, "IIITD", "www.iiitd.ac.in")
      val schoolId = School.addNewSchool(school)
      val result = route(FakeRequest(GET, "/name/school/" + schoolId.get))
      assert(status(result.get) === 200)
    }
  }

  after {
    running(FakeApplication()) {
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
      SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }

}
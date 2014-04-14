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

@RunWith(classOf[JUnitRunner])
class SchoolControllerTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
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

  after {
    running(FakeApplication()) {
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
      SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    }
  }

}
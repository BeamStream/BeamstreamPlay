package controllers

import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import play.api.libs.json.JsValue
import play.api.test.Helpers._
import play.api.test.FakeApplication
import models.UserDAO
import play.libs.WS
import com.mongodb.casbah.commons.MongoDBObject
import play.api.test.FakeRequest

@RunWith(classOf[JUnitRunner])
class BasicRegistrationTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }

  test("Render Signup page") {
    running(FakeApplication()) {
      val status = WS.url("http://localhost:9000/signup")
      assert(status.get.get.getStatus === 200)
    }
  }

  test("SignUp user") {
    val jsonString = """{"iam": "1","mailId": "neelkanth@knoldus.com","password": "123","confirmPassword": "123"}"""
    val json: JsValue = play.api.libs.json.Json.parse(jsonString)
    running(FakeApplication()) {
      val result = routeAndCall(
        FakeRequest(POST, "/betaUser").
          withJsonBody(json))
      assert(status(result.get) === 200)
    }
  }

  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }

}
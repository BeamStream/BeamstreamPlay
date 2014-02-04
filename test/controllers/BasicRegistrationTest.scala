package controllers

import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import play.api.libs.json.JsValue
import play.api.test.Helpers._
import play.api.test.FakeApplication
import models.UserDAO
import com.mongodb.casbah.commons.MongoDBObject
import play.api.test.FakeRequest
import play.api.libs.ws.WS
import scala.concurrent._
import scala.concurrent.duration._
import play.api.libs.concurrent.Execution.Implicits._
@RunWith(classOf[JUnitRunner])
class BasicRegistrationTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }

  test("Render Signup page") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/signup"))
      assert(status(result.get) === 200)
    }
  }

  test("SignUp user") {
    val jsonString = """{"iam": "1","mailId": "neelkanth@knoldus.com","password": "123","confirmPassword": "123"}"""
    val json: JsValue = play.api.libs.json.Json.parse(jsonString)
    running(FakeApplication()) {
      val result = route(
        FakeRequest(POST, "/betaUser").
          withJsonBody(json)).get
      result onComplete {
        case stat => assert(stat.isSuccess === true)
      }
    }
  }

  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }

}
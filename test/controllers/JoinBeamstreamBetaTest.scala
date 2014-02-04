package controllers

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.BetaUserDAO
import play.api.libs.json.JsValue
import play.api.test.FakeApplication
import play.api.test.FakeRequest
import play.api.test.Helpers._
import org.scalatest.junit.JUnitRunner
import play.api.Play
import play.api.libs.ws.WS
import play.api.libs.concurrent.Execution.Implicits._

@RunWith(classOf[JUnitRunner])
class JoinBeamstreamBetaTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      BetaUserDAO.remove(MongoDBObject("emailId" -> ".*".r))
    }
  }

  test("Render beta user registration page") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/")).get
      result onComplete {
        case stat => assert(stat.isSuccess===true)
      }

    }
  }

  test("Add beta user") {
    val jsonString = """{"mailId": "neelkanth@knoldus.com"}"""
    val json: JsValue = play.api.libs.json.Json.parse(jsonString)
    running(FakeApplication()) {
      val result = route(FakeRequest(POST, "/betaUser").withJsonBody(json)).get
      assert(status(result) === 200)
    }
  }
  after {
    running(FakeApplication()) {
      BetaUserDAO.remove(MongoDBObject("emailId" -> ".*".r))
    }
  }

}
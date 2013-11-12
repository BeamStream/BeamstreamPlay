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

@RunWith(classOf[JUnitRunner])
class JoinBeamstreamBetaTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      BetaUserDAO.remove(MongoDBObject("emailId" -> ".*".r))
    }
  }

  //Note :- Runs Good but due to cookies functionality there , can't be tested from here
//  test("Render beta user registration page") {
//    running(FakeApplication()) {
//      val status = WS.url("http://localhost:9000/betaUser")
//      assert(status.get.get.getStatus === 200)
//    }
//  }

  test("Add beta user") {
    val jsonString = """{"mailId": "neelkanth@knoldus.com"}"""
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
      BetaUserDAO.remove(MongoDBObject("emailId" -> ".*".r))
    }
  }

}
package controllers

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import org.scalatest.junit.JUnitRunner
import models.User
import org.bson.types.ObjectId
import models.UserType
import java.util.Date
import play.api.test.FakeRequest
import play.api.test.Helpers._
import models.UserDAO
import play.api.libs.json.JsValue

@RunWith(classOf[JUnitRunner])
class SocialControllerTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }

  test("Get Contacts") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/social/contacts"))
      assert(status(result.get) === 200)
    }
  }

  test("Invite Friends") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "himanshu@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val jsonToBeCreated = """{"data":"himanshu@knoldus.com"}"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonToBeCreated)
      val result1 = route(FakeRequest(POST, "/social/invite/friends").withBody(json).withSession("userId" -> userId.get.toString))
      assert(status(result1.get) === 200)
      val result2 = route(FakeRequest(POST, "/social/invite/friends"))
      assert(status(result2.get) === 200)
    }
  }

  test("Sign Up Via Social Sites") {
    running(FakeApplication()) {
      val result = route(FakeRequest(POST, "/social/social_authentication"))
      assert(status(result.get) === 200)
    }
  }
  
  
  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }

}
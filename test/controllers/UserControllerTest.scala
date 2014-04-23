package controllers

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import org.scalatest.junit.JUnitRunner
import models.UserDAO
import com.mongodb.casbah.commons.MongoDBObject
import play.api.Play
import models.ClassDAO
import models.UserSchoolDAO
import utils.OnlineUserDAO
import play.api.Logger
import play.api.libs.json.JsValue
import play.api.test.FakeRequest
import play.api.test.Helpers._
import models.User
import org.bson.types.ObjectId
import models.UserType
import java.util.Date
import play.api.mvc.Cookie
import models.UserMedia
import models.UserMediaType
import models.Access
import models.UserMediaDAO
import models.StreamDAO
import models.Class
import models.ClassType
import java.text.DateFormat

@RunWith(classOf[JUnitRunner])
class UserControllerTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      Logger.debug(Play.current.configuration.getString("databaseName").get)
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
      OnlineUserDAO.remove(MongoDBObject("onlineUsers" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
    }
  }

  test("Signout") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val result1 = route(FakeRequest(GET, "/signOut").withCookies(Cookie("Beamstream", userId.get.toString() + " class")))
      assert(status(result1.get) === 200)
      val result2 = route(FakeRequest(GET, "/signOut"))
      assert(status(result2.get) === 303)
    }
  }

  test("Return User JSON") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val result1 = route(FakeRequest(GET, "/loggedInUserJson").withSession("userId" -> userId.get.toString()))
      assert(status(result1.get) === 200)
      val result2 = route(FakeRequest(GET, "/loggedInUserJson"))
      assert(status(result2.get) === 200)
    }
  }

  test("Test Neo4j") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/testNeo4j"))
      assert(status(result.get) === 200)
    }
  }

  test("Test Neo4j to Find Node") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/testNeo4jFindNode"))
      assert(status(result.get) === 200)
    }
  }

  test("Test Neo4j to Add Friends") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/testNeo4jAddFriends"))
      assert(status(result.get) === 200)
    }
  }

  test("Test Neo4j to Print Friends") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/testNeo4jPrintFriends"))
      assert(status(result.get) === 200)
    }
  }

  test("Active") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/active"))
      assert(status(result.get) === 200)
    }
  }

  test("Follow User") {
    running(FakeApplication()) {
      val user1 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val user1Id = User.createUser(user1)
      val user2 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val user2Id = User.createUser(user2)
      val result = route(FakeRequest(PUT, "/followUser/" + user2Id.get).withSession("userId" -> user1Id.get.toString()))
      assert(status(result.get) === 200)
    }
  }

  test("Render Forgot Password View") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/recover"))
      assert(status(result.get) === 200)
    }
  }

  test("Account Reset") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/accountReset"))
      assert(status(result.get) === 200)
    }
  }

  test("Find User for Login") {
    val jsonString = """{"mailId": "neelkanth@knoldus.com","password": "123456"}"""
    val json: JsValue = play.api.libs.json.Json.parse(jsonString)
    running(FakeApplication()) {
      val result = route(
        FakeRequest(POST, "/login").
          withJsonBody(json)).get
      assert(status(result) === 200)
    }
  }

  test("Get all Online Users") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val userMedia = UserMedia(new ObjectId, "", "", userId.get, new Date, "", UserMediaType.Image, Access.Public, true, None, "", 0, Nil, Nil, 0)
      UserMedia.saveMediaForUser(userMedia)
      val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
      val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), Nil)
      Class.createClass(classToBeCretaed, userId.get)
      val result = route(FakeRequest(GET, "/onlineUsers").withSession("userId" -> userId.get.toString()))
      assert(status(result.get) === 200)
    }
  }

  after {
    running(FakeApplication()) {
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
      OnlineUserDAO.remove(MongoDBObject("onlineUsers" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
    }
  }

}
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
import play.api.Play
import org.bson.types.ObjectId
import models.User
import models.UserType
import java.util.Date
import models.ClassType
import java.text.DateFormat
import models.Class
import models.ClassDAO
import models.UserMedia
import models.Token
import play.api.mvc.Cookie
import utils.TokenEmailUtil
import models.UserMediaType
import models.Access
import models.TokenDAO
import models.UserMediaDAO

@RunWith(classOf[JUnitRunner])
class BasicRegistrationTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  private def userToBeCreated = {
    User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
  }

  private def classToBeCreated = {
    models.Class(new ObjectId("51ac282644ae723fa2ad1c4b"), "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), Nil)
  }

  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

  test("Render Signup page") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/signup"))
      assert(status(result.get) === 200)
    }
  }

  test("Render Signup page with Session") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/signup").withSession("userId" -> (new ObjectId).toString()))
      assert(status(result.get) === 303)
    }
  }

  test("Render Signup page with Session & User") {
    val userId = User.createUser(userToBeCreated)
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/signup").withSession("userId" -> userId.get.toString()))
      assert(status(result.get) === 303)
    }
  }

  test("Render Signup page with Session, User & Class") {
    val userId = User.createUser(userToBeCreated)
    val classId = Class.createClass(classToBeCreated, userId.get)
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/signup").withSession("userId" -> userId.get.toString()))
      assert(status(result.get) === 303)
    }
  }

  test("Render Signup page with Cookies") {
    val userId = User.createUser(userToBeCreated)
    val classId = Class.createClass(classToBeCreated, userId.get)
    val tokenTobeCreated = Token(new ObjectId, userId.get.toString(), TokenEmailUtil.securityToken, false)
    Token.addToken(tokenTobeCreated)
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/signup").withCookies(Cookie("Beamstream", userId.get.toString() + " registration"))).get
      assert(status(result) === 303)
    }
    val userMedia = UserMedia(new ObjectId, "", "", userId.get, new Date, "", UserMediaType.Image, Access.Public, true, None, "", 0, Nil, Nil, 0)
    UserMedia.saveMediaForUser(userMedia)
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/signup").withCookies(Cookie("Beamstream", userId.get.toString() + " class"))).get
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/signup").withCookies(Cookie("Beamstream", userId.get.toString() + " stream"))).get
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/signup").withCookies(Cookie("Beamstream", userId.get.toString() + " registration"))).get
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/signup").withSession("userId" -> userId.get.toString()))
      assert(status(result.get) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/signup").withCookies(Cookie("Beamstream", userId.get.toString() + " browsemedia"))).get
      assert(status(result) === 303)
    }
    val user2 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
    val user2Id = User.createUser(user2)
    val token2 = Token(new ObjectId, user2Id.get.toString(), TokenEmailUtil.securityToken, false)
    Token.addToken(token2)
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/signup").withCookies(Cookie("Beamstream", user2Id.get.toString() + " registration"))).get
      assert(status(result) === 303)
    }
  }

  test("SignUp user") {
    val jsonString = """{"iam":"0","mailId":"himanshu@knoldus.com","password":"123456","confirmPassword":"123456"}"""
    val json: JsValue = play.api.libs.json.Json.parse(jsonString)
    running(FakeApplication()) {
      val result = route(FakeRequest(POST, "/betaUser").withJsonBody(json)).get
      assert(status(result) === 200)
    }
  }

  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

}
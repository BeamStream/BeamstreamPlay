package controllers

import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers._
import play.api.test.FakeApplication
import models.ClassDAO
import com.mongodb.casbah.commons.MongoDBObject
import models.User
import java.text.DateFormat
import org.bson.types.ObjectId
import models.UserType
import models.ClassType
import play.api.test.FakeRequest
import play.api.libs.json.JsValue
import models.StreamDAO
import models.UserDAO
import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.ws.WS
import java.util.Date
import models.Class
import models.Token
import utils.TokenEmailUtil
import models.UserMedia
import models.UserMediaType
import models.Access
import play.api.mvc.Cookie
import models.TokenDAO
import models.UserMediaDAO

@RunWith(classOf[JUnitRunner])
class ClassControllerTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
  private def userToBeCreated = {
    User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
  }
  
  private def classToBeCreated = {
    Class(new ObjectId("51ac282644ae723fa2ad1c4b"), "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), Nil)
  }

  before {
    running(FakeApplication()) {
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

  test("Render Class page") {
    val userId = User.createUser(userToBeCreated)
    val tokenTobeCreated = Token(new ObjectId, userId.get.toString(), TokenEmailUtil.securityToken, false)
    Token.addToken(tokenTobeCreated)
    val userMedia = UserMedia(new ObjectId, "", "", userId.get, new Date, "", UserMediaType.Image, Access.Public, true, None, "", 0, Nil, Nil, 0)
    UserMedia.saveMediaForUser(userMedia)
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/class")).get
      result onComplete {
        case stat => assert(stat.isSuccess === true)
      }
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/class").withSession("userId" -> userId.get.toString())).get
      result onComplete {
        case stat => assert(stat.isSuccess === true)
      }
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/class").withCookies(Cookie("Beamstream", userId.get.toString() + " class"))).get
      result onComplete {
        case stat => assert(stat.isSuccess === false)
      }
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/class").withCookies(Cookie("Beamstream", userId.get.toString() + " stream"))).get
      result onComplete {
        case stat => assert(stat.isSuccess === false)
      }
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/class").withCookies(Cookie("Beamstream", userId.get.toString() + " registration"))).get
      result onComplete {
        case stat => assert(stat.isSuccess === false)
      }
      assert(status(result) === 303)
    }
  }

  test("Create class test") {
    val userId = User.createUser(userToBeCreated)
    running(FakeApplication()) {
      val jsonOfClassToBeCreated = """{"schoolId":"51ac27f044ae723fa2ad1c47","classCode":"002","className":"MyNewClass","classTime":"11:11AM","startingDate":"05/30/2013","classType":"quarter","stream":{"id":{"id":"51ac282644ae723fa2ad1c4c"},"streamName":"MyClass","streamType":"Class","creatorOfStream":{"id":"51ac27c744ae723fa2ad1c45"},"usersOfStream":[{"id":"51ac27c744ae723fa2ad1c45"}],"postToMyProfile":true,"streamTag":[]},"resultToSend":{"status":"Failure","message":"You've already joined the stream"}}"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonOfClassToBeCreated)
      val result = route(
        FakeRequest(POST, "/class").
          withJsonBody(json).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }

  }

  test("Join  Stream test") {
    val userId = User.createUser(userToBeCreated)
    running(FakeApplication()) {
      val classId = models.Class.createClass(classToBeCreated, userId.get)
      val jsonOfClassToBeCreated = """{"schoolId":"51ac27f044ae723fa2ad1c47","classCode":"001","className":"001","classTime":"11:11AM","startingDate":"05/30/2013","classType":"quarter","id":"51ac282644ae723fa2ad1c4b"}"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonOfClassToBeCreated)
      val result = route(
        FakeRequest(POST, "/class").
          withJsonBody(json).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }

  }

  test("Find Class By Code") {
    val userId = User.createUser(userToBeCreated)
    running(FakeApplication()) {
      val classId = models.Class.createClass(classToBeCreated, userId.get)

      val result = route(
        FakeRequest(POST, "/autoPopulateClassesbyCode").
          withFormUrlEncodedBody("data" -> "20", "assosiatedSchoolId" -> "47cc67093475061e3d95369d").withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }

  }

  test("FInd Class By Name") {
    val userId = User.createUser(userToBeCreated)
    running(FakeApplication()) {
      val classId = models.Class.createClass(classToBeCreated, userId.get)

      val result = route(
        FakeRequest(POST, "/autoPopulateClassesbyName").
          withFormUrlEncodedBody("data" -> "IT", "schoolId" -> "47cc67093475061e3d95369d").withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }

  }

  test("FInd All Classes For A User") {
    val userId = User.createUser(userToBeCreated)
    running(FakeApplication()) {
      val classId = models.Class.createClass(classToBeCreated, userId.get)
      val result = route(
        FakeRequest(GET, "/classesFor/user/" + userId.get.toString).
          withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  after {
    running(FakeApplication()) {
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

}
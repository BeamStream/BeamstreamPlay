package controllers

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.BetaUserDAO
import models.StreamDAO
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import org.scalatest.junit.JUnitRunner
import play.api.test.FakeRequest
import play.api.test.Helpers._
import play.api.libs.concurrent.Execution.Implicits._
import models.UserMedia
import models.User
import models.Token
import play.api.mvc.Cookie
import org.bson.types.ObjectId
import utils.TokenEmailUtil
import models.UserType
import java.util.Date
import models.UserMediaType
import models.Access
import models.UserMediaDAO
import models.UserDAO
import models.TokenDAO
import models.StreamType
import models.Stream
import models.ClassDAO
import models.Class
import models.ClassType
import java.text.DateFormat

@RunWith(classOf[JUnitRunner])
class StreamControllerTest extends FunSuite with BeforeAndAfter {
  before {
    running(FakeApplication()) {
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
    }
  }

  test("Render Error Page") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/error"))
      assert(status(result.get) === 200)
    }
  }

  test("Get all Streams of a User") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(userId.get), true, List())
      val streamId = Stream.createStream(stream)
      val result = route(FakeRequest(GET, "/allStreamsForAUser").withSession("userId" -> userId.get.toString()))
      assert(status(result.get) === 200)
    }
  }

  test("Get all Class Streams of a User") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(userId.get), true, List())
      val streamId = Stream.createStream(stream)
      val result = route(FakeRequest(GET, "/streams").withSession("userId" -> userId.get.toString()))
      assert(status(result.get) === 200)
    }
  }
  
  test("Get no. of Users attending a Class") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(userId.get), true, List())
      val streamId = Stream.createStream(stream)
      val result = route(FakeRequest(GET, "/noOfUsers/stream/" + streamId.get))
      assert(status(result.get) === 200)
    }
  }  
  
  test("Delete a Stream") {
    running(FakeApplication()) {
      val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId.get, List(userId.get), true, List())
      val streamId = Stream.createStream(stream)
      val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List(streamId.get))
      val result = route(FakeRequest(PUT, "/remove/stream/" + streamId.get).withSession("userId" -> userId.get.toString()))
      assert(status(result.get) === 200)
    }
  }
  
  test("Render Stream page") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
    val userId = User.createUser(user)
    val tokenTobeCreated = Token(new ObjectId, userId.get.toString(), TokenEmailUtil.securityToken, false)
    Token.addToken(tokenTobeCreated)
    val userMedia = UserMedia(new ObjectId, "", "", userId.get, new Date, "", UserMediaType.Image, Access.Public, true, None, "", 0, Nil, Nil, 0)
    UserMedia.saveMediaForUser(userMedia)
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/stream")).get
      result onComplete {
        case stat => assert(stat.isSuccess === true)
      }
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/stream").withSession("userId" -> userId.get.toString())).get
      result onComplete {
        case stat => assert(stat.isSuccess === true)
      }
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/stream").withCookies(Cookie("Beamstream", userId.get.toString() + " class"))).get
      result onComplete {
        case stat => assert(stat.isSuccess === false)
      }
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/stream").withCookies(Cookie("Beamstream", userId.get.toString() + " stream"))).get
      result onComplete {
        case stat => assert(stat.isSuccess === false)
      }
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/stream").withCookies(Cookie("Beamstream", userId.get.toString() + " registration"))).get
      result onComplete {
        case stat => assert(stat.isSuccess === false)
      }
      assert(status(result) === 303)
    }
  }

  after {
    running(FakeApplication()) {
      BetaUserDAO.remove(MongoDBObject("streamName" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
    }
  }

}
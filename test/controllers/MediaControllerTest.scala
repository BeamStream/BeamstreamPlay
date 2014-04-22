package controllers

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.UserMediaDAO
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers._
import play.api.test.FakeRequest
import play.api.libs.concurrent.Execution.Implicits._
import models.UserMedia
import models.User
import org.bson.types.ObjectId
import java.util.Date
import models.UserMediaType
import models.UserType
import models.Access
import models.UserDAO
import models.Token
import utils.TokenEmailUtil
import play.api.mvc.Cookie
import models.TokenDAO

@RunWith(classOf[JUnitRunner])
class MediaControllerTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
    }
  }

  test("Render Browse Media page") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
    val userId = User.createUser(user)
    val tokenTobeCreated = Token(new ObjectId, userId.get.toString(), TokenEmailUtil.securityToken, false)
    Token.addToken(tokenTobeCreated)
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/browsemedia").withCookies(Cookie("Beamstream", userId.get.toString() + " registration"))).get
      assert(status(result) === 303)
    }
    val userMedia = UserMedia(new ObjectId, "", "", userId.get, new Date, "", UserMediaType.Image, Access.Public, true, None, "", 0, Nil, Nil, 0)
    UserMedia.saveMediaForUser(userMedia)
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/browsemedia")).get
      result onComplete {
        case stat => assert(stat.isSuccess === true)
      }
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/browsemedia").withSession("userId" -> userId.get.toString())).get
      result onComplete {
        case stat => assert(stat.isSuccess === true)
      }
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/browsemedia").withCookies(Cookie("Beamstream", userId.get.toString() + " class"))).get
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/browsemedia").withCookies(Cookie("Beamstream", userId.get.toString() + " stream"))).get
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/browsemedia").withCookies(Cookie("Beamstream", userId.get.toString() + " registration"))).get
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/browsemedia").withCookies(Cookie("Beamstream", userId.get.toString() + " browsemedia"))).get
      assert(status(result) === 303)
    }
    val user2 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
    val user2Id = User.createUser(user2)
    val token2TobeCreated = Token(new ObjectId, user2Id.get.toString(), TokenEmailUtil.securityToken, false)
    Token.addToken(token2TobeCreated)
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/browsemedia").withCookies(Cookie("Beamstream", user2Id.get.toString() + " registration"))).get
      assert(status(result) === 303)
    }
  }

  test("Get All Pics of a User") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val UserMediaObj1 = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
      val UserMediaObj2 = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
      UserMedia.saveMediaForUser(UserMediaObj1)
      UserMedia.saveMediaForUser(UserMediaObj2)
      val result = route(FakeRequest(GET, "/allPicsForAuser").withSession("userId" -> userId.get.toString())).get
      assert(status(result) === 200)
    }
  }

  test("Get All Videos of a User") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val UserMediaObj = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Video, Access.Public, false, Option(new ObjectId), "", 0, Nil, Nil, 0)
      UserMedia.saveMediaForUser(UserMediaObj)
      val result = route(FakeRequest(GET, "/allVideosForAuser").withSession("userId" -> userId.get.toString())).get
      assert(status(result) === 200)
    }
  }

  /*test("Rock the UserMedia") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val UserMediaObj = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Video, Access.Public, false, Option(new ObjectId), "", 0, Nil, Nil, 0)
      UserMedia.saveMediaForUser(UserMediaObj)
      val result = route(FakeRequest(GET, "/rock/media/" + UserMediaObj.id.toString()).withSession("userId" -> userId.get.toString()))
      assert(status(result.get) === 200)
    }
  }*/

  test("Rockers of UserMedia") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val UserMediaObj = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Video, Access.Public, false, Option(new ObjectId), "", 0, Nil, Nil, 0)
      UserMedia.saveMediaForUser(UserMediaObj)
      val result = route(FakeRequest(GET, "/rockersOf/media/" + UserMediaObj.id.toString()).withSession("userId" -> userId.get.toString())).get
      assert(status(result) === 200)
    }
  }

  test("Get Profile Pic of a User") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val UserMediaObj = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
      val userMediaId = UserMedia.saveMediaForUser(UserMediaObj)
      val result1 = route(FakeRequest(GET, "/profilePicFor/user/" + userId.get.toString())).get
      assert(status(result1) === 200)
      val result2 = route(FakeRequest(GET, "/profilePicFor/user/" + (new ObjectId).toString())).get
      assert(status(result2) === 200)
    }
  }

  test("Get Recent Media") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val UserMediaObj = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
      val userMediaId = UserMedia.saveMediaForUser(UserMediaObj)
      val result = route(FakeRequest(GET, "/recentMedia").withSession("userId" -> userId.get.toString())).get
      assert(status(result) === 200)
    }
  }
  
  test("Search Media or Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val UserMediaObj = UserMedia(new ObjectId, "Neel.png", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
      val userMediaId = UserMedia.saveMediaForUser(UserMediaObj)
      val result = route(FakeRequest(GET, "/search/Neel").withSession("userId" -> userId.get.toString())).get
      assert(status(result) === 200)
    }
  }
  
  test("Upload Default Media") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val result = route(FakeRequest(GET, "/defaultMedia").withSession("userId" -> userId.get.toString())).get
      assert(status(result) === 200)
    }
  }
  
  after {
    running(FakeApplication()) {
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
    }
  }

}
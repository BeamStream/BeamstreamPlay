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

@RunWith(classOf[JUnitRunner])
class StreamControllerTest extends FunSuite with BeforeAndAfter {
  before {
    running(FakeApplication()) {
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
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
    }
  }

}
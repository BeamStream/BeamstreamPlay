package controllers

import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers._
import play.api.test.FakeApplication
import models.UserDAO
import models.BetaUserDAO
import com.mongodb.casbah.commons.MongoDBObject
import play.api.test.FakeRequest
import play.api.test.Helpers._
import play.api.libs.concurrent.Execution.Implicits._
import models.UserMediaDAO
import models.StreamDAO
import models.TokenDAO
import models.UserMedia
import models.User
import models.Token
import org.bson.types.ObjectId
import utils.TokenEmailUtil
import models.UserType
import java.util.Date
import models.UserMediaType
import models.Access
import play.api.mvc.Cookie

@RunWith(classOf[JUnitRunner])
class RegistrationTest extends FunSuite with BeforeAndAfter {
  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
    }
  }

  test("Render Login page") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/login")).get
      result onComplete {
        case stat => assert(stat.isSuccess === true)
      }
    }
  }

  test("Render Registration page") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val tokenTobeCreated = Token(new ObjectId, userId.get.toString(), TokenEmailUtil.securityToken, false)
      Token.addToken(tokenTobeCreated)
      val userMedia = UserMedia(new ObjectId, "", "", userId.get, new Date, "", UserMediaType.Image, Access.Public, true, None, "", 0, Nil, Nil, 0)
      UserMedia.saveMediaForUser(userMedia)
      val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + tokenTobeCreated.id))
      /*result onComplete {
        case stat => assert(stat.isSuccess === true)
      }*/
      assert(status(result.get) == 303)
      running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + tokenTobeCreated.id).withSession("userId" -> userId.get.toString())).get
      result onComplete {
        case stat => assert(stat.isSuccess === true)
      }
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + new ObjectId).withCookies(Cookie("Beamstream", userId.get.toString() + " class"))).get
      result onComplete {
        case stat => assert(stat.isSuccess === false)
      }
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + new ObjectId).withCookies(Cookie("Beamstream", userId.get.toString() + " stream"))).get
      result onComplete {
        case stat => assert(stat.isSuccess === false)
      }
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + tokenTobeCreated.id).withCookies(Cookie("Beamstream", userId.get.toString() + " registration"))).get
      result onComplete {
        case stat => assert(stat.isSuccess === false)
      }
      assert(status(result) === 303)
    }

    }
  }

  after {
    running(FakeApplication()) {
      BetaUserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
    }
  }
}
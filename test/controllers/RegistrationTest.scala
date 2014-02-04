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

@RunWith(classOf[JUnitRunner])
class RegistrationTest extends FunSuite with BeforeAndAfter {
  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
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

  after {
    running(FakeApplication()) {
      BetaUserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }
}
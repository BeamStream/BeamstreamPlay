package controllers

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.UserMediaDAO
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import org.scalatest.junit.JUnitRunner
import models.UserDAO
import play.api.test.FakeRequest
import play.api.test.Helpers._
import play.api.libs.concurrent.Execution.Implicits._

@RunWith(classOf[JUnitRunner])
class PublicProfileControllerTest extends FunSuite with BeforeAndAfter {
  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

  test("Render Public profile page") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/renderProfilePage")).get
      result onComplete {
        case stat => assert(stat.isSuccess === true)
      }
    }
  }

  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

}
package controllers

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.UserMediaDAO
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import org.scalatest.junit.JUnitRunner

@RunWith(classOf[JUnitRunner])
class MediaControllerTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

//  test("Render Browse Media page") {
//    running(FakeApplication()) {
//      val status = WS.url("http://localhost:9000/browsemedia")
//      assert(status.get.get.getStatus === 200)
//    }
//  }

//  test("Render beta user registration page") {
//    running(FakeApplication()) {
//      val status = WS.url("http://localhost:9000/betaUser")
//      assert(status.get.get.getStatus === 200)
//    }
//  }

  after {
    running(FakeApplication()) {
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

}
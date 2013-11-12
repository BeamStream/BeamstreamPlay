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

@RunWith(classOf[JUnitRunner])
class RegistrationTest extends FunSuite with BeforeAndAfter {
  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }
  
//  test("Render Login page") {
//    running(FakeApplication()) {
//      val status = WS.url("http://localhost:9000/login")
//      assert(status.get.get.getStatus === 200)
//    }
//  }
  
  after {
    running(FakeApplication()) {
      BetaUserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }
}
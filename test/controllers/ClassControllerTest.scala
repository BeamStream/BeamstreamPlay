package controllers

import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers._
import play.api.test.FakeApplication
import models.ClassDAO
import com.mongodb.casbah.commons.MongoDBObject
import play.libs.WS

@RunWith(classOf[JUnitRunner])
class ClassControllerTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
    }
  }

  test("Render Class page") {
    running(FakeApplication()) {
      val status = WS.url("http://localhost:9000/class")
      assert(status.get.get.getStatus === 200)
    }
  }
  after {
    running(FakeApplication()) {
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
    }
  }

}
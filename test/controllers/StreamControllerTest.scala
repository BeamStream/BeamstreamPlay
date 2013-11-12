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
@RunWith(classOf[JUnitRunner])
class StreamControllerTest extends FunSuite with BeforeAndAfter {
  before {
    running(FakeApplication()) {
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
    }
  }

  //  test("Render stream page") {
  //    running(FakeApplication()) {
  //      val status = WS.url("http://localhost:9000/stream")
  //      assert(status.get.get.getStatus === 200)
  //    }
  //  }

  after {
    running(FakeApplication()) {
      BetaUserDAO.remove(MongoDBObject("streamName" -> ".*".r))
    }
  }

}
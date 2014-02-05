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

@RunWith(classOf[JUnitRunner])
class StreamControllerTest extends FunSuite with BeforeAndAfter {
  before {
    running(FakeApplication()) {
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
    }
  }


  after {
    running(FakeApplication()) {
      BetaUserDAO.remove(MongoDBObject("streamName" -> ".*".r))
    }
  }

}
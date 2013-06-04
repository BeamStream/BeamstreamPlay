package controllers

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.QuestionDAO
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import org.scalatest.junit.JUnitRunner
@RunWith(classOf[JUnitRunner])
class QuestionControllerTest extends FunSuite with BeforeAndAfter {
  before {
    running(FakeApplication()) {
      QuestionDAO.remove(MongoDBObject("questionBody" -> ".*".r))
    }
  }

  after {
    running(FakeApplication()) {
      QuestionDAO.remove(MongoDBObject("questionBody" -> ".*".r))
    }
  }

}
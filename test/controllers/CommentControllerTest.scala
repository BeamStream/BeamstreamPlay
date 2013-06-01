package controllers
import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.UserDAO
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import org.scalatest.junit.JUnitRunner
@RunWith(classOf[JUnitRunner])
class CommentControllerTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

}
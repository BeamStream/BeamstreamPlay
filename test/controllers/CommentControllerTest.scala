package controllers
import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.CommentDAO
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import org.scalatest.junit.JUnitRunner
@RunWith(classOf[JUnitRunner])
class CommentControllerTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      CommentDAO.remove(MongoDBObject("commentBody" -> ".*".r))
    }
  }

  after {
    running(FakeApplication()) {
      CommentDAO.remove(MongoDBObject("commentBody" -> ".*".r))
    }
  }

}
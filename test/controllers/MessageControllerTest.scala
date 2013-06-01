package controllers
import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.UserMediaDAO
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import play.libs.WS
import org.scalatest.junit.JUnitRunner
import models.UserDAO
@RunWith(classOf[JUnitRunner])
class MessageControllerTest extends FunSuite with BeforeAndAfter {
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
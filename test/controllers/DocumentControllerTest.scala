package controllers
import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.DocumentDAO
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import org.scalatest.junit.JUnitRunner
@RunWith(classOf[JUnitRunner])
class DocumentControllerTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      DocumentDAO.remove(MongoDBObject("documentName" -> ".*".r))
    }
  }

  after {
    running(FakeApplication()) {
      DocumentDAO.remove(MongoDBObject("documentName" -> ".*".r))
    }
  }

}
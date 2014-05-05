package utils

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers.running
import play.api.test.FakeApplication
import java.io.File
import models.SchoolDAO
import com.mongodb.casbah.commons.MongoDBObject
import org.scalatest.BeforeAndAfter
import java.io.InputStreamReader

@RunWith(classOf[JUnitRunner])
class ReadingSpreadsheetUtilTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    }
  }

  /**
   * TODO testing of Reading List of Schools csv function
   */
  /*test("Reading List of Schools csv file") {
    running(FakeApplication()) {
      val file = new InputStreamReader("/home/himanshu/BeamstreamPlay/conf/ListofSchools.csv")
      ReadingSpreadsheetUtil.readCSVOfSchools(file)
      assert(SchoolDAO.find(MongoDBObject()).toList.size >= 7487)
    }
  }*/

  after {
    running(FakeApplication()) {
      SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    }
  }
}
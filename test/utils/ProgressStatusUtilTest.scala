package utils

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import java.text.DateFormat
import play.api.test.Helpers.running
import play.api.test.FakeApplication
import play.api.Play
import java.util.Date
import models.UserDAO
import models.User
import models.UserType

@RunWith(classOf[JUnitRunner])
class ProgressStatusUtilTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)

  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      AmazonProgressDAO.remove(MongoDBObject("userId" -> ".*".r))
    }
  }

  test("Add Progress to Amazon") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      ProgressStatusUtil.addProgress(userId.get.toString(), 10)
      assert(AmazonProgressDAO.find(MongoDBObject("userId" -> userId.get.toString())).toList.size === 1)
      ProgressStatusUtil.addProgress(userId.get.toString(), 20)
      assert(AmazonProgressDAO.find(MongoDBObject("userId" -> userId.get.toString())).toList.size === 1)
    }
  }

  test("Find Progress from Amazon") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      assert(ProgressStatusUtil.findProgress(userId.get.toString()) === 0)
      ProgressStatusUtil.addProgress(userId.get.toString(), 10)
      assert(ProgressStatusUtil.findProgress(userId.get.toString()) === 10)
    }
  }

  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      AmazonProgressDAO.remove(MongoDBObject("userId" -> ".*".r))
    }
  }

}
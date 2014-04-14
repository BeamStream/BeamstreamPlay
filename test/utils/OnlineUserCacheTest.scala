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
import utils._

@RunWith(classOf[JUnitRunner])
class OnlineUserCacheTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)

  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      OnlineUserDAO.remove(MongoDBObject("onlineUsers" -> ".*".r))
    }
  }

  test("Set User Offline") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      OnlineUserCache.setOnline(userId.get.toString(), 10000)
      OnlineUserCache.setOffline(userId.get.toString())
      assert(OnlineUserDAO.find(MongoDBObject()).toList(0).onlineUsers.size === 0)
      OnlineUserCache.setOffline(userId.get.toString())
      assert(OnlineUserDAO.find(MongoDBObject()).toList(0).onlineUsers.size === 0)
    }
  }

  test("Set User Online") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      OnlineUserCache.setOnline(userId.get.toString(), 10000)
      assert(OnlineUserDAO.find(MongoDBObject()).toList(0).onlineUsers.size === 1)
      OnlineUserCache.setOnline(userId.get.toString(), 10000)
      assert(OnlineUserDAO.find(MongoDBObject()).toList(0).onlineUsers.size === 1)
    }
  }

  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      OnlineUserDAO.remove(MongoDBObject("onlineUsers" -> ".*".r))
    }
  }

}
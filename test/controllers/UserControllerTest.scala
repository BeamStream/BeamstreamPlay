package controllers

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import org.scalatest.junit.JUnitRunner
import models.UserDAO
import com.mongodb.casbah.commons.MongoDBObject
import play.api.Play
import models.ClassDAO
import models.UserSchoolDAO
import utils.OnlineUserDAO
import play.api.Logger
@RunWith(classOf[JUnitRunner])
class UserControllerTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      Logger.debug(Play.current.configuration.getString("databaseName").get)
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
      OnlineUserDAO.remove(MongoDBObject("onlineUsers" -> ".*".r))
    }
  }
  after {
    running(FakeApplication()) {
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
      OnlineUserDAO.remove(MongoDBObject("onlineUsers" -> ".*".r))

    }
  }

}
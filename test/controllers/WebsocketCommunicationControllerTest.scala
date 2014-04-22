package controllers

import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import play.api.libs.json.JsValue
import play.api.test.Helpers._
import play.api.test.FakeApplication
import models.UserDAO
import com.mongodb.casbah.commons.MongoDBObject
import play.api.test.FakeRequest
import play.api.libs.ws.WS
import scala.concurrent._
import scala.concurrent.duration._
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Play
import org.bson.types.ObjectId
import models.User
import models.UserType
import java.util.Date
import models.ClassType
import java.text.DateFormat
import models.Class
import models.ClassDAO
import models.UserMedia
import models.Token
import play.api.mvc.Cookie
import utils.TokenEmailUtil
import models.UserMediaType
import models.Access
import models.TokenDAO
import models.UserMediaDAO

@RunWith(classOf[JUnitRunner])
class WebsocketCommunicationControllerTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

  test("Websocket Chat") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val result = route(FakeRequest(GET, "/chat").withSession("userId" -> userId.get.toString()))
      assert(result.getClass().toString() === "class scala.None$")
    }
  }
  
  test("Websocket Instantiate Chat") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val result = route(FakeRequest(GET, "/instantiateChat/" + userId.get))
      assert(status(result.get) === 200)
    }
  }
  
  test("Websocket Start Chat") {
    running(FakeApplication()) {
      val user1 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val user1Id = User.createUser(user1)
      val user2 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val user2Id = User.createUser(user2)
      val result = route(FakeRequest(GET, "/startChat/" + user1Id.get + "/" + user2Id.get).withSession("userId" -> user1Id.get.toString()))
      assert(result.getClass().toString() === "class scala.None$")
    }
  }
  
  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

}
package controllers

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.UserMediaDAO
import play.api.test.FakeApplication
import play.api.test.Helpers._
import org.scalatest.junit.JUnitRunner
import models.MessageDAO
import models.User
import org.bson.types.ObjectId
import models.UserType
import play.api.libs.json.JsValue
import play.api.test.FakeRequest
import models.UserDAO
import models.StreamDAO
import models.Message
import models.Type
import models.Access
import java.text.DateFormat
import models.StreamType
import java.util.Date

@RunWith(classOf[JUnitRunner])
class MessageControllerTest extends FunSuite with BeforeAndAfter {
  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
  private def userToBeCreated = {
    User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil,None, None, None)
  }

  before {
    running(FakeApplication()) {
      MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }

  test("Create a new message") {
    val userId = User.createUser(userToBeCreated)
    running(FakeApplication()) {
      val jsonOfMessageToBeCreated = """{"streamId":"51ac27f044ae723fa2ad1c47","messageAccess":"Public","message":"Hello There"}"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonOfMessageToBeCreated)
      val result = route(
        FakeRequest(POST, "/newMessage").
          withJsonBody(json).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }

  }

  test("Rock the message") {
    val userId = User.createUser(userToBeCreated)
    val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), userId.get, None, "", "", 0, Nil, Nil, 0, Nil)
    val messageId = Message.createMessage(message)
    running(FakeApplication()) {
      val result = route(
        FakeRequest(PUT, "/rockedIt/" + messageId.get.toString).
          withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
      assert(contentType(result.get) === Some("application/json"))

    }

  }

  test("Rocker Names") {
    val userId = User.createUser(userToBeCreated)
    val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), userId.get, Option(new ObjectId("51ac27f044ae723fa2ad1c47")), "", "", 0, Nil, Nil, 0, Nil)
    val messageId = Message.createMessage(message)
    running(FakeApplication()) {
      val result = route(
        FakeRequest(GET, "/rockersOf/message/" + messageId.get.toString).
          withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
      assert(contentType(result.get) === Some("application/json"))

    }

  }

  test("Get All Messages For A Stream") {
    val userId = User.createUser(userToBeCreated)
    val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), userId.get, Option(new ObjectId("51ac27f044ae723fa2ad1c47")), "", "", 0, Nil, Nil, 0, Nil)
    val messageId = Message.createMessage(message)
    running(FakeApplication()) {
      val result = route(
        FakeRequest(GET, "/allMessagesForAStream/51ac27f044ae723fa2ad1c47/date/10/1/period").
          withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
      assert(contentType(result.get) === Some("application/json"))

    }

  }

  test("Follow the message") {
    val userId = User.createUser(userToBeCreated)
    val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), userId.get, None, "", "", 0, Nil, Nil, 0, Nil)
    val messageId = Message.createMessage(message)
    running(FakeApplication()) {
      val result = route(
        FakeRequest(PUT, "/follow/message/" + messageId.get.toString).
          withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
      assert(contentType(result.get) === Some("application/json"))

    }

  }

  test("Is the follower") {
    val userId = User.createUser(userToBeCreated)
    val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), userId.get, None, "", "", 0, Nil, Nil, 0, Nil)
    val messageId = Message.createMessage(message)
    running(FakeApplication()) {
      val result = route(
        FakeRequest(GET, "/isAFollowerOf/message/" + messageId.get.toString).
          withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
      assert(contentType(result.get) === Some("application/json"))

    }

  }

  test("Is a Rocker") {
    val userId = User.createUser(userToBeCreated)
    val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), userId.get, None, "", "", 0, Nil, Nil, 0, Nil)
    val messageId = Message.createMessage(message)
    running(FakeApplication()) {
      val result = route(
        FakeRequest(GET, "/isARockerOf/message/" + messageId.get.toString).
          withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
      assert(contentType(result.get) === Some("application/json"))

    }

  }

  test("Delete The Message") {
    val userId = User.createUser(userToBeCreated)
    val stream = models.Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(), true, List())
    val streamId = models.Stream.createStream(stream)
    val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), userId.get, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
    val messageId = Message.createMessage(message)

    running(FakeApplication()) {
      val result = route(
        FakeRequest(PUT, "/remove/message/" + messageId.get.toString).
          withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
      assert(contentType(result.get) === Some("application/json"))

    }

  }

  after {
    running(FakeApplication()) {
      MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }

}
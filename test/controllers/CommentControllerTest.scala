package controllers
import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.CommentDAO
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import org.scalatest.junit.JUnitRunner
import models.UserDAO
import models.MessageDAO
import models.StreamDAO
import models.StreamType
import org.bson.types.ObjectId
import models.User
import models.Message
import models.Comment
import models.UserType
import java.util.Date
import models.Type
import models.Access
import models.Stream
import java.text.DateFormat
import play.api.test.Helpers._
import play.api.test.FakeRequest
import play.api.libs.json.JsValue
@RunWith(classOf[JUnitRunner])
class CommentControllerTest extends FunSuite with BeforeAndAfter {
  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      CommentDAO.remove(MongoDBObject("commentBody" -> ".*".r))
    }
  }

  test("Create a Comment and find comment by id") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val jsonString = """{"messageId": """ + """"""" + messageId.get + """"""" + """ """ + ',' + """ "comment" : "comment" }"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonString)
      val result = route(FakeRequest(POST, "/newComment").withJsonBody(json).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Rocking the comment") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil)
      val commentId = Comment.createComment(comment)
      val result = route(FakeRequest(PUT, "/rockingTheComment/" + commentId.get.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)

    }
  }

  test("Get All Comments For A Model") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil)
      val commentId = Comment.createComment(comment)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(streamId.get), "", "", 0, Nil, List(commentId.get), 0, Nil)
      val messageId = Message.createMessage(message)
      val jsonString = """{"messageId": """ + """"""" + messageId.get + """"""" + """ }"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonString)
      val result = route(FakeRequest(POST, "/getAllComments").withJsonBody(json).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Find Comment Rockers") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "NeelS", "", Option("Neel"), "", "", "", "", Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), userId.get, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil)
      val commentId = Comment.createComment(comment)
      Message.addCommentToMessage(commentId.get, messageId.get)
      val result = route(FakeRequest(PUT, "/rockingTheComment/" + commentId.get.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)

    }
  }

  test("Delete The Comments") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "NeelS", "", Option("Neel"), "", "", "", "", Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), userId.get, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil)
      val commentId = Comment.createComment(comment)
      Message.addCommentToMessage(commentId.get, messageId.get)
      val result = route(FakeRequest(PUT, "/remove/comment/" + messageId.get.toString + "/" + commentId.get.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Is A Rocker") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "NeelS", "", Option("Neel"), "", "", "", "", Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), userId.get, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil)
      val commentId = Comment.createComment(comment)
      Message.addCommentToMessage(commentId.get, messageId.get)
      val result = route(FakeRequest(GET, "/isARockerOf/comment/" + commentId.get.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }
  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      CommentDAO.remove(MongoDBObject("commentBody" -> ".*".r))
    }
  }

}
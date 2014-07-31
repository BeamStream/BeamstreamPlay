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
import models.DocumentDAO
import models.Document
import models.DocType
import models.QuestionDAO
import models.Question
import models.UserMediaDAO
import models.UserMedia
import models.UserMediaType

@RunWith(classOf[JUnitRunner])
class CommentControllerTest extends FunSuite with BeforeAndAfter {
  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      CommentDAO.remove(MongoDBObject("commentBody" -> ".*".r))
      DocumentDAO.remove(MongoDBObject("documentName" -> ".*".r))
      QuestionDAO.remove(MongoDBObject("questionBody" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

  test("Create a Comment and find comment by id") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val jsonString = """{"stream_id": """ + """"""" + streamId.get + """"""" + """ """ + ',' + """"messageId": """ + """"""" + messageId.get + """"""" + """ """ + ',' + """ "comment" : "comment" }"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonString)
      val result = route(FakeRequest(POST, "/newComment").withJsonBody(json).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Create a Document as Comment and find comment by id") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val docToCreate = Document(new ObjectId, "Himanshu'sFile.jpg", "Himanshu'sFile", "http://himanshu.ly/Himanshu'sFile.jpg", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val docId = Document.addDocument(docToCreate)
      val jsonString = """{"stream_id": """ + """"""" + streamId.get + """"""" + """ """ + ',' + """"docId": """ + """"""" + docId + """"""" + """ """ + ',' + """ "comment" : "comment" }"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonString)
      val result = route(FakeRequest(POST, "/newComment").withJsonBody(json).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Create a Question as Comment and find comment by id") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val jsonString = """{"stream_id": """ + """"""" + streamId.get + """"""" + """ """ + ',' + """"questionId": """ + """"""" + questionId.get + """"""" + """ """ + ',' + """ "comment" : "comment" }"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonString)
      val result = route(FakeRequest(POST, "/newComment").withJsonBody(json).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Create a UserMedia as Comment and find comment by id") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val UserMediaObj = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
      val userMediaId = UserMedia.saveMediaForUser(UserMediaObj)
      val jsonString = """{"stream_id": """ + """"""" + streamId.get + """"""" + """ """ + ',' + """"userMediaId": """ + """"""" + userMediaId.get + """"""" + """ """ + ',' + """ "comment" : "comment" }"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonString)
      val result = route(FakeRequest(POST, "/newComment").withJsonBody(json).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Rocking the comment") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil, streamId.get)
      val commentId = Comment.createComment(comment)
      val result = route(FakeRequest(PUT, "/rockingTheComment/" + commentId.get.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)

    }
  }

  test("Get All Comments For A Model") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil, streamId.get)
      val commentId = Comment.createComment(comment)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(streamId.get), "", "", 0, Nil, List(commentId.get), 0, Nil)
      val messageId = Message.createMessage(message)
      val jsonString = """{"messageId": """ + """"""" + messageId.get + """"""" + """ }"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonString)
      val result = route(FakeRequest(POST, "/getAllComments").withJsonBody(json).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Get All Comments For A Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil, streamId.get)
      val commentId = Comment.createComment(comment)
      val docToCreate = Document(new ObjectId, "Himanshu'sFile.jpg", "Himanshu'sFile", "http://himanshu.ly/Himanshu'sFile.jpg", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, List(commentId.get), Nil, "")
      val docId = Document.addDocument(docToCreate)
      val jsonString = """{"docId": """ + """"""" + docId + """"""" + """ }"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonString)
      val result = route(FakeRequest(POST, "/getAllComments").withJsonBody(json).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Get All Comments For A Question") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil, streamId.get)
      val commentId = Comment.createComment(comment)
      val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, List(commentId.get), Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val jsonString = """{"questionId": """ + """"""" + questionId.get + """"""" + """ }"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonString)
      val result = route(FakeRequest(POST, "/getAllComments").withJsonBody(json).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Find Comment Rockers") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "NeelS", "", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), userId.get, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil, streamId.get)
      val commentId = Comment.createComment(comment)
      Message.addCommentToMessage(commentId.get, messageId.get)
      val result = route(FakeRequest(PUT, "/rockingTheComment/" + commentId.get.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)

    }
  }

  test("Delete The Comments") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "NeelS", "", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), userId.get, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil, streamId.get)
      val commentId = Comment.createComment(comment)
      Message.addCommentToMessage(commentId.get, messageId.get)
      val result = route(FakeRequest(PUT, "/remove/comment/" + messageId.get.toString + "/" + commentId.get.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Is A Rocker") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "NeelS", "", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), userId.get, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil, streamId.get)
      val commentId = Comment.createComment(comment)
      Message.addCommentToMessage(commentId.get, messageId.get)
      val result = route(FakeRequest(GET, "/isARockerOf/comment/" + commentId.get.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("New Answer of a Question") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "NeelS", "", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
    val userId = User.createUser(user)
    val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
    val streamId = Stream.createStream(stream)
    val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
    val questionId = Question.addQuestion(question)
    val jsonString = """{"streamId": """ + """"""" + streamId.get + """"""" + """ """ + ',' + """"answerText":"Good","questionId":""" + """"""" + questionId.get + """"""" + """}"""
    val json: JsValue = play.api.libs.json.Json.parse(jsonString)
    running(FakeApplication()) {
      val result = route(
        FakeRequest(POST, "/answer").
          withJsonBody(json).withSession("userId" -> userId.get.toString())).get
      assert(status(result) === 200)
    }
  }

  test("Get Comment Rockers") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "NeelS", "", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), userId.get, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, List(userId.get), streamId.get)
      val commentId = Comment.createComment(comment)
      Message.addCommentToMessage(commentId.get, messageId.get)
      val result = route(FakeRequest(GET, "/rockersOf/comment/" + commentId.get.toString))
      assert(status(result.get) === 200)
    }
  }
  
  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      CommentDAO.remove(MongoDBObject("commentBody" -> ".*".r))
      DocumentDAO.remove(MongoDBObject("documentName" -> ".*".r))
      QuestionDAO.remove(MongoDBObject("questionBody" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

}
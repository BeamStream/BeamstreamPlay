package models
import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import java.util.Date
import java.text.DateFormat
import play.api.test.Helpers.running
import play.api.test.FakeApplication

@RunWith(classOf[JUnitRunner])
class CommentTest extends FunSuite with BeforeAndAfter {

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
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, List(userId.get))
      val commentId = Comment.createComment(comment)
      assert(Comment.findCommentById(commentId.get).get.commentBody === "Comment1")
    }
  }

  test("Rocking the comment & Rockers List") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil)
      val commentId = Comment.createComment(comment)
      assert(Comment.rockTheComment(commentId.get, userId.get) === 1)
    }
  }

  test("Get All Comments For A Model") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil)
      val commentId = Comment.createComment(comment)
      val anotherComment = Comment(new ObjectId, "Comment2", new Date, userId.get, user.firstName, user.lastName, 11, Nil)
      val anotherCommentId = Comment.createComment(anotherComment)

      assert(Comment.getAllComments(List(commentId.get, anotherCommentId.get)).size === 2)
      assert(Comment.getAllComments(List(commentId.get, anotherCommentId.get))(0).comment.commentBody === "Comment1")
      assert(Comment.getAllComments(List(commentId.get, anotherCommentId.get))(1).comment.commentBody === "Comment2")
    }
  }

  //  test("Testing the Visitors Pattern") {
  //    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", "", Option("Neel"), "", "", "", "", "", None, Nil, Nil, Nil, Nil, Nil, None)
  //    val userId = User.createUser(user)
  //    val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
  //    val streamId = Stream.createStream(stream)
  //    val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
  //    val messageId = Message.createMessage(message)
  //    val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil)
  //    val commentId = Comment.createComment(comment)
  //    Message.addCommentToMessage(commentId, messageId.get)
  //    assert(Message.findMessageById(messageId.get).get.comments.size === 1)
  //    val otherComment = Comment(new ObjectId, "Comment2", new Date, userId.get, user.firstName, user.lastName, 0, Nil)
  //    val otherCommentId = Comment.createComment(otherComment)
  //    Message.addCommentToMessage(commentId, messageId.get)
  //    assert(Message.findMessageById(messageId.get).get.comments.size === 2)
  //
  //  }

  test("Delete The Comments") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "NeelS", "", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), userId.get, Option(streamId.get), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, Nil)
      val commentId = Comment.createComment(comment)
      Message.addCommentToMessage(commentId.get, messageId.get)
      assert(Message.findMessageById(messageId.get).get.comments.size === 1)
      Comment.deleteCommentPermanently(commentId.get, messageId.get, userId.get)
      assert(CommentDAO.find(MongoDBObject()).size == 0)
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
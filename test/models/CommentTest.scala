package models
import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import java.util.Date
import java.text.DateFormat

@RunWith(classOf[JUnitRunner])
class CommentTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  test("Create a new Comment and find comment by id") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "","", List(), List(), List(), List(), List())
    val userId = User.createUser(user)

    val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId), true, List())
    val streamId = Stream.createStream(stream)

    val message = Message(new ObjectId, "some message", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("23-07-12"), user.id, Option(streamId), "", "", 0, List(), List(), 0, List())
    val messageId = Message.createMessage(message)

    val comment = new Comment(new ObjectId, "Comment1", new Date, userId, user.firstName, user.lastName, 0, List(userId))

    val commentId = Comment.createComment(comment)

    assert(Comment.findCommentById(commentId).commentBody === "Comment1")

  }

  test("Rocking the comment & Rockers List") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus","", "", List(), List(), List(), List(), List())
    val userId = User.createUser(user)

    val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId), true, List())
    val streamId = Stream.createStream(stream)

    val message = Message(new ObjectId, "some message", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("23-07-12"), user.id, Option(streamId), "", "", 0, List(), List(), 0, List())
    val messageId = Message.createMessage(message)

    val comment = new Comment(new ObjectId, "Comment1", new Date, userId, user.firstName, user.lastName, 0, List())

    val commentId = Comment.createComment(comment)
    assert(Comment.rockTheComment(commentId, userId) === 1)
  }

  test("Get All Comments For A Model") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "","", List(), List(), List(), List(), List())
    val userId = User.createUser(user)

    val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId), true, List())
    val streamId = Stream.createStream(stream)

    val message = Message(new ObjectId, "some message", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("23-07-12"), user.id, Option(streamId), "", "", 0, List(), List(), 0, List())
    val messageId = Message.createMessage(message)

    val comment = new Comment(new ObjectId, "Comment1", new Date, userId, user.firstName, user.lastName, 0, List())
    val commentId = Comment.createComment(comment)

    val anotherComment = new Comment(new ObjectId, "Comment2", new Date, userId, user.firstName, user.lastName, 11, List())
    val anotherCommentId = Comment.createComment(anotherComment)

    assert(Comment.getAllComments(List(commentId, anotherCommentId)).size === 2)
    assert(Comment.getAllComments(List(commentId, anotherCommentId))(0).commentBody === "Comment1")
    assert(Comment.getAllComments(List(commentId, anotherCommentId))(1).commentBody === "Comment2")
  }

  test("Testing the Visitors Pattern") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "","", List(), List(), List(), List(), List())
    val userId = User.createUser(user)

    val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId), true, List())
    val streamId = Stream.createStream(stream)

    val message = Message(new ObjectId, "some message", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("23-07-12"), user.id, Option(streamId), "", "", 0, List(), List(), 0, List())
    val messageId = Message.createMessage(message)

    val comment = new Comment(new ObjectId, "Comment1", new Date, userId, user.firstName, user.lastName, 0, List())

    val commentId = Comment.createComment(comment)
    Message.addCommentToMessage(commentId,messageId)
    assert(Message.findMessageById(messageId).get.comments.size === 1)
        
    val otherComment = new Comment(new ObjectId, "Comment2", new Date, userId, user.firstName, user.lastName, 0, List())
    val otherCommentId = Comment.createComment(otherComment)
    Message.addCommentToMessage(commentId,messageId)
    assert(Message.findMessageById(messageId).get.comments.size === 2)

  }

  after {

    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
  }

}
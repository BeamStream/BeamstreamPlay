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
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", List(), List(), List(), List(), List())
    val userId = User.createUser(user)

    val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId), true, List())
    val streamId = Stream.createStream(stream)

    val message = Message(new ObjectId, "some message", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("23-07-12"), user.id, Option(streamId), "", "", 0, List(), List(), 0, List())
    val messageId = Message.createMessage(message)

    val comment = new Comment(new ObjectId, "Comment1", new Date, userId, user.firstName, user.lastName, 0, List(userId), 0, List(userId))

    val commentId = Message.addCommentToMessage(comment, messageId)

    assert(Message.findMessageById(messageId).comments.size === 1)
    assert(Message.findMessageById(messageId).comments(0).firstNameofCommentPoster === "Neel")

    val commentFound = Comment.findCommentById(messageId, commentId)
    assert(commentFound.commentBody === "Comment1")
  }

  test("Rocking the comment & Rockers List") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", List(), List(), List(), List(), List())
    val userId = User.createUser(user)

    val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId), true, List())
    val streamId = Stream.createStream(stream)

    val message = Message(new ObjectId, "some message", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("23-07-12"), user.id, Option(streamId), "", "", 0, List(), List(), 0, List())
    val messageId = Message.createMessage(message)

    val comment = new Comment(new ObjectId, "Comment1", new Date, userId, user.firstName, user.lastName, 0, List(), 0, List())

    val commentId = Message.addCommentToMessage(comment, messageId)

    assert(Message.findMessageById(messageId).comments.size === 1)
    assert(Message.findMessageById(messageId).comments(0).firstNameofCommentPoster === "Neel")

    val anotherUser = User(new ObjectId, UserType.Professional, "chris@beamstream.com", "Chris", "Coxx", "", "Crizzle", "Chris", "Beamstream", "", List(), List(), List(), List(), List())
    val anotherUserId = User.createUser(anotherUser)

    Comment.rockingTheComment(messageId, commentId, anotherUserId)

    assert(Message.findMessageById(messageId).comments(0).rockers(0) === anotherUserId)
    assert(Message.findMessageById(messageId).comments(0).rocks === 1)

    val rockerNames = Comment.commentRockersList(messageId, commentId)
    assert(rockerNames(0) === "Chris")
  }

  after {

    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
  }

}
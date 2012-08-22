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

  test("Create a new Comment") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", List(), List(), List(), List(), List())
    val userId = User.createUser(user)

    val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId), true, List())
    val streamId = Stream.createStream(stream)

    val message = Message(new ObjectId, "some message", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("23-07-12"), user.id, Option(streamId), "", "", 0, List(), List(), 0, List())
    val messageId = Message.createMessage(message)

    val comment = new Comment(new ObjectId, "Comment1", new Date, userId, user.firstName, user.lastName, 0, List(userId), 0, List(userId))

    Message.addCommentToMessage(comment, messageId)

    assert(Message.findMessageById(messageId).comments.size === 1)
    assert(Message.findMessageById(messageId).comments(0).firstNameofCommentPoster === "Neel")

  }

  //  test("Find comment by Id") {
  //    val userId = User.createUser(user)
  //    val commentA = new Comment(new ObjectId, "CommentA", new Date, userId, user.firstName, user.lastName, 0, List(userId), 0, List(userId))
  //    val commentB = new Comment(new ObjectId, "CommentB", new Date, userId, user.firstName, user.lastName, 0, List(userId), 0, List(userId))
  //    val commentAId = Comment.createComment(commentA)
  //    val commentBId = Comment.createComment(commentB)
  //    assert(CommentDAO.find(MongoDBObject()).toList.size === 2)
  //
  //  }

  after {

    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

}
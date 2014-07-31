package models

import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import java.text.DateFormat
import java.util.Date
import play.api.test.Helpers.running
import play.api.test.FakeApplication

@RunWith(classOf[JUnitRunner])
class MessageEntityTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
  val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, user.id, List(user.id), true, Nil)

  before {
    running(FakeApplication()) {
      StreamDAO.remove(MongoDBObject("name" -> ".*".r))
      MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      User.createUser(user)
      Stream.createStream(stream)
    }
  }

  test("Message Removal") {
    running(FakeApplication()) {

      val stream = StreamDAO.find(MongoDBObject()).toList(0)
      val user = UserDAO.find(MongoDBObject()).toList(0)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(stream.id), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val messagesBefore = MessageDAO.find(MongoDBObject())
      assert(messagesBefore.size === 1)
      Message.removeMessage(message)
      val messagesAfter = MessageDAO.find(MongoDBObject())
      assert(messagesAfter.size === 0)
    }
  }

  test("Message Creation") {
    running(FakeApplication()) {

      val stream = StreamDAO.find(MongoDBObject()).toList(0)
      val user = UserDAO.find(MongoDBObject()).toList(0)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(stream.id), "", "", 0, Nil, Nil, 0, Nil)
      val messagesBefore = MessageDAO.find(MongoDBObject())
      assert(messagesBefore.size === 0)
      val messageId = Message.createMessage(message)
      val messagesAfter = MessageDAO.find(MongoDBObject())
      assert(messagesAfter.size === 1)
    }
  }

  test("Find Message By Id & Remove Message") {
    running(FakeApplication()) {
      val stream = StreamDAO.find(MongoDBObject()).toList(0)
      val user = UserDAO.find(MongoDBObject()).toList(0)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(stream.id), "", "", 0, Nil, Nil, 0, Nil)
      val messagesBefore = MessageDAO.find(MongoDBObject())
      assert(messagesBefore.size === 0)
      val messageId = Message.createMessage(message)
      val messageFound = Message.findMessageById(messageId.get)
      assert(messageFound != None)
      assert(messageFound.get.messageBody === "some message")
    }
  }

  test("Message Creation and rocking the message") {
    running(FakeApplication()) {
      val stream = StreamDAO.find(MongoDBObject()).toList(0)
      val user = UserDAO.find(MongoDBObject()).toList(0)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(stream.id), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val messageBefore = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
      //Rocks Before
      assert(messageBefore.rocks === 0)
      Message.rockedIt(messageId.get, user.id)
      val messageAfter = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
      //Rocks After
      assert(messageAfter.rocks === 1)
      assert(messageAfter.rockers.size === 1)
      assert(messageAfter.rockers(0) === user.id)
      val rockersList = Message.rockersNames(messageAfter.id)
      assert(rockersList === List("Neel "))
      //Rocks Again After
      Message.rockedIt(messageId.get, user.id)
      val messageAgainAfter = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
      assert(messageAgainAfter.rocks === 0)
      assert(messageAgainAfter.rockers.size === 0)
      val rockersAgainList = Message.rockersNames(messageAfter.id)
      assert(rockersAgainList.size === 0)
    }
  }

  test("Get All Messages For A Stream Along With Description") {
    running(FakeApplication()) {
      val stream = StreamDAO.find(MongoDBObject()).toList(0)
      val user = UserDAO.find(MongoDBObject()).toList(0)
      val userMedia = UserMedia(new ObjectId, "Neel", "", user.id, formatter.parse("23-07-12"), "http://neel.com/neel.jpg", UserMediaType.Image, Access.Public, true,
        None, "", 1, Nil, Nil, 0)
      val mediaId = UserMedia.saveMediaForUser(userMedia)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(stream.id), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val allMessages = Message.getAllMessagesForAStreamWithPagination(stream.id, 1, 10)
      assert(allMessages.size === 1)
      assert(Message.messagesAlongWithDocDescription(allMessages, user.id)(0).profilePic === Option("http://neel.com/neel.jpg"))
    }
  }

  test("Get All Messages For A Stream Sorted By Date / Pagination") {
    running(FakeApplication()) {
      val stream = StreamDAO.find(MongoDBObject()).toList(0)
      val user = UserDAO.find(MongoDBObject()).toList(0)
      val message5 = Message(new ObjectId, "some message5", Option(Type.Audio), Option(Access.PrivateToClass), formatter.parse("21-12-12"), user.id, Option(stream.id), "", "", 0, Nil, Nil, 0, Nil)
      val message1 = Message(new ObjectId, "some message1", Option(Type.Audio), Option(Access.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 0, Nil, Nil, 0, Nil)
      val message2 = Message(new ObjectId, "some message2", Option(Type.Audio), Option(Access.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 0, Nil, Nil, 0, Nil)
      val message3 = Message(new ObjectId, "some message3", Option(Type.Audio), Option(Access.PrivateToClass), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 0, Nil, Nil, 0, Nil)
      val message4 = Message(new ObjectId, "some message4", Option(Type.Audio), Option(Access.Public), formatter.parse("21-07-12"), user.id, Option(stream.id), "", "", 0, Nil, Nil, 0, Nil)
      Message.createMessage(message5)
      Message.createMessage(message1)
      Message.createMessage(message2)
      Message.createMessage(message3)
      Message.createMessage(message4)
      val allMessages = Message.getAllMessagesForAStreamWithPagination(stream.id, 1, 10)
      assert(allMessages.head.messageBody === "some message5")
    }
  }

  test("Get All Messages For A Stream Sorted By Rock") {
    running(FakeApplication()) {
      val stream = StreamDAO.find(MongoDBObject()).toList(0)
      val user = UserDAO.find(MongoDBObject()).toList(0)
      val message5 = Message(new ObjectId, "some message5", Option(Type.Audio), Option(Access.PrivateToClass), formatter.parse("21-12-12"), user.id, Option(stream.id), "", "", 8, Nil, Nil, 0, Nil)
      val message1 = Message(new ObjectId, "some message1", Option(Type.Audio), Option(Access.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 6, Nil, Nil, 0, Nil)
      val message2 = Message(new ObjectId, "some message2", Option(Type.Audio), Option(Access.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 4, Nil, Nil, 0, Nil)
      val message3 = Message(new ObjectId, "some message3", Option(Type.Audio), Option(Access.PrivateToClass), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 12, Nil, Nil, 0, Nil)
      val message4 = Message(new ObjectId, "some message4", Option(Type.Audio), Option(Access.Public), formatter.parse("21-07-12"), user.id, Option(stream.id), "", "", 7, Nil, Nil, 0, Nil)
      Message.createMessage(message5)
      Message.createMessage(message1)
      Message.createMessage(message2)
      Message.createMessage(message3)
      Message.createMessage(message4)
      val allMessages = Message.getAllMessagesForAStreamSortedbyRocks(stream.id, 1, 10)
      assert(allMessages.head.messageBody === "some message3")
      assert(allMessages(1).messageBody === "some message5")
    }
  }
  test("Get All Messages For A KeyWord") {
    running(FakeApplication()) {
      val stream = StreamDAO.find(MongoDBObject()).toList(0)
      val user = UserDAO.find(MongoDBObject()).toList(0)
      val message5 = Message(new ObjectId, "some message5", Option(Type.Audio), Option(Access.PrivateToClass), formatter.parse("21-12-12"), user.id, Option(stream.id), "", "", 8, Nil, Nil, 0, Nil)
      val message1 = Message(new ObjectId, "some message1", Option(Type.Audio), Option(Access.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 6, Nil, Nil, 0, Nil)
      val message2 = Message(new ObjectId, "some message2", Option(Type.Audio), Option(Access.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 4, Nil, Nil, 0, Nil)
      val message3 = Message(new ObjectId, "some message3", Option(Type.Audio), Option(Access.PrivateToClass), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 12, Nil, Nil, 0, Nil)
      val message4 = Message(new ObjectId, "some message4", Option(Type.Audio), Option(Access.Public), formatter.parse("21-07-12"), user.id, Option(stream.id), "", "", 7, Nil, Nil, 0, Nil)
      Message.createMessage(message5)
      Message.createMessage(message1)
      Message.createMessage(message2)
      Message.createMessage(message3)
      Message.createMessage(message4)
      val allMessages = Message.getAllMessagesForAKeyword("age5", stream.id, 1, 10, Nil)
      assert(allMessages.size === 1)
      assert(allMessages.head.messageBody === "some message5")
    }
  }

  test("Follow the message") {
    running(FakeApplication()) {
      val stream = StreamDAO.find(MongoDBObject()).toList(0)
      val user = UserDAO.find(MongoDBObject()).toList(0)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(stream.id), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val messageBefore = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
      //Rocks Before
      assert(messageBefore.follows === 0)
      Message.followMessage(messageId.get, user.id)
      val messageAfter = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
      //Rocks After
      assert(messageAfter.follows === 1)
      assert(messageAfter.followers.size === 1)
      assert(messageAfter.followers(0) === user.id)
      //Rocks Again
      Message.followMessage(messageId.get, user.id)
      val messageAgain = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
      assert(messageAgain.follows === 0)
      assert(messageAgain.followers.size === 0)
    }
  }
  test("Get All Public Messages For A Stream") {
    running(FakeApplication()) {
      val stream = StreamDAO.find(MongoDBObject()).toList(0)
      val user = UserDAO.find(MongoDBObject()).toList(0)
      val message5 = Message(new ObjectId, "some message5", Option(Type.Audio), Option(Access.PrivateToClass), formatter.parse("21-12-12"), user.id, Option(stream.id), "", "", 8, Nil, Nil, 0, Nil)
      val message1 = Message(new ObjectId, "some message1", Option(Type.Audio), Option(Access.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 6, Nil, Nil, 0, Nil)
      val message2 = Message(new ObjectId, "some message2", Option(Type.Audio), Option(Access.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 4, Nil, Nil, 0, Nil)
      val message3 = Message(new ObjectId, "some message3", Option(Type.Audio), Option(Access.PrivateToClass), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 12, Nil, Nil, 0, Nil)
      val message4 = Message(new ObjectId, "some message4", Option(Type.Audio), Option(Access.Public), formatter.parse("21-07-12"), user.id, Option(stream.id), "", "", 7, Nil, Nil, 0, Nil)
      Message.createMessage(message5)
      Message.createMessage(message1)
      Message.createMessage(message2)
      Message.createMessage(message3)
      Message.createMessage(message4)
      val allMessages = Message.getAllPublicMessagesForAStream(stream.id)
      assert(allMessages.size === 3)
    }
  }

  test("Get All Public Messages For A User") {
    running(FakeApplication()) {
      val stream = StreamDAO.find(MongoDBObject()).toList(0)
      val user = UserDAO.find(MongoDBObject()).toList(0)
      val message5 = Message(new ObjectId, "some message5", Option(Type.Audio), Option(Access.PrivateToClass), formatter.parse("21-12-12"), user.id, Option(stream.id), "", "", 8, Nil, Nil, 0, Nil)
      val message1 = Message(new ObjectId, "some message1", Option(Type.Audio), Option(Access.Public), formatter.parse("21-04-12"), new ObjectId, Option(stream.id), "", "", 6, Nil, Nil, 0, Nil)
      val message2 = Message(new ObjectId, "some message2", Option(Type.Audio), Option(Access.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 4, Nil, Nil, 0, Nil)
      val message3 = Message(new ObjectId, "some message3", Option(Type.Audio), Option(Access.PrivateToClass), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 12, Nil, Nil, 0, Nil)
      val message4 = Message(new ObjectId, "some message4", Option(Type.Audio), Option(Access.Public), formatter.parse("21-07-12"), user.id, Option(stream.id), "", "", 7, Nil, Nil, 0, Nil)
      Message.createMessage(message5)
      Message.createMessage(message1)
      Message.createMessage(message2)
      Message.createMessage(message3)
      Message.createMessage(message4)
      val allMessages = Message.getAllPublicMessagesForAUser(user.id)
      assert(allMessages.size === 2)
    }
  }

  test("Get All  Messages For A User") {
    running(FakeApplication()) {
      val stream = StreamDAO.find(MongoDBObject()).toList(0)
      val user = UserDAO.find(MongoDBObject()).toList(0)
      val message5 = Message(new ObjectId, "some message5", Option(Type.Audio), Option(Access.PrivateToClass), formatter.parse("21-12-12"), user.id, Option(stream.id), "", "", 8, Nil, Nil, 0, Nil)
      val message1 = Message(new ObjectId, "some message1", Option(Type.Audio), Option(Access.Public), formatter.parse("21-04-12"), new ObjectId, Option(stream.id), "", "", 6, Nil, Nil, 0, Nil)
      val message2 = Message(new ObjectId, "some message2", Option(Type.Audio), Option(Access.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 4, Nil, Nil, 0, Nil)
      val message3 = Message(new ObjectId, "some message3", Option(Type.Audio), Option(Access.PrivateToClass), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 12, Nil, Nil, 0, Nil)
      val message4 = Message(new ObjectId, "some message4", Option(Type.Audio), Option(Access.Public), formatter.parse("21-07-12"), user.id, Option(stream.id), "", "", 7, Nil, Nil, 0, Nil)
      Message.createMessage(message5)
      Message.createMessage(message1)
      Message.createMessage(message2)
      Message.createMessage(message3)
      Message.createMessage(message4)
      val allMessages = Message.getAllMessagesForAUser(user.id)
      assert(allMessages.size === 4)
    }
  }

  test("Add Comment to message") {
    running(FakeApplication()) {
      val message = Message(new ObjectId, "some message1", Option(Type.Audio), Option(Access.Public), formatter.parse("21-04-12"), new ObjectId, Option(stream.id), "", "", 6, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      assert(Message.findMessageById(messageId.get).head.comments.size === 0)
      val comment = Comment(new ObjectId, "Comment1", new Date, user.id, user.firstName, user.lastName, 0, Nil, stream.id)
      Comment.createComment(comment)
      Message.addCommentToMessage(comment.id, message.id)
      assert(Message.findMessageById(messageId.get).head.comments.size === 1)
    }
  }

  test("Remove Comment to message") {
    running(FakeApplication()) {
      val message = Message(new ObjectId, "some message1", Option(Type.Audio), Option(Access.Public), formatter.parse("21-04-12"), new ObjectId, Option(stream.id), "", "", 6, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      assert(Message.findMessageById(messageId.get).head.comments.size === 0)
      val comment = Comment(new ObjectId, "Comment1", new Date, user.id, user.firstName, user.lastName, 0, Nil, stream.id)
      Comment.createComment(comment)
      Message.addCommentToMessage(comment.id, message.id)
      assert(Message.findMessageById(messageId.get).head.comments.size === 1)
      Message.removeCommentFromMessage(comment.id, message.id)
      assert(Message.findMessageById(messageId.get).head.comments.size === 0)
    }
  }

  test("Delete message") {
    running(FakeApplication()) {
      val message = Message(new ObjectId, "some message1", Option(Type.Audio), Option(Access.Public), formatter.parse("21-04-12"), new ObjectId, Option(stream.id), "", "", 6, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      assert(Message.findMessageById(messageId.get).size === 1)
      val messageDeleted = Message.deleteMessagePermanently(message.id, user.id)
      assert(messageDeleted === true)
      assert(Message.findMessageById(messageId.get).size === 0)
    }
  }
  after {
    running(FakeApplication()) {
      StreamDAO.remove(MongoDBObject("name" -> ".*".r))
      MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }
}

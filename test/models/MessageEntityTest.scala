package models
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import java.text.DateFormat


@RunWith(classOf[JUnitRunner])
class MessageEntityTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
 
  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", "", Option("Neel"), "", "", "", "", "", None, List(), List(), List(), List(), List(),None)
  val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(user.id), true, List())

  before {
    StreamDAO.remove(MongoDBObject("name" -> ".*".r))
    MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    User.createUser(user)
    Stream.createStream(stream)
  }

  test("Message Creation") {
    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)
    val message = Message(new ObjectId, "some message", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("23-07-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val messagesBefore = MessageDAO.find(MongoDBObject())
    assert(messagesBefore.size === 0)
    val messageId = Message.createMessage(message)
    val messagesAfter = MessageDAO.find(MongoDBObject())
    assert(messagesAfter.size === 1)
  }

  test("Find Message By Id & Remove Message") {
    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)
    val message = Message(new ObjectId, "some message", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("23-07-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val messagesBefore = MessageDAO.find(MongoDBObject())
    assert(messagesBefore.size === 0)
    val messageId = Message.createMessage(message)
    val messageFound = Message.findMessageById(messageId.get)
    assert(messageFound != None)
    assert(messageFound.get.messageBody === "some message")
  }

  test("Message Creation and rocking the message") {

    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)
    val message = Message(new ObjectId, "some message", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("23-07-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
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
    assert(rockersList === List("Neel"))
  }

  test("Get All Messages For A Stream Along With Description") {
    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)
    val userMedia = UserMedia(new ObjectId, "Neel", "", user.id, formatter.parse("23-07-12"), "http://neel.com/neel.jpg", UserMediaType.Image, DocumentAccess.Public, true,
      "", 1, List(), List(), 0)
    val mediaId = UserMedia.saveMediaForUser(userMedia)
    val message = Message(new ObjectId, "some message", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("23-07-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val messageId = Message.createMessage(message)
    val allMessages = Message.getAllMessagesForAStreamWithPagination(stream.id, 1, 10)
    assert(allMessages.size === 1)
    assert(Message.messagesAlongWithDocDescription(allMessages, user.id)(0).profilePic === Option("http://neel.com/neel.jpg"))
  }

  test("Get All Messages For A Stream Sorted By Date / Pagination") {
    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)
    val message5 = Message(new ObjectId, "some message5", Option(MessageType.Audio), Option(MessageAccess.PrivateToClass), formatter.parse("21-12-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message1 = Message(new ObjectId, "some message1", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message2 = Message(new ObjectId, "some message2", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message3 = Message(new ObjectId, "some message3", Option(MessageType.Audio), Option(MessageAccess.PrivateToClass), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message4 = Message(new ObjectId, "some message4", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-07-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    Message.createMessage(message5)
    Message.createMessage(message1)
    Message.createMessage(message2)
    Message.createMessage(message3)
    Message.createMessage(message4)
    val allMessages = Message.getAllMessagesForAStreamWithPagination(stream.id, 1, 10)
    assert(allMessages.head.messageBody === "some message5")
  }

  test("Get All Messages For A Stream Sorted By Rock") {
    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)
    val message5 = Message(new ObjectId, "some message5", Option(MessageType.Audio), Option(MessageAccess.PrivateToClass), formatter.parse("21-12-12"), user.id, Option(stream.id), "", "", 8, List(), List(), 0, List())
    val message1 = Message(new ObjectId, "some message1", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 6, List(), List(), 0, List())
    val message2 = Message(new ObjectId, "some message2", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 4, List(), List(), 0, List())
    val message3 = Message(new ObjectId, "some message3", Option(MessageType.Audio), Option(MessageAccess.PrivateToClass), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 12, List(), List(), 0, List())
    val message4 = Message(new ObjectId, "some message4", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-07-12"), user.id, Option(stream.id), "", "", 7, List(), List(), 0, List())
    Message.createMessage(message5)
    Message.createMessage(message1)
    Message.createMessage(message2)
    Message.createMessage(message3)
    Message.createMessage(message4)
    val allMessages = Message.getAllMessagesForAStreamSortedbyRocks(stream.id, 1, 10)
    assert(allMessages.head.messageBody === "some message3")
    assert(allMessages(1).messageBody === "some message5")
  }

  test("Get All Messages For A KeyWord") {
    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)
    val message5 = Message(new ObjectId, "some message5", Option(MessageType.Audio), Option(MessageAccess.PrivateToClass), formatter.parse("21-12-12"), user.id, Option(stream.id), "", "", 8, List(), List(), 0, List())
    val message1 = Message(new ObjectId, "some message1", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 6, List(), List(), 0, List())
    val message2 = Message(new ObjectId, "some message2", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 4, List(), List(), 0, List())
    val message3 = Message(new ObjectId, "some message3", Option(MessageType.Audio), Option(MessageAccess.PrivateToClass), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 12, List(), List(), 0, List())
    val message4 = Message(new ObjectId, "some message4", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-07-12"), user.id, Option(stream.id), "", "", 7, List(), List(), 0, List())
    Message.createMessage(message5)
    Message.createMessage(message1)
    Message.createMessage(message2)
    Message.createMessage(message3)
    Message.createMessage(message4)
    val allMessages = Message.getAllMessagesForAKeyword("age5", stream.id, 1, 10)
    assert(allMessages.size === 1)
    assert(allMessages.head.messageBody === "some message5")

  }

  test("Follow the message") {
    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)
    val message = Message(new ObjectId, "some message", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("23-07-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
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
  }

  after {
    StreamDAO.remove(MongoDBObject("name" -> ".*".r))
    MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }
}

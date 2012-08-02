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
  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", List(), List(), List(), List())
  val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(user.id), true, List())

  before {
    User.createUser(user)
    Stream.createStream(stream)
  }

  test("Message Creation") {

    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)

    val message = Message(new ObjectId, "some message", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("23-07-12"), user.id, Option(stream.id), "", "", 0, List(), List())

    val messageId = Message.createMessage(message)

    val messageBefore = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)

    //Rocks Before
    assert(messageBefore.rocks === 0)

    Message.rockedIt(messageId, user.id)

    val messageAfter = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
    //Rocks After
    assert(messageAfter.rocks === 1)
    assert(messageAfter.rockers.size === 1)
    assert(messageAfter.rockers(0) === user.id)

    val rockersList = Message.rockersNames(messageAfter.id)
    assert(rockersList === List("Neel"))

  }

  test("Sort message by date") {

    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)

    val message5 = Message(new ObjectId, "some message1", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-12-12"), user.id, Option(stream.id), "", "", 0, List(), List())
    val message1 = Message(new ObjectId, "some message1", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 0, List(), List())
    val message2 = Message(new ObjectId, "some message2", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 0, List(), List())
    val message3 = Message(new ObjectId, "some message3", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 0, List(), List())
    val message4 = Message(new ObjectId, "some message4", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-07-12"), user.id, Option(stream.id), "", "", 0, List(), List())

    Message.createMessage(message5)
    Message.createMessage(message1)
    Message.createMessage(message2)
    Message.createMessage(message3)
    Message.createMessage(message4)

    assert(Message.getAllMessagesForAStream(stream.id)(3).timeCreated === formatter.parse("21-01-12")) // Without sorting by time
    assert(Message.getAllMessagesForAStreamSortedbyDate(stream.id)(3).timeCreated === formatter.parse("21-07-12")) // Sorting by date
  }

  test("Sort message by total rocks") {

    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)

    val message5 = Message(new ObjectId, "some message1", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-12-12"), user.id, Option(stream.id), "", "", 2, List(), List())
    val message1 = Message(new ObjectId, "some message1", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 5, List(), List())
    val message2 = Message(new ObjectId, "some message2", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 7, List(), List())
    val message3 = Message(new ObjectId, "some message3", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 9, List(), List())
    val message4 = Message(new ObjectId, "some message4", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-07-12"), user.id, Option(stream.id), "", "", 1, List(), List())

    Message.createMessage(message5)
    Message.createMessage(message1)
    Message.createMessage(message2)
    Message.createMessage(message3)
    Message.createMessage(message4)

    assert(Message.getAllMessagesForAStream(stream.id)(3).rocks === 9) // Without sorting by rocks
    assert(Message.getAllMessagesForAStreamSortedbyRocks(stream.id)(3).rocks === 7) // Sorting by rocks
  }

  test("Get all message by keyword and Limit") {

    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)

    val message1 = Message(new ObjectId, "This is Neel", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 5, List(), List())
    val message2 = Message(new ObjectId, "This is Chris", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 7, List(), List())
    val message3 = Message(new ObjectId, "This is Vikas", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 9, List(), List())

    Message.createMessage(message1)
    Message.createMessage(message2)
    Message.createMessage(message3)

    assert(Message.getAllMessagesForAKeyword("This is").size === 3)
    assert(Message.getAllMessagesForAKeyword("Neel").size === 1)

  }

  test("Get All Message For a stream with Pagination Implemeted") {

    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)

    val message1 = Message(new ObjectId, "This is Neel", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 5, List(), List())
    val message2 = Message(new ObjectId, "This is Chris", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 7, List(), List())
    val message3 = Message(new ObjectId, "This is Vikas", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 9, List(), List())
    val message4 = Message(new ObjectId, "This is Sachdeva", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-05-12"), user.id, Option(stream.id), "", "", 9, List(), List())

    Message.createMessage(message1)
    Message.createMessage(message2)
    Message.createMessage(message3)
    Message.createMessage(message4)

    assert(Message.getAllMessagesForAStreamWithPagination(stream.id, 1, 2).size == 2)
    assert(Message.getAllMessagesForAStreamWithPagination(stream.id, 1, 3).size == 3)

  }

  after {
    StreamDAO.remove(MongoDBObject("name" -> ".*".r))
    MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

}
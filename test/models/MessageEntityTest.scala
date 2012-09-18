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
  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", List(), List(), List(), List(), List())
  val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(user.id), true, List())
  val oneMoreStream = Stream(new ObjectId, "Neelkanth's stream", StreamType.Class, new ObjectId, List(user.id), true, List())

  before {
    User.createUser(user)
    Stream.createStream(stream)
  }

  test("Message Creation and rocking the message") {

    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)

    val message = Message(new ObjectId, "some message", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("23-07-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())

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

    val message5 = Message(new ObjectId, "some message1", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-12-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message1 = Message(new ObjectId, "some message1", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message2 = Message(new ObjectId, "some message2", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message3 = Message(new ObjectId, "some message3", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message4 = Message(new ObjectId, "some message4", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-07-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())

    Message.createMessage(message5)
    Message.createMessage(message1)
    Message.createMessage(message2)
    Message.createMessage(message3)
    Message.createMessage(message4)

    assert(Message.getAllMessagesForAStreamWithPagination(stream.id, 1, 10)(3).timeCreated === formatter.parse("21-03-12")) // Without sorting by time
    assert(Message.getAllMessagesForAStreamWithPagination(stream.id, 1, 10)(0).timeCreated === formatter.parse("21-12-12")) // Sorting by date
  }

  test("Sort message by total rocks") {

    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)

    val message1 = Message(new ObjectId, "some message1", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("01-12-12"),
      user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message2 = Message(new ObjectId, "some message1", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("02-12-12"),
      user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message3 = Message(new ObjectId, "some message2", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("03-12-12"),
      user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message4 = Message(new ObjectId, "some message3", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("04-12-12"),
      user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message5 = Message(new ObjectId, "some message4", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("05-12-12"),
      user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message6 = Message(new ObjectId, "some message5", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("06-12-12"),
      user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message7 = Message(new ObjectId, "some message6", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("07-12-12"),
      user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message8 = Message(new ObjectId, "some message7", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("08-12-12"),
      user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message9 = Message(new ObjectId, "some message8", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("09-12-12"),
      user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message10 = Message(new ObjectId, "some message9", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("10-12-12"),
      user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message11 = Message(new ObjectId, "some message10", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("11-12-12"),
      user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message12 = Message(new ObjectId, "some message11", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("12-12-12"),
      user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message13 = Message(new ObjectId, "some message12", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("13-12-12"),
      user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message14 = Message(new ObjectId, "some message13", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("14-12-12"),
      user.id, Option(stream.id), "", "", 1, List(), List(), 0, List())
    val message15 = Message(new ObjectId, "some message14", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("15-12-12"),
      user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message16 = Message(new ObjectId, "some message15", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("16-12-12"),
      user.id, Option(stream.id), "", "", 2, List(), List(), 0, List())
    val message17 = Message(new ObjectId, "some message16", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("17-12-12"),
      user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())

    Message.createMessage(message1)
    Message.createMessage(message2)
    Message.createMessage(message3)
    Message.createMessage(message4)
    Message.createMessage(message5)
    Message.createMessage(message6)
    Message.createMessage(message7)
    Message.createMessage(message8)
    Message.createMessage(message9)
    Message.createMessage(message10)
    Message.createMessage(message11)
    Message.createMessage(message12)
    Message.createMessage(message13)
    Message.createMessage(message14)
    Message.createMessage(message15)
    Message.createMessage(message16)
    Message.createMessage(message17)

    assert(Message.getAllMessagesForAStreamWithPagination(stream.id, 1, 10)(0).timeCreated === formatter.parse("17-12-12")) // Without sorting by rocks
    assert(Message.getAllMessagesForAStreamWithPagination(stream.id, 1, 10)(5).timeCreated === formatter.parse("12-12-12")) // Without sorting by rocks
    assert(Message.getAllMessagesForAStreamSortedbyRocks(stream.id, 1, 10)(0).messageBody === "some message15") // sorting by rocks
    assert(Message.getAllMessagesForAStreamSortedbyRocks(stream.id, 1, 10)(1).messageBody === "some message13") // sorting by rocks
    assert(Message.getAllMessagesForAStreamSortedbyRocks(stream.id, 1, 10)(2).messageBody === "some message16")
  }

  test("Get all message by keyword and Limit") {

    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)

    val message1 = Message(new ObjectId, "This is Neel", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 5, List(), List(), 0, List())
    val message2 = Message(new ObjectId, "This is Chris", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 7, List(), List(), 0, List())
    val message3 = Message(new ObjectId, "This is Vikas", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 9, List(), List(), 0, List())

    Message.createMessage(message1)
    Message.createMessage(message2)
    Message.createMessage(message3)

    assert(Message.getAllMessagesForAKeyword("This is", 1, 10).size === 3)
    assert(Message.getAllMessagesForAKeyword("Chris", 1, 10).size === 1)

  }

  test("Get All Message For a stream with Pagination Implemeted") {

    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)

    val message1 = Message(new ObjectId, "This is Neel", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 5, List(), List(), 0, List())
    val message2 = Message(new ObjectId, "This is Chris", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 7, List(), List(), 0, List())
    val message3 = Message(new ObjectId, "This is Vikas", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 9, List(), List(), 0, List())
    val message4 = Message(new ObjectId, "This is Sachdeva", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-05-12"), user.id, Option(stream.id), "", "", 9, List(), List(), 0, List())

    Message.createMessage(message1)
    Message.createMessage(message2)
    Message.createMessage(message3)
    Message.createMessage(message4)

    assert(Message.getAllMessagesForAStreamWithPagination(stream.id, 1, 2).size == 2)
    assert(Message.getAllMessagesForAStreamWithPagination(stream.id, 1, 3).size == 3)

  }

  test("Message Creation and following the message") {

    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)
    val message = Message(new ObjectId, "some message", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("23-07-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val messageId = Message.createMessage(message)
    val messageBefore = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)

    //Rocks Before
    assert(messageBefore.follows === 0)

    Message.followMessage(messageId, user.id)
    val messageAfter = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)

    //Rocks After
    assert(messageAfter.follows === 1)
    assert(messageAfter.followers.size === 1)
    assert(messageAfter.followers(0) === user.id)

  }

  test("Get All Public messages For A user") {
    Stream.createStream(oneMoreStream)

    val newClass = Class(new ObjectId, "001", "Physics", ClassType.Semester, "9:00PM", formatter.parse("21-03-12"), new ObjectId, List(stream.id))
    val otherNewClass = Class(new ObjectId, "001", "Physics", ClassType.Semester, "9:00PM", formatter.parse("22-03-12"), new ObjectId, List(oneMoreStream.id))

    val message5 = Message(new ObjectId, "some message1", Option(MessageType.Audio), Option(MessageAccess.Private), formatter.parse("21-12-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message1 = Message(new ObjectId, "some message1", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message2 = Message(new ObjectId, "some message2", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-03-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message3 = Message(new ObjectId, "some message3", Option(MessageType.Audio), Option(MessageAccess.Private), formatter.parse("21-01-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())
    val message4 = Message(new ObjectId, "some message4", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-07-12"), user.id, Option(stream.id), "", "", 0, List(), List(), 0, List())

    Message.createMessage(message5)
    Message.createMessage(message1)
    Message.createMessage(message2)
    Message.createMessage(message3)
    Message.createMessage(message4)

    val allPublicMessagesForAStream = Message.getAllPublicMessagesForAUser(List(newClass, otherNewClass))
    assert(allPublicMessagesForAStream.size === 3)

    val message6 = Message(new ObjectId, "Neelkanth", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-04-12"), user.id, Option(oneMoreStream.id), "", "", 0, List(), List(), 0, List())
    val message7 = Message(new ObjectId, "Sachdeva", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-03-12"), user.id, Option(oneMoreStream.id), "", "", 0, List(), List(), 0, List())
    val message8 = Message(new ObjectId, "Consultant", Option(MessageType.Audio), Option(MessageAccess.Private), formatter.parse("21-01-12"), user.id, Option(oneMoreStream.id), "", "", 0, List(), List(), 0, List())
    val message9 = Message(new ObjectId, "Developer", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-07-12"), user.id, Option(oneMoreStream.id), "", "", 0, List(), List(), 0, List())

    Message.createMessage(message6)
    Message.createMessage(message7)
    Message.createMessage(message8)
    Message.createMessage(message9)

    val allPublicMessagesForAStreamFromMoreThenOneClasses = Message.getAllPublicMessagesForAUser(List(newClass, otherNewClass))
    assert(allPublicMessagesForAStreamFromMoreThenOneClasses.size === 6)

  }

  test("Test the equality of two objects") {

    val stream = StreamDAO.find(MongoDBObject()).toList(0)
    val user = UserDAO.find(MongoDBObject()).toList(0)

    val message1 = Message(new ObjectId("505855d684aee286eddbf02a"), "This is Neel", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 5, List(), List(), 0, List())
    val message2 = Message(new ObjectId("505855d684aee286eddbf02a"), "This is Neel", Option(MessageType.Audio), Option(MessageAccess.Public), formatter.parse("21-04-12"), user.id, Option(stream.id), "", "", 5, List(), List(), 0, List())
    assert(message2===message1)

  }
  after {
    StreamDAO.remove(MongoDBObject("name" -> ".*".r))
    MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

}
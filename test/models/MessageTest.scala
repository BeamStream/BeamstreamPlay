package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId

@RunWith(classOf[JUnitRunner])
class MessageTest extends FunSuite with BeforeAndAfter {

  val message1 = Message(new ObjectId, "some message", MessageType.Audio, MessageAccess.Public, "time", new ObjectId, new ObjectId,"","")
  val message2 = Message(new ObjectId, "some message2", MessageType.Audio, MessageAccess.Public, "time", new ObjectId, new ObjectId,"","")
  val message3 = Message(new ObjectId, "some message3", MessageType.Audio, MessageAccess.Private, "time", new ObjectId, new ObjectId,"","")

  before {
    Stream.createStream(Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(new ObjectId),true))
    Message.createMessage(message1)
    Message.createMessage(message2)
    Message.createMessage(message3)

  }

  test("Fetch if the user was inserted") {
    val message = MessageDAO.findOneByID(id = 100)
    assert(message.get.text === "some message")

  }

//  test("Fetch all messages for a stream") {
//    val messages = Message.getAllMessagesForAStream(290)
//    assert(messages.size === 3)
//
//  }

  test("Fetch all messages for a user") {
    val messages = Message.getAllMessagesForAUser(190)
    assert(messages.size === 3)

  }

  test("Fetch all public messages for a user") {
    val messages = Message.getAllPublicMessagesForAUser(190)
    assert(messages.size === 2)

  }

  after {
    StreamDAO.remove(MongoDBObject("name" -> ".*".r))
    MessageDAO.remove(MongoDBObject("text" -> ".*".r))
  }

}
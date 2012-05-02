package models
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId

@RunWith(classOf[JUnitRunner])
class MessageEntityTest extends FunSuite with BeforeAndAfter {

  before {

  }

  test("Message Creation") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", List(), List(), List())
    User.createUser(user)

    val stream = Stream.createStream(Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(user.id), true))
    val message = Message(new ObjectId, "some message", MessageType.Audio, MessageAccess.Public, "time", user.id, stream.id, "", "", 0, List())
    Message.createMessage(message)

    val rocksBefore = Message.totalRocks(message.id)
    assert(rocksBefore === 0)

    val Rockers = Message.rockedIt(message.id, user.id)
    assert(Rockers.size == 1)

    val messageAfterRocking = MessageDAO.find(MongoDBObject("_id" -> message.id)).toList(0)
    assert(messageAfterRocking.rocks == 1)

   
  }

  after {
    StreamDAO.remove(MongoDBObject("name" -> ".*".r))
    MessageDAO.remove(MongoDBObject("text" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

}
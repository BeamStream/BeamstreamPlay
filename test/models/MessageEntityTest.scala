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
  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", List(), List(), List())
  val stream = Stream.createStream(Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(user.id), true))
  val message = Message(new ObjectId, "some message", MessageType.Audio, MessageAccess.Public, formatter.parse("23-07-12"), user.id, stream.id, "", "", 0, List())

  before {
    User.createUser(user)
    Message.createMessage(message)

  }

  test("Message Creation") {

    /*
     * Checking Rocks in original message
     */

    val rocksBefore = Message.totalRocks(message.id)
    assert(rocksBefore === 0)

    /*
 * Rock the message
 */

    val Rockers = Message.rockedIt(message.id, user.id)
    assert(Rockers.size === 1)

    /*
     * Checking Rocks after rocking the message
     */

    val messageAfterRocking = MessageDAO.find(MongoDBObject("_id" -> message.id)).toList(0)
    assert(messageAfterRocking.rocks === 1)
    User.countRoles(List(user.id))

    val secondmessage = Message(new ObjectId, "some message", MessageType.Audio, MessageAccess.Public, formatter.parse("23-07-10"), user.id, stream.id, "", "", 16, List())
    val thirdmessage = Message(new ObjectId, "some message", MessageType.Audio, MessageAccess.Public, formatter.parse("23-07-11"), user.id, stream.id, "", "", 10, List())
    Message.createMessage(secondmessage)
    Message.createMessage(thirdmessage)

    /*
     * getting all messages for a stream
     */
    assert(Message.getAllMessagesForAStream(stream.id).size === 3)

    /*
     * Sorting all messages for a stream
     */
    assert(Message.getAllMessagesForAStreamSortedbyRocks(stream.id).indexOf(secondmessage) === 2)
    assert(Message.getAllMessagesForAStreamSortedbyRocks(stream.id).indexOf(messageAfterRocking) === 0)
    print(Message.getAllMessagesForAStreamSortedbyTime(stream.id))

  }

  after {
    StreamDAO.remove(MongoDBObject("name" -> ".*".r))
    MessageDAO.remove(MongoDBObject("text" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

}
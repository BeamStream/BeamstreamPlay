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

    val message = Message(new ObjectId, "some message", MessageType.Audio, MessageAccess.Public, formatter.parse("23-07-12"), user.id, stream.id, "", "", 0, List(), List())

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

  after {
    StreamDAO.remove(MongoDBObject("name" -> ".*".r))
    MessageDAO.remove(MongoDBObject("text" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

}
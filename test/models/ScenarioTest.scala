package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject

@RunWith(classOf[JUnitRunner])
class ScenarioTest extends FunSuite with BeforeAndAfter {

  val chris = User(100,UserType.Professional,"u@u.com","Neel" ,"Sachdeva" ,"Knoldus",true,List(),List())
  val vikas = User(101,UserType.Professional,"u1@u1.com","Vikas" ,"Hazrati" ,"Knoldus",true,List(),List())
  val meetu = User(101,UserType.Professional,"u1@u1.com","Meetu" ,"Maltiar" ,"Inphina",true,List(),List())


  before {
    User.createUser(chris)
    User.createUser(vikas)
    User.createUser(meetu)
  }

  test("Scenario to test the flow") {

    /* user chris creates a new stream*/
    Stream.createStream(Stream(500, "Beamstream stream", StreamType.Class, 100, List(100)))
    Stream.createStream(Stream(501, "Inphina stream", StreamType.Research, 100, List(100)))

    /* vikas hunts for a stream to join*/
    val stream = Stream.getStreamByName("Bea")
    assert(stream.size === 1)
    assert(stream(0).name === "Beamstream stream")

    /*vikas joins this stream */
    Stream.joinStream(stream(0).id, 101)

    /*total number of users on the stream must be 2*/
    assert(Stream.getStreamByName("Beam")(0).users.size === 2)

    /*chris posts 5 messages on the stream*/
    Message.createMessage(Message(100, "message 1 on Beamstream", MessageType.Audio, MessageAccess.Public, "time", 100, 500))
    Message.createMessage(Message(101, "message 2 on Beamstream", MessageType.Audio, MessageAccess.Public, "time", 100, 500))
    Message.createMessage(Message(102, "message 3 on Beamstream", MessageType.Audio, MessageAccess.Public, "time", 100, 500))
    Message.createMessage(Message(103, "message 4 on Beamstream", MessageType.Audio, MessageAccess.Public, "time", 100, 500))
    Message.createMessage(Message(104, "message 5 on Beamstream", MessageType.Audio, MessageAccess.Private, "time", 100, 500))
    Message.createMessage(Message(204, "message 15 on InphinaStream", MessageType.Audio, MessageAccess.Private, "time", 100, 501))

    /* if vikas has public access only, he would see 4 messages*/
    var messages = Message.getAllPublicMessagesForAStream(500)
    assert(messages.size === 4)

    /* if vikas has public + private access only, he would see 4 messages*/
    messages = Message.getAllMessagesForAStream(500)
    assert(messages.size === 5)

    /* since vikas has joined the stream he can post to the stream*/
    var result = Message.createMessage(Message(105, "message 6 on Beamstream", MessageType.Audio, MessageAccess.Public, "time", 101, 500))
    assert(result != (-1))
    result = Message.createMessage(Message(106, "message 7 on Beamstream", MessageType.Audio, MessageAccess.Public, "time", 101, 500))
    assert(result != (-1))

    /* since meetu has not joined the stream he can post to the stream*/
    result = Message.createMessage(Message(106, "message 8 on Beamstream", MessageType.Audio, MessageAccess.Public, "time", 102, 500))
    assert(result == (-1))

    /*total messages on stream = chris + vikas messages*/

    messages = Message.getAllMessagesForAStream(500)
    assert(messages.size === 7)

  }

  after {
    StreamDAO.remove(MongoDBObject("name" -> ".*".r))
    MessageDAO.remove(MongoDBObject("text" -> ".*".r))
    User.removeUser(chris)
    User.removeUser(vikas)
    User.removeUser(meetu)
  }

}
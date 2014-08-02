package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import play.api.test.Helpers.running
import play.api.test.FakeApplication
import java.util.Date
import java.text.DateFormat

@RunWith(classOf[JUnitRunner])
class StreamTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
    }
  }

  val stream1 = Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(), true, List())
  val stream2 = Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(), true, List())
  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)

  test("Fetch matching stream names") {
    running(FakeApplication()) {
      val streamOneId = Stream.createStream(stream1)
      val streamTwoId = Stream.createStream(stream2)
      val streams = Stream.getStreamByName("al1ph")
      assert(streams.size === 2)
    }
  }

  test("Join stream") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId.get, List(), true, List())
      val streamId = Stream.createStream(stream)
      val streamsForAUser = Stream.getAllStreamforAUser(userId.get)
      assert(streamsForAUser.size === 0)
      Stream.joinStream(streamId.get, userId.get)
      val streamsForAUserAfterJoining = Stream.getAllStreamforAUser(userId.get)
      assert(streamsForAUserAfterJoining.size === 1)
      assert(streamsForAUserAfterJoining.head.usersOfStream == 1)
    }
  }
  
  test("attach user to stream") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId.get, List(userId.get), true, List())
      val streamId = Stream.createStream(stream)
      val streamsForAUser = Stream.getAllStreamforAUser(userId.get)
      assert(streamsForAUser.size === 1)
      assert(streamsForAUser.head.usersOfStream == 1)
    }
  }

  test("delete a stream") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId.get, List(userId.get), true, List())
      val streamId = Stream.createStream(stream)
      val streamsForAUser = Stream.getAllStreamforAUser(userId.get)
      assert(streamsForAUser.size === 1)
      assert(streamsForAUser.head.usersOfStream == 1)
      val streamIdAfterDeletion = Stream.deleteStream(stream)
      val streamsForAUserAfterDeletion = Stream.getAllStreamforAUser(userId.get)
      assert(streamsForAUserAfterDeletion.size === 0)
    }
  }
  
  test("Add Tags to Stream") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId.get, List(), true, List())
      val streamId = Stream.createStream(stream)
      val tagsAdded = Stream.addTagsToStream(List(), streamId.get)
      assert(stream.streamTag.size === 0)
    }
  }
  
  test("Users attending Stream") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId.get, List(userId.get), true, List())
      val streamId = Stream.createStream(stream)
      val usersAttendingStream = Stream.usersAttendingClass(streamId.get)
      assert(usersAttendingStream.size === 1)
    }
  }
  
  test("get all stream for a user") {
    running(FakeApplication()) {
      val userId = User.createUser(user)

      val stream1 = Stream(new ObjectId, "al1pha", StreamType.Class, userId.get, List(userId.get), true, List())
      val stream2 = Stream(new ObjectId, "al1pha", StreamType.Class, userId.get, List(userId.get), true, List())
      val stream3 = Stream(new ObjectId, "al1pha", StreamType.Class, userId.get, List(), true, List())
      val streamOneId = Stream.createStream(stream1)
      val streamTwoId = Stream.createStream(stream2)
      val streamThreeId = Stream.createStream(stream3)
      val streams = Stream.getAllStreamforAUser(userId.get)
      assert(streams.size === 2)
    }
  }

  test("Get All Class stream for a user") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId.get, List(userId.get), true, List())
      val streamId = Stream.createStream(stream)
      val classStreamsForAUser = Stream.allClassStreamsForAUser(userId.get)
      assert(classStreamsForAUser.size === 1)
    }
  }

  test("Get All Project stream for a user") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId.get, List(userId.get), true, List())
      val streamId = Stream.createStream(stream)
      val projectStreamsForAUser = Stream.allProjectStreamsForAUser(userId.get)
      assert(projectStreamsForAUser.size === 0)
      val anotherStream = Stream(new ObjectId, "al1pha", StreamType.Projects, userId.get, List(userId.get), true, List())
      val anotherStreamId = Stream.createStream(anotherStream)
      val projectStreamsForAUserAfterCreatingProjectStream = Stream.allProjectStreamsForAUser(userId.get)
      assert(projectStreamsForAUserAfterCreatingProjectStream.size === 1)
      val yetanotherStream = Stream(new ObjectId, "al1pha", StreamType.Projects, userId.get, List(userId.get), true, List())
      val yetanotherStreamId = Stream.createStream(yetanotherStream)
      val yetProjectStreamsForAUserAfterCreatingProjectStream = Stream.allProjectStreamsForAUser(userId.get)
      assert(yetProjectStreamsForAUserAfterCreatingProjectStream.size === 2)
    }
  }

  test("Delete the Streams") {
    val newObjectId = new ObjectId
    val userId = User.createUser(user)
    val stream = Stream(new ObjectId, "Neel's Stream", StreamType.Class, userId.get, List(newObjectId), true, List())
    val streamId = Stream.createStream(stream)
    val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
    val classToBeCreated = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List(streamId.get))
    Class.createClass(classToBeCreated, userId.get)
    val result = Stream.deleteStreams(newObjectId, streamId.get)
    assert(result.status === "Failure")
    assert(result.message === "User not Found")
    /*val stream2 = Stream(new ObjectId, "Neel's Stream", StreamType.Class, userId.get, List(newObjectId), true, List())
    val streamId2 = Stream.createStream(stream2)
    val result2 = Stream.deleteStreams(userId.get, streamId.get)
    assert(result2.status === "Success")
    assert(result2.message === "Deleted Stream Successfully")
    val result3 = Stream.deleteStreams(userId.get, streamId2.get)
    assert(result2.status === "Failure")
    assert(result2.message === "No Stream found")*/
    
  }

  after {
    StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    ClassDAO.remove(MongoDBObject("className" -> ".*".r))
  }

}
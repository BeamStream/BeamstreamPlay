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

@RunWith(classOf[JUnitRunner])
class StreamTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }

  val stream1 = Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(), true, List())
  val stream2 = Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(), true, List())
  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", Nil, Nil, Nil, None, None, None)

  test("Fetch matching stream names") {
    running(FakeApplication()) {
      val streamOneId = Stream.createStream(stream1)
      val streamTwoId = Stream.createStream(stream2)
      val streams = Stream.getStreamByName("al1ph")
      assert(streams.size === 2)
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
    val userId = User.createUser(user)
    val stream = Stream(new ObjectId, "Neel's Stream", StreamType.Class, new ObjectId, List(userId.get), true, List())
    val streamId = Stream.createStream(stream)
    val result = Stream.deleteStreams(userId.get, streamId.get)
    assert(result.status === "Success")
    assert(result.message === "Removed Access Successfully")
  }

  after {
    StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

}
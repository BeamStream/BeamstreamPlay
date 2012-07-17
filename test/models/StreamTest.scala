package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId

@RunWith(classOf[JUnitRunner])
class StreamTest extends FunSuite with BeforeAndAfter {

  var stream1 = Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(), true, List())
  val stream2 = Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(), true, List())
  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", List(), List(), List(), List())

  test("Fetch matching stream names") {
    val streamOneId = Stream.createStream(stream1)
    val streamTwoId = Stream.createStream(stream2)
    val streams = Stream.getStreamByName("al1ph")
    assert(streams.size === 2)
  }

  test("attach user to stream") {
    val userId = User.createUser(user)
    var stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId, List(userId), true, List())
    val streamId = Stream.createStream(stream)
    val streamsForAUser = Stream.getAllStreamforAUser(userId)
    assert(streamsForAUser.size === 1)
    assert(streamsForAUser(0).usersOfStream.size == 1)
  }

  test("Get All Class stream for a user") {
    val userId = User.createUser(user)
    var stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId, List(userId), true, List())
    val streamId = Stream.createStream(stream)
    val classStreamsForAUser = Stream.allClassStreamsForAUser(userId)
    assert(classStreamsForAUser.size === 1)

  }

  test("Get All Project stream for a user") {
    val userId = User.createUser(user)
    var stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId, List(userId), true, List())
    val streamId = Stream.createStream(stream)
    val projectStreamsForAUser = Stream.allProjectStreamsForAUser(userId)
    assert(projectStreamsForAUser.size === 0)

    var anotherStream = Stream(new ObjectId, "al1pha", StreamType.Projects, userId, List(userId), true, List())
    val anotherStreamId = Stream.createStream(anotherStream)
    val projectStreamsForAUserAfterCreatingProjectStream = Stream.allProjectStreamsForAUser(userId)
    assert(projectStreamsForAUserAfterCreatingProjectStream.size === 1)

    var yetanotherStream = Stream(new ObjectId, "al1pha", StreamType.Projects, userId, List(userId), true, List())
    val yetanotherStreamId = Stream.createStream(yetanotherStream)

    val yetProjectStreamsForAUserAfterCreatingProjectStream = Stream.allProjectStreamsForAUser(userId)
    assert(yetProjectStreamsForAUserAfterCreatingProjectStream.size === 2)

  }

  after {
    StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
  }

}
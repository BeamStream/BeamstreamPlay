//package models
//import org.scalatest.FunSuite
//import org.junit.runner.RunWith
//import org.scalatest.junit.JUnitRunner
//import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
//import org.scalatest.BeforeAndAfter
//import com.mongodb.casbah.commons.MongoDBObject
//import org.bson.types.ObjectId
//
//@RunWith(classOf[JUnitRunner])
//class StreamTest extends FunSuite with BeforeAndAfter {
//
//  var stream1 = Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(), true, List())
//  val stream2 = Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(), true, List())
//  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "","", List(), List(), List(), List(), List(), List())
//
//  test("Fetch matching stream names") {
//    val streamOneId = Stream.createStream(stream1)
//    val streamTwoId = Stream.createStream(stream2)
//    val streams = Stream.getStreamByName("al1ph")
//    assert(streams.size === 2)
//  }
//
//  test("attach user to stream") {
//    val userId = User.createUser(user)
//    var stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId, List(userId), true, List())
//    val streamId = Stream.createStream(stream)
//    val streamsForAUser = Stream.getAllStreamforAUser(userId)
//    assert(streamsForAUser.size === 1)
////    assert(streamsForAUser.usersOfStream.size == 1)
//  }
//
//  test("get all stream for a user") {
//
//    val userId = User.createUser(user)
//
//    var stream1 = Stream(new ObjectId, "al1pha", StreamType.Class, userId, List(userId), true, List())
//    val stream2 = Stream(new ObjectId, "al1pha", StreamType.Class, userId, List(userId), true, List())
//    val stream3 = Stream(new ObjectId, "al1pha", StreamType.Class, userId, List(), true, List())
//    val streamOneId = Stream.createStream(stream1)
//    val streamTwoId = Stream.createStream(stream2)
//    val streamThreeId = Stream.createStream(stream3)
//    val streams = Stream.getAllStreamforAUser(userId)
//    assert(streams.size === 2)
//
//  }
//
//  test("Get All Class stream for a user") {
//    val userId = User.createUser(user)
//    var stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId, List(userId), true, List())
//    val streamId = Stream.createStream(stream)
//    val classStreamsForAUser = Stream.allClassStreamsForAUser(userId)
//    assert(classStreamsForAUser.size === 1)
//
//  }
//
//  test("Get All Project stream for a user") {
//    val userId = User.createUser(user)
//    var stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId, List(userId), true, List())
//    val streamId = Stream.createStream(stream)
//    val projectStreamsForAUser = Stream.allProjectStreamsForAUser(userId)
//    assert(projectStreamsForAUser.size === 0)
//
//    var anotherStream = Stream(new ObjectId, "al1pha", StreamType.Projects, userId, List(userId), true, List())
//    val anotherStreamId = Stream.createStream(anotherStream)
//    val projectStreamsForAUserAfterCreatingProjectStream = Stream.allProjectStreamsForAUser(userId)
//    assert(projectStreamsForAUserAfterCreatingProjectStream.size === 1)
//
//    var yetanotherStream = Stream(new ObjectId, "al1pha", StreamType.Projects, userId, List(userId), true, List())
//    val yetanotherStreamId = Stream.createStream(yetanotherStream)
//
//    val yetProjectStreamsForAUserAfterCreatingProjectStream = Stream.allProjectStreamsForAUser(userId)
//    assert(yetProjectStreamsForAUserAfterCreatingProjectStream.size === 2)
//
//  }
//
//  test("Delete the Streams") {
//    val userId = User.createUser(user)
//    var stream = Stream(new ObjectId, "Neel's Stream", StreamType.Class, new ObjectId, List(userId), true, List())
//    val streamId = Stream.createStream(stream)
//    val result = Stream.deleteStreams(userId, streamId, true, false)
//    assert(result.status === "Failure")
//    assert(result.message === "You Do Not Have Rights To Delete This Stream")
//    var otherStream = Stream(new ObjectId, "Neel's Stream", StreamType.Class, userId, List(userId), true, List())
//    val otherStreamId = Stream.createStream(otherStream)
//    val anotherResult = Stream.deleteStreams(userId, otherStreamId, true, false)
//    assert(anotherResult.status === "Success")
//    assert(anotherResult.message === "Stream Removed SuccessFully")
//    var otherOneStream = Stream(new ObjectId, "Vikas's Stream", StreamType.Class, userId, List(userId), true, List())
//    val otherOneStreamId = Stream.createStream(otherOneStream)
//    val anotherOneResult = Stream.deleteStreams(userId, otherOneStreamId, false, true)
//    assert(anotherOneResult.status === "Success")
//    assert(anotherOneResult.message === "You've Successfully Removed From This Stream")
//
//  }
//
//  after {
//    StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
//    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
//  }
//
//}
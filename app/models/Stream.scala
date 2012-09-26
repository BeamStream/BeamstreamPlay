package models
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import scala.collection.JavaConversions._
import org.bson.types.ObjectId
import utils.MongoHQConfig

case class Stream(@Key("_id") id: ObjectId, streamName: String, streamType: StreamType.Value, creatorOfStream: ObjectId, usersOfStream: List[ObjectId], postToMyProfile: Boolean, streamTag: List[String])

object Stream {

  def getStreamByName(name: String): List[Stream] = {
    val regexp = (""".*""" + name + """.*""").r
    val streams = StreamDAO.find(MongoDBObject("streamName" -> regexp))
    streams.toList
  }

  /*
   * Create the New Stream
   */

  def createStream(stream: Stream): ObjectId = {
    val streamId = StreamDAO.insert(stream)
    streamId.get.asInstanceOf[ObjectId]
  }
  /*
   * Create the New Stream
   */

  def deleteStream(stream: Stream) {
    StreamDAO.remove(stream)
  }

  /*
   * Attach a Stream to a Class
   */
  def attachStreamtoClass(streamId: ObjectId, classId: ObjectId) {
    val expectedClass = ClassDAO.find(MongoDBObject("_id" -> classId)).toList(0)
    ClassDAO.update(MongoDBObject("_id" -> classId), expectedClass.copy(streams = List(streamId)), false, false, new WriteConcern)
  }

  /*
   * Get all streams for a user
   */
  def getAllStreamforAUser(userId: ObjectId): List[Stream] = {
    var allStreamForAUser: List[Stream] = List()
    val streams = StreamDAO.find(MongoDBObject())
    for (stream <- streams) {
      if (stream.usersOfStream.contains(userId)) allStreamForAUser ++= List(stream)
    }
    allStreamForAUser
  }

  /*
   * Get all class streams for a user
   */
  def allClassStreamsForAUser(userId: ObjectId): List[Stream] = {
    var allClassStreamForAUser: List[Stream] = List()
    val streams = StreamDAO.find(MongoDBObject("streamType" -> "Class"))
    for (stream <- streams) {
      if (stream.usersOfStream.contains(userId)) allClassStreamForAUser ++= List(stream)
    }
    allClassStreamForAUser
  }

  /*
   * Get all Project streams for a user
   */
  def allProjectStreamsForAUser(userId: ObjectId): List[Stream] = {
    val allProjectStreamsForAUser = StreamDAO.find(MongoDBObject("usersOfStream" -> MongoDBObject("$exists" -> userId), "streamType" -> "Projects")).toList
    allProjectStreamsForAUser
  }

  /*
   * join stream
   */

  def joinStream(streamId: ObjectId, userId: ObjectId): ResulttoSent = {
    val stream = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)

    if (!stream.usersOfStream.contains(userId)) {
      StreamDAO.update(MongoDBObject("_id" -> streamId), stream.copy(usersOfStream = (stream.usersOfStream ++ List(userId))), false, false, new WriteConcern)
      ResulttoSent("Success", "Joined Stream Successfully")
    } else {
      ResulttoSent("Failure", "You've already joined the stream")
    }
  }

  /*
   * Find a class by Id
   */

  def findStreamById(streamId: ObjectId): Stream = {
    val streamObtained = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)
    streamObtained
  }

  /*
   * Add tag to stream
   */

  def addTagsToStream(tags: List[String], streamId: ObjectId) {
    val stream = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)
    StreamDAO.update(MongoDBObject("_id" -> streamId), stream.copy(streamTag = (stream.streamTag ++ tags)), false, false, new WriteConcern)
  }

  /*
   * No. of Users Attending Class
   */

  def usersAttendingClass(streamId: ObjectId): Int = {
    val streamObtained = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)
    streamObtained.usersOfStream.size
  }

  /**
   *  Delete A Stream
   */

  def deleteStreams(userId: ObjectId, streamId: ObjectId, deleteStatus: Boolean, removeAccess: Boolean): ResulttoSent = {

    var resultToSent = new ResulttoSent("", "")
    val streamObtained = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)

    if (deleteStatus == true) {
      if (streamObtained.creatorOfStream == userId) {
        Stream.deleteStream(streamObtained)
        resultToSent = ResulttoSent("Success", "Stream Removed SuccessFully")
      } else {
        resultToSent = ResulttoSent("Failure", "You Do Not Have Rights To Delete This Stream")
      }
    } else {
      StreamDAO.update(MongoDBObject("_id" -> streamId), streamObtained.copy(usersOfStream = (streamObtained.usersOfStream -- List(userId))), false, false, new WriteConcern)
      resultToSent = ResulttoSent("Success", "You've Successfully Removed From This Stream")
    }
    resultToSent
  }

}

object StreamType extends Enumeration {
  type StreamType = Value
  val Class = Value(0, "Class")
  val Study = Value(1, "Study")
  val Research = Value(2, "Research")
  val Friends = Value(3, "Friends")
  val Projects = Value(4, "Projects")
}

object StreamDAO extends SalatDAO[Stream, Int](collection = MongoHQConfig.mongoDB("stream"))


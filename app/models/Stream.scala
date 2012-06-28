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

  def join(streamname: String, userId: ObjectId) {
    val stream = StreamDAO.find(MongoDBObject("name" -> streamname)).toList
    Stream.joinStream(stream(0).id, userId)
  }

  def getStreamByName(name: String): List[Stream] = {
    val regexp = (""".*""" + name + """.*""").r
    val streams = StreamDAO.find(MongoDBObject("name" -> regexp))
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
   * Attach a Stream to a Class
   */
  def attachStreamtoClass(streamId: ObjectId, classId: ObjectId) {
    val expectedClass = ClassDAO.find(MongoDBObject("_id" -> classId)).toList(0)
    ClassDAO.update(MongoDBObject("_id" -> classId), expectedClass.copy(streams = (expectedClass.streams ++ List(streamId))), false, false, new WriteConcern)
  }

  /*
   * Attach a Stream to a User
   */

  def attachStreamToUser(streamId: ObjectId, userId: ObjectId) {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    UserDAO.update(MongoDBObject("_id" -> userId), user.copy(streams = (user.streams ++ List(streamId))), false, false, new WriteConcern)

  }

  def getAllStream: List[Stream] = {
    val streams = StreamDAO.find(MongoDBObject("name" -> ".*".r))
    streams.toList
  }

  /*
   * Get all streams for a user
   */
  def getAllStreamforAUser(userId: ObjectId): List[Stream] = {
    val streamsForAUser=StreamDAO.find(MongoDBObject("creatorOfStream" -> userId ,  "usersOfStream" -> MongoDBObject("$exists" -> userId))).toList
    streamsForAUser
  }
  
  /*
   * Get all stream for a user
   */
  
  def joinStream(streamId: ObjectId, userId: ObjectId) {
    val stream = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)
    StreamDAO.update(MongoDBObject("_id" -> streamId), stream.copy(usersOfStream = (stream.usersOfStream ++ List(userId))), false, false, new WriteConcern)
  }
  
  /*
   * Find a class by Id
   */

  def findStreamById(streamId: ObjectId) : Stream = {
    val streamObtained = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)
    streamObtained
  }
  
  
  
  /*
   * Add tag to stream
   */
  
  def addTagsToStream(tags: List[String],streamId:ObjectId){
    val stream = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)
    StreamDAO.update(MongoDBObject("_id" -> streamId), stream.copy(streamTag = (stream.streamTag ++ tags)), false, false, new WriteConcern)
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

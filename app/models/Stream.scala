package models

//import com.novus.salat._
//import com.novus.salat.global._
import com.novus.salat.annotations.raw.Key
import com.novus.salat.dao.SalatDAO
import com.mongodb.casbah.Imports._
//import com.mongodb.casbah.MongoConnection
//import scala.collection.JavaConversions._
//import org.bson.types.ObjectId
import utils.MongoHQConfig
import utils.SendEmailUtility
import actors.UtilityActor
import models.mongoContext._
import scala.language.postfixOps

case class Stream(@Key("_id") id: ObjectId,
  streamName: String,
  streamType: StreamType.Value,
  creatorOfStream: ObjectId,
  usersOfStream: List[ObjectId],
  postToMyProfile: Boolean,
  streamTag: List[String])

object Stream {

  def getStreamByName(name: String): List[Stream] = {
    val regexp = (""".*""" + name + """.*""").r
    val streams = StreamDAO.find(MongoDBObject("streamName" -> regexp))
    streams.toList
  }

  /**
   * Create the New Stream(RA)
   */

  def createStream(stream: Stream): Option[ObjectId] = {
    StreamDAO.insert(stream)

  }
  /*
   * Create the New Stream
   */

  def deleteStream(stream: Stream) {
    StreamDAO.remove(stream)
  }

  /**
   * Attach a Stream to a Class (RA)
   */
  def attachStreamtoClass(streamId: ObjectId, classId: ObjectId) {
    val expectedClass = ClassDAO.find(MongoDBObject("_id" -> classId)).toList(0)
    ClassDAO.update(MongoDBObject("_id" -> classId), expectedClass.copy(streams = List(streamId)), false, false, new WriteConcern)
  }

  /**
   * Get all streams for a user (V)
   */
  def getAllStreamforAUser(userId: ObjectId): List[StreamResult] = {
    val streams = StreamDAO.find(MongoDBObject("usersOfStream" -> userId)).toList
    streams map {
      case stream => StreamResult(stream, stream.usersOfStream.size)
    }
  }

  /**
   * Get all class streams for a user
   */
  def allClassStreamsForAUser(userId: ObjectId): List[Stream] = {
    StreamDAO.find(MongoDBObject("streamType" -> "Class", "usersOfStream" -> userId)).toList
  }

  /**
   * Get all Project streams for a user
   */
  def allProjectStreamsForAUser(userId: ObjectId): List[Stream] = {
    StreamDAO.find(MongoDBObject("usersOfStream" -> userId, "streamType" -> "Projects")).toList

  }

  /**
   * join stream (V)
   */
  def joinStream(streamId: ObjectId, userId: ObjectId): ResulttoSent = {
    val stream = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)
    stream.usersOfStream.contains(userId) match {
      case false =>
        StreamDAO.update(MongoDBObject("_id" -> streamId), stream.copy(usersOfStream = (stream.usersOfStream ++ List(userId))), false, false, new WriteConcern)
        val user = User.getUserProfile(userId)
        UtilityActor.sendEmailAfterStreamCreation(user.get.email, stream.streamName, false)
        UtilityActor.sendEmailAfterStreamCreationToNotifyOtherUsers(streamId, userId)
        ResulttoSent("Success", "Joined Stream Successfully")
      case true => ResulttoSent("Failure", "You've already joined the stream")
    }

  }

  /**
   * join stream (RA)
   */
  def removeAccessFromStream(streamId: ObjectId, userId: ObjectId): ResulttoSent = {
    val stream = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)
    StreamDAO.update(MongoDBObject("_id" -> streamId), stream.copy(usersOfStream = (stream.usersOfStream filterNot (List(userId)contains))), false, false, new WriteConcern)
    ResulttoSent("Success", "Deleted Stream Successfully")
  }

  /**
   * Find a stream by Id
   */

  def findStreamById(streamId: ObjectId): Option[Stream] = {
    val streamsFound = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList
    (streamsFound.isEmpty) match {
      case true => None
      case false => Some(streamsFound.head)
    }

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

  def usersAttendingClass(streamId: ObjectId): List[ObjectId] = {
    val streamObtained = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)
    streamObtained.usersOfStream
  }

  /**
   *  Delete A Stream
   */

  def deleteStreams(userId: ObjectId, streamId: ObjectId): ResulttoSent = {

    val streamsObtained = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList
    val userFound = User.findUserByObjectId(userId)

    userFound match {
      case None => ResulttoSent("Failure", "User not Found")
      case Some(user) =>
        streamsObtained.isEmpty match {
          case false =>
            val classAssosiatedWithThisStream = ClassDAO.find(MongoDBObject("streams" -> streamId)).toList(0)
//                ClassDAO.remove(classAssosiatedWithThisStream)
                User.removeClassFromUser(userId, List(classAssosiatedWithThisStream.id))
            (streamsObtained.head.creatorOfStream == userId) match {
              case true =>
                Stream.deleteStream(streamsObtained.head)
                ClassDAO.remove(classAssosiatedWithThisStream)
                ResulttoSent("Success", user.classes.length.toString)
              case false =>
                Stream.removeAccessFromStream(streamId, userId)
                ResulttoSent("Success", user.classes.length.toString)
            }

          case true => ResulttoSent("Failure", "No Streams found")
        }
    }
  }

  /**
   * Notify Other Users Of A Stream About New User That Has Been Joined In A Stream (RA)
   */
  def sendMailToUsersOfStream(streamId: ObjectId, userIdWhoHasJoinedTheStream: ObjectId): Unit = {
    val userWhoHasJoinedTheStream = User.getUserProfile(userIdWhoHasJoinedTheStream)
    val stream = Stream.findStreamById(streamId)
    for (user <- stream.get.usersOfStream) {
      val userObtained = User.getUserProfile(user)
      if (!userObtained.get.id.equals(userIdWhoHasJoinedTheStream)) {
        SendEmailUtility.notifyUsersOfStreamForANewUser(userObtained.get.email, userWhoHasJoinedTheStream.get.firstName, userWhoHasJoinedTheStream.get.lastName, stream.get.streamName)
      }
    }
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

object StreamDAO extends SalatDAO[Stream, ObjectId](collection = MongoHQConfig.mongoDB("stream"))


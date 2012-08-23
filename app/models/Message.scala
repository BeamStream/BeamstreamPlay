package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import org.bson.types.ObjectId
import utils.MongoHQConfig
import java.util.Date

import java.util.Calendar
import java.text.DateFormat

object MessageType extends Enumeration {

  val Text = Value(0, "text")
  val Picture = Value(1, "Picture")
  val Video = Value(2, "Video")
  val Audio = Value(3, "Audio")
}

object MessageAccess extends Enumeration {
  type MessageAccess = Value

  val Private = Value(0, "Private")
  val Public = Value(1, "Public")
}

case class Message(@Key("_id") id: ObjectId,
  messageBody: String,
  messageType: Option[MessageType.Value],
  messageAccess: Option[MessageAccess.Value],
  timeCreated: Date,
  userId: ObjectId,
  streamId: Option[ObjectId],
  firstNameofMsgPoster: String,
  lastNameofMsgPoster: String,
  rocks: Int,
  rockers: List[ObjectId],
  comments: List[Comment],
  follows: Int,
  followers: List[ObjectId])

object Message {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy HH:mm:ss")

  /*
   * Create a new message
   */

  def createMessage(message: Message): ObjectId = {
    val messageId = MessageDAO.insert(message)
    messageId.get

  }

  private def validateUserHasRightToPost(userId: ObjectId, streamId: ObjectId): Boolean = {
    val stream = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)
    stream.usersOfStream.contains(userId)
  }

  def removeMessage(message: Message) {
    MessageDAO.remove(message)
  }

  /*
   * Get all messages fro a stream
   */

  def getAllMessagesForAStream(streamId: ObjectId): List[Message] = {
    val messsages = MessageDAO.find(MongoDBObject("streamId" -> streamId)).toList
    messsages
  }

  def getAllPublicMessagesForAStream(streamId: Int): List[Message] = {
    MessageDAO.find(MongoDBObject("streamId" -> streamId, "messageAccess" -> "Public")).toList
  }

  def getAllMessagesForAUser(userId: Int): List[Message] = {
    MessageDAO.find(MongoDBObject("userId" -> userId)).toList
  }

  def getAllPublicMessagesForAUser(userId: Int): List[Message] = {
    MessageDAO.find(MongoDBObject("userId" -> userId, "messageAccess" -> "Public")).toList
  }

  /*
   *  Increase the no. of counts
   */
  def rockersNames(messageId: ObjectId): List[String] = {
    val messageRocked = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
    val rockersName = User.giveMeTheRockers(messageRocked.rockers)
    rockersName
  }

  /*
   *  Update the Rockers List and increase the count by one 
   */

  def rockedIt(messageId: ObjectId, userId: ObjectId): Int = {
    val SelectedmessagetoRock = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)

    (SelectedmessagetoRock.rockers.contains(userId)) match {

      case true =>
        // Unrocking a message
        MessageDAO.update(MongoDBObject("_id" -> messageId), SelectedmessagetoRock.copy(rockers = (SelectedmessagetoRock.rockers -- List(userId))), false, false, new WriteConcern)
        val updatedMessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
        MessageDAO.update(MongoDBObject("_id" -> messageId), updatedMessage.copy(rocks = (updatedMessage.rocks - 1)), false, false, new WriteConcern)
        val finalMessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
        finalMessage.rocks

      case false =>
        //Rocking a message
        MessageDAO.update(MongoDBObject("_id" -> messageId), SelectedmessagetoRock.copy(rockers = (SelectedmessagetoRock.rockers ++ List(userId))), false, false, new WriteConcern)
        val updatedMessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
        MessageDAO.update(MongoDBObject("_id" -> messageId), updatedMessage.copy(rocks = (updatedMessage.rocks + 1)), false, false, new WriteConcern)
        val finalMessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
        finalMessage.rocks
    }

  }

  /*
   * Sort messages within a stream on the basis of total rocks
   */

  def getAllMessagesForAStreamSortedbyRocks(streamId: ObjectId, pageNumber: Int, messagesPerPage: Int): List[Message] = {
    // val messages = MessageDAO.find(MongoDBObject("streamId" -> streamId)).toList.sortBy(message => message.rocks)
    val messsagesRetrieved = MessageDAO.find(MongoDBObject("streamId" -> streamId)).sort(orderBy = MongoDBObject("rocks" -> -1, "timeCreated" -> -1)).skip((pageNumber - 1) * messagesPerPage).limit(messagesPerPage).toList
    messsagesRetrieved
  }

  /*
   * Sort messages within a stream on the basis of time created
   * TODO We can remove it because it is now assosiated with Pagination method
   */

  def getAllMessagesForAStreamSortedbyDate(streamId: ObjectId): List[Message] = {
    val messages = MessageDAO.find(MongoDBObject("streamId" -> streamId)).toList.sortBy(message => message.timeCreated)
    messages
  }
  /*
   * get all messages within a stream on the basis of keyword
   */
  def getAllMessagesForAKeyword(keyword: String, pageNumber: Int, messagesPerPage: Int): List[Message] = {
    val keyWordregExp = (""".*""" + keyword + """.*""").r
    //val messages = MessageDAO.find(MongoDBObject()).toList.filter(message => message.messageBody.contains(keyword))
    val messsagesRetrieved = MessageDAO.find(MongoDBObject("messageBody" -> keyWordregExp)).skip((pageNumber - 1) * messagesPerPage).limit(messagesPerPage).toList
    messsagesRetrieved

  }

  /*
 * Pagination For messages
 */

  def getAllMessagesForAStreamWithPagination(streamId: ObjectId, pageNumber: Int, messagesPerPage: Int): List[Message] = {
    val messsagesRetrieved = MessageDAO.find(MongoDBObject("streamId" -> streamId)).sort(orderBy = MongoDBObject("timeCreated" -> -1)).skip((pageNumber - 1) * messagesPerPage).limit(messagesPerPage).toList
    messsagesRetrieved
  }

  /*
   * Find Message by Id
   */

  def findMessageById(messageId: ObjectId): Message = {
    val messageObtained = MessageDAO.findOneByID(messageId)
    messageObtained.get
  }

  /*
 * add Comment to message
 */
  def addCommentToMessage(comment: Comment, messageId: ObjectId): ObjectId = {
    val message = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
    MessageDAO.update(MongoDBObject("_id" -> messageId), message.copy(comments = (message.comments ++ List(comment))), false, false, new WriteConcern)
    comment.id
  }

  /*
   * Follow the message
   * @Purpose: Update followers and returns the no. of followers
   */

  def followMessage(messageId: ObjectId, userId: ObjectId): Int = {
    val SelectedmessagetoRock = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)

    (SelectedmessagetoRock.followers.contains(userId)) match {

      case true =>
        // Unfollow a message
        //SelectedmessagetoRock.follows
        MessageDAO.update(MongoDBObject("_id" -> messageId), SelectedmessagetoRock.copy(followers = (SelectedmessagetoRock.followers -- List(userId))), false, false, new WriteConcern)
        val updatedMessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
        MessageDAO.update(MongoDBObject("_id" -> messageId), updatedMessage.copy(follows = (updatedMessage.follows - 1)), false, false, new WriteConcern)
        val finalMessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
        finalMessage.follows

      case false =>
        // Follow a message
        MessageDAO.update(MongoDBObject("_id" -> messageId), SelectedmessagetoRock.copy(followers = (SelectedmessagetoRock.followers ++ List(userId))), false, false, new WriteConcern)
        val updatedMessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
        MessageDAO.update(MongoDBObject("_id" -> messageId), updatedMessage.copy(follows = (updatedMessage.follows + 1)), false, false, new WriteConcern)
        val finalMessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
        finalMessage.follows
    }

  }

  /*
   * Is a follower 
   * @ Purpose: identify if the user is following a message or not
   */

  def isAFollower(messageId: ObjectId, userId: Object): Boolean = {
    val message = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)

    (message.followers.contains(userId)) match {
      case true => true
      case false => false
    }

  }

}

object MessageDAO extends SalatDAO[Message, ObjectId](collection = MongoHQConfig.mongoDB("message"))




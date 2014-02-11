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
import com.novus.salat.global._
import models.mongoContext._
import java.util.regex.Pattern
object Type extends Enumeration {

  val Text = Value(0, "Text")
  val Image = Value(1, "Image")
  val Video = Value(2, "Video")
  val Audio = Value(3, "Audio")
  val Document = Value(4, "Document")
}

object Access extends Enumeration {
  type MessageAccess = Value
  val Public = Value(0, "Public")
  val PrivateToClass = Value(1, "PrivateToClass")
  val PrivateToSchool = Value(2, "PrivateToSchool")
  val PrivateToDegree = Value(3, "PrivateToDegree")
  val PrivateToGradYear = Value(4, "PrivateToGradYear")
}

case class Message(@Key("_id") id: ObjectId,
  messageBody: String,
  messageType: Option[Type.Value],
  messageAccess: Option[Access.Value],
  timeCreated: Date,
  userId: ObjectId,
  streamId: Option[ObjectId],
  firstNameofMsgPoster: String,
  lastNameofMsgPoster: String,
  rocks: Int,
  rockers: List[ObjectId],
  comments: List[ObjectId],
  follows: Int,
  followers: List[ObjectId],
  anyPreviewImageUrl: Option[String] = None,
  docIdIfAny: Option[ObjectId] = None)

object Message { //extends CommentConsumer {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy HH:mm:ss")

  /**
   * Create a new message (RA)
   */
  def createMessage(message: Message): Option[ObjectId] = {
    MessageDAO.insert(message)
  }

  /**
   *
   */
  /**
   * Validate User : Eligible to post in a stream
   */
  private def validateUserHasRightToPost(userId: ObjectId, streamId: ObjectId): Boolean = {
    val stream = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)
    stream.usersOfStream.contains(userId)
  }

  /**
   * Delete Message
   */
  def removeMessage(message: Message) {
    MessageDAO.remove(message)
  }

  /**
   * Find Message by Id
   * param  messageId is the id of the message to be searched
   */

  def findMessageById(messageId: ObjectId): Option[Message] = {
    val messageObtained = MessageDAO.findOneById(messageId)
    messageObtained
  }

  /**
   * All Public message for a user
   * param streamId is the id of the stream for which the messages are required
   */
  def getAllPublicMessagesForAStream(streamId: ObjectId): List[Message] = {
    MessageDAO.find(MongoDBObject("streamId" -> streamId, "messageAccess" -> "Public")).toList
  }

  /**
   * All Public message for a user
   * param userId is the id of the user for which the messages are required
   */
  def getAllMessagesForAUser(userId: ObjectId): List[Message] = {
    MessageDAO.find(MongoDBObject("userId" -> userId)).toList
  }

  /**
   * Get all public messages for a user
   *  param userId is the id of the user for which the messages are required
   */
  def getAllPublicMessagesForAUser(userId: ObjectId) = {
    MessageDAO.find(MongoDBObject("userId" -> userId, "messageAccess" -> "Public")).toList
  }

  /**
   *  Increase the no. of counts
   *   param messageId is the id of the message for which the rockers are required
   */
  def rockersNames(messageId: ObjectId): List[String] = {
    val messageRocked = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
    User.giveMeTheRockers(messageRocked.rockers)
  }

  /*
   *  Update the Rockers List and increase the count by one 
   */

  def rockedIt(messageId: ObjectId, userId: ObjectId): Int = {
    val SelectedmessagetoRock = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)

    (SelectedmessagetoRock.rockers.contains(userId)) match {

      case true =>
        // Unrocking a message
        MessageDAO.update(MongoDBObject("_id" -> messageId), SelectedmessagetoRock.copy(rockers = (SelectedmessagetoRock.rockers filterNot (List(userId) contains))), false, false, new WriteConcern)
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

  /**
   * Sort messages within a stream on the basis of total rocks
   *  param streamId is the id of the stream
   *  param pageNumber is the page number
   *  param messagesPerPage is the limit of messages per page
   */

  def getAllMessagesForAStreamSortedbyRocks(streamId: ObjectId, pageNumber: Int, messagesPerPage: Int): List[Message] = {
    MessageDAO.find(MongoDBObject("streamId" -> streamId)).sort(orderBy = MongoDBObject("rocks" -> -1, "timeCreated" -> -1)).skip((pageNumber - 1) * messagesPerPage).limit(messagesPerPage).toList
  }

  /**
   * get all messages within a stream on the basis of keyword
   * param streamId is the id of the stream
   *  param pageNumber is the page number
   *  param messagesPerPage is the limit of messages per page
   */
  def getAllMessagesForAKeyword(keyword: String, streamId: ObjectId, pageNumber: Int, messagesPerPage: Int): List[Message] = {
    val keyWordregExp = Pattern.compile("^" + keyword, Pattern.CASE_INSENSITIVE) //(""".*""" + keyword + """.*""").r
    MessageDAO.find(MongoDBObject("messageBody" -> keyWordregExp, "streamId" -> streamId)).skip((pageNumber - 1) * messagesPerPage).limit(messagesPerPage).toList
  }

  /**
   * param streamId is the id of the stream
   *  param pageNumber is the page number
   *  param messagesPerPage is the limit of messages per page
   * Pagination For messages
   */

  def getAllMessagesForAStreamWithPagination(streamId: ObjectId, pageNumber: Int, messagesPerPage: Int): List[Message] = {
    MessageDAO.find(MongoDBObject("streamId" -> streamId)).sort(orderBy = MongoDBObject("timeCreated" -> -1)).skip((pageNumber - 1) * messagesPerPage).limit(messagesPerPage).toList
  }

  /**
   * Follow the message
   * param  messageId is the id of the message to be searched
   * param  userId is the id of follower
   *
   * Purpose: Update followers and returns the no. of followers
   */

  def followMessage(messageId: ObjectId, userId: ObjectId): Int = {
    val SelectedmessagetoRock = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)

    (SelectedmessagetoRock.followers.contains(userId)) match {

      case true =>
        // Unfollow a message
        MessageDAO.update(MongoDBObject("_id" -> messageId), SelectedmessagetoRock.copy(followers = (SelectedmessagetoRock.followers filterNot (List(userId) contains))), false, false, new WriteConcern)
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

  /**
   * Is a follower
   * Purpose: identify if the user is following a message or not
   * param  messageId is the id of the message to be searched
   * param  userId is the id of follower
   */

  def isAFollower(messageId: ObjectId, userId: Object): Boolean = {
    val message = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)

    (message.followers.contains(userId)) match {
      case true => true
      case false => false
    }

  }

  /**
   * Is a Rocker
   * Purpose: identify if the user has rocked a message or not
   * param  messageId is the id of the message to be searched
   * param  userId is the id of follower
   */

  def isARocker(messageId: ObjectId, userId: Object): Boolean = {
    val message = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)

    (message.rockers.contains(userId)) match {
      case true => true
      case false => false
    }

  }

  /**
   * Getting all public messages For All the Streams of a user
   */

  def getAllPublicMessagesForAUser(classesForAUser: List[Class]): List[Message] = {
    classesForAUser map {
      case classForAUser => MessageDAO.find(MongoDBObject("streamId" -> classForAUser.streams(0), "messageAccess" -> "Public")).toList.head
    }
  }

  /**
   * Add Comment To Message
   * param  commentId is the id of the comment which is created
   * param  messageId is the id of message to which this comments belongs
   */
  def addCommentToMessage(commentId: ObjectId, messageId: ObjectId) = {
    val message = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
    MessageDAO.update(MongoDBObject("_id" -> messageId), message.copy(comments = (message.comments ++ List(commentId))), false, false, new WriteConcern)
  }

  /**
   * Remove Comment To Message
   * param  commentId is the id of the comment which is created
   * param  messageId is the id of message to which this comments belongs
   */
  def removeCommentFromMessage(commentId: ObjectId, messageId: ObjectId) = {
    val message = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
    MessageDAO.update(MongoDBObject("_id" -> messageId), message.copy(comments = (message.comments filterNot (List(commentId)contains))), false, false, new WriteConcern)
  }

  /**
   * Delete A Message (Either Stream Admin Or The User Who Has Posted The Message)
   *  param  messageId is the id of the message to e deleted
   * param  userId is the id of owner of message
   */

  def deleteMessagePermanently(messageId: ObjectId, userId: ObjectId) = {

    val messageToRemove = Message.findMessageById(messageId).get
    val commentsOfMessageToBeRemoved = messageToRemove.comments
    val streamObtained = Stream.findStreamById(messageToRemove.streamId.get)

    val deletedMessageSuccessfully = (messageToRemove.userId == userId || streamObtained.get.creatorOfStream == userId) match {
      case true =>
        MessageDAO.remove(messageToRemove)
        commentsOfMessageToBeRemoved map {
          case commentId =>
            val commentToBeremoved = Comment.findCommentById(commentId)
            if (commentToBeremoved != None) Comment.removeComment(commentToBeremoved.get)
        }
        true
      case false => false
    }
    deletedMessageSuccessfully
  }
  /**
   * ****************************************Re-architecture*****************************************************
   */

  /**
   * Fetch messages along with document details if message contains any document
   */

  def messagesAlongWithDocDescription(messages: List[Message], userId: ObjectId): List[DocResulttoSent] = {
    val docResultToSend = messages map {
      case message =>
        val userMedia = UserMedia.getProfilePicForAUser(message.userId)
        val profilePicForUser = (!userMedia.isEmpty) match {
          case true => (userMedia.head.frameURL != "") match {
            case true => userMedia.head.frameURL
            case false => userMedia.head.mediaUrl
          }
          case false => ""
        }

        val isRocked = Message.isARocker(message.id, userId)
        val isFollowed = Message.isAFollower(message.id, userId)
        //        val comments = Comment.getAllComments(message.comments)   // H12 Heroku 

        /*TODO  : Very Important : Trouble due to deleting the user from the PROD DB
                val followerOfMessagePoster = User.getUserProfile(message.userId).head.followers.contains(userId)
               
                (message.docIdIfAny != None) match {
                  case true =>
                    val userMedia = UserMedia.findMediaById(message.docIdIfAny.get)
                    (userMedia != None) match {
                      case true => DocResulttoSent(Option(message), None, userMedia.get.name, userMedia.get.description, isRocked, isFollowed, Option(profilePicForUser), Option(comments), Option(followerOfMessagePoster), User.giveMeTheRockers(message.rockers))
                      case false =>
                        val document = Document.findDocumentById(message.docIdIfAny.get)
                        DocResulttoSent(Option(message), None, document.get.documentName, document.get.documentDescription, isRocked, isFollowed, Option(profilePicForUser), Option(comments), Option(followerOfMessagePoster), User.giveMeTheRockers(message.rockers))
                    }
                  case false => DocResulttoSent(Option(message), None, "", "", isRocked, isFollowed, Option(profilePicForUser), Option(comments), Option(followerOfMessagePoster), User.giveMeTheRockers(message.rockers))
                }*/

        (message.docIdIfAny != None) match {
          case true =>
            val userMedia = UserMedia.findMediaById(message.docIdIfAny.get)
            (userMedia != None) match {
              case true => DocResulttoSent(Option(message), None, userMedia.get.name, userMedia.get.description, isRocked, isFollowed, Option(profilePicForUser), Option(message.comments.length), None, Nil) // H12, User.giveMeTheRockers(message.rockers))
              case false =>
                val document = Document.findDocumentById(message.docIdIfAny.get)
                DocResulttoSent(Option(message), None, document.get.documentName, document.get.documentDescription, isRocked, isFollowed, Option(profilePicForUser), Option(message.comments.length), None, Nil) //H12, User.giveMeTheRockers(message.rockers))
            }
          case false => DocResulttoSent(Option(message), None, "", "", isRocked, isFollowed, Option(profilePicForUser), Option(message.comments.length), None, Nil) //H12, User.giveMeTheRockers(message.rockers))
        }
    }
    docResultToSend
  }

}

object MessageDAO extends SalatDAO[Message, ObjectId](collection = MongoHQConfig.mongoDB("message"))




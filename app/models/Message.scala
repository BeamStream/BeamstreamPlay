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
import scala.collection.mutable.ListBuffer

import java.util.Calendar
import java.text.DateFormat

object MessageType extends Enumeration {

  val Text = Value(0, "Text")
  val Image = Value(1, "Image")
  val Video = Value(2, "Video")
  val Audio = Value(3, "Audio")
  val Document = Value(4, "Document")
}

object MessageAccess extends Enumeration {
  type MessageAccess = Value
  val Public = Value(0, "Public")
  val PrivateToClass = Value(1, "PrivateToClass")
  val PrivateToSchool = Value(2, "PrivateToSchool")
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
  comments: List[ObjectId],
  follows: Int,
  followers: List[ObjectId],
  anyPreviewImageUrl: Option[String] = None,
  //profileImageUrl: Option[String] = None,
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
  private def validateUserHasRightToPost(userId: ObjectId, streamId: ObjectId): Boolean = {
    val stream = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)
    stream.usersOfStream.contains(userId)
  }

  def removeMessage(message: Message) {
    MessageDAO.remove(message)
  }

  /**
   * Get all messages from a stream
   */
  def getAllMessagesForAStream(streamId: ObjectId): List[Message] = {
    val messsages = MessageDAO.find(MongoDBObject("streamId" -> streamId)).toList
    messsages
  }

  def getAllPublicMessagesForAStream(streamId: ObjectId): List[Message] = {
    MessageDAO.find(MongoDBObject("streamId" -> streamId, "messageAccess" -> "Public")).toList
  }

  def getAllMessagesForAUser(userId: ObjectId): List[Message] = {
    MessageDAO.find(MongoDBObject("userId" -> userId)).toList
  }

  /**
   * Get all public messages for a user
   */
  def getAllPublicMessagesForAUser(userId: ObjectId) = {
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
        MessageDAO.update(MongoDBObject("_id" -> messageId), SelectedmessagetoRock.copy(rockers = (SelectedmessagetoRock.rockers filterNot (List(userId) contains))), false, false, new WriteConcern)
        val updatedMessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
        MessageDAO.update(MongoDBObject("_id" -> messageId), updatedMessage.copy(rocks = (updatedMessage.rocks - 1)), false, false, new WriteConcern)
        val finalMessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
        //if(! (SelectedmessagetoRock.docIdIfAny.equals(None))){RockDocOrMedia.rockDocOrMedia(SelectedmessagetoRock.docIdIfAny.get,userId)}
        finalMessage.rocks

      case false =>
        //Rocking a message
        MessageDAO.update(MongoDBObject("_id" -> messageId), SelectedmessagetoRock.copy(rockers = (SelectedmessagetoRock.rockers ++ List(userId))), false, false, new WriteConcern)
        val updatedMessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
        MessageDAO.update(MongoDBObject("_id" -> messageId), updatedMessage.copy(rocks = (updatedMessage.rocks + 1)), false, false, new WriteConcern)
        val finalMessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
        //if(! (SelectedmessagetoRock.docIdIfAny==None))RockDocOrMedia.rockDocOrMedia(SelectedmessagetoRock.docIdIfAny.get,userId)
        finalMessage.rocks
    }

  }

  /**
   * Sort messages within a stream on the basis of total rocks
   */

  def getAllMessagesForAStreamSortedbyRocks(streamId: ObjectId, pageNumber: Int, messagesPerPage: Int): List[Message] = {
    MessageDAO.find(MongoDBObject("streamId" -> streamId)).sort(orderBy = MongoDBObject("rocks" -> -1, "timeCreated" -> -1)).skip((pageNumber - 1) * messagesPerPage).limit(messagesPerPage).toList
  }

  /*
   * Sort messages within a stream on the basis of time created
   * TODO We can remove it because it is now assosiated with Pagination method
   */

  def getAllMessagesForAStreamSortedbyDate(streamId: ObjectId): List[Message] = {
    val messages = MessageDAO.find(MongoDBObject("streamId" -> streamId)).toList.sortBy(message => message.timeCreated)
    messages
  }
  /**
   * get all messages within a stream on the basis of keyword
   */
  def getAllMessagesForAKeyword(keyword: String, streamId: ObjectId, pageNumber: Int, messagesPerPage: Int): List[Message] = {
    val keyWordregExp = (""".*""" + keyword + """.*""").r
    MessageDAO.find(MongoDBObject("messageBody" -> keyWordregExp, "streamId" -> streamId)).skip((pageNumber - 1) * messagesPerPage).limit(messagesPerPage).toList
  }

  /*
 * Pagination For messages
 */

  def getAllMessagesForAStreamWithPagination(streamId: ObjectId, pageNumber: Int, messagesPerPage: Int): List[Message] = {
    MessageDAO.find(MongoDBObject("streamId" -> streamId)).sort(orderBy = MongoDBObject("timeCreated" -> -1)).skip((pageNumber - 1) * messagesPerPage).limit(messagesPerPage).toList
  }

  /*
   * Find Message by Id
   */

  def findMessageById(messageId: ObjectId): Option[Message] = {
    val messageObtained = MessageDAO.findOneByID(messageId)
    messageObtained
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

  /*
   * Is a Rocker 
   * @ Purpose: identify if the user has rocked a message or not
   */

  def isARocker(messageId: ObjectId, userId: Object): Boolean = {
    val message = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)

    (message.rockers.contains(userId)) match {
      case true => true
      case false => false
    }

  }

  /*
  * Getting all public messages For All the Streams of a user
  */

  def getAllPublicMessagesForAUser(classesForAUser: List[Class]): List[Message] = {
    var publicMessagesForAUser: List[Message] = List()
    for (classForAUser <- classesForAUser) {
      val messageObtained = MessageDAO.find(MongoDBObject("streamId" -> classForAUser.streams(0), "messageAccess" -> "Public")).toList
      publicMessagesForAUser ++= messageObtained
    }
    publicMessagesForAUser
  }

  /*
   * Add Comment To Message
   */
  def addCommentToMessage(commentId: ObjectId, messageId: ObjectId) = {
    val message = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
    MessageDAO.update(MongoDBObject("_id" -> messageId), message.copy(comments = (message.comments ++ List(commentId))), false, false, new WriteConcern)
  }

  /*
   * Delete A Message (Either Stream Admin Or The User Who Has Posted The Message)
   */

  def deleteMessagePermanently(messageId: ObjectId, userId: ObjectId) = {
    var deletedMessageSuccessfully = false
    val messageToRemove = Message.findMessageById(messageId).get
    val commentsOfMessageToBeRemoved = messageToRemove.comments
    val streamObtained = Stream.findStreamById(messageToRemove.streamId.get)
    if (messageToRemove.userId == userId || streamObtained.creatorOfStream == userId) {
      MessageDAO.remove(messageToRemove)
      for (commentId <- commentsOfMessageToBeRemoved) {
        val commentToBeremoved = Comment.findCommentById(commentId)
        if (commentToBeremoved != None) Comment.removeComment(commentToBeremoved.get)
      }
      deletedMessageSuccessfully = true
      deletedMessageSuccessfully
    } else {
      println("You're Not Authorised To Delete M")
      deletedMessageSuccessfully
    }
  }
  /**
   * ****************************************Rearchitecture*****************************************************
   */

  /**
   * Fetch messages along with document details if message contains any document
   */

  def messagesAlongWithDocDescription(messages: List[Message]) = {
    var messsageWithDocResults: List[DocResulttoSent] = List()
    var profilePicForUser = ""
    messages map {
      case message =>
        val userMedia = UserMedia.getProfilePicForAUser(message.userId)
        if (!userMedia.isEmpty) profilePicForUser = userMedia(0).mediaUrl
        val comments = Comment.getAllComments(message.comments)
        if (message.docIdIfAny != None) {
          val userMedia = UserMedia.findMediaById(message.docIdIfAny.get)
          if (userMedia != None) {
            messsageWithDocResults ++= List(new DocResulttoSent(message, userMedia.get.name, userMedia.get.description, Option(profilePicForUser), Option(comments)))
          } else {
            val document = Document.findDocumentById(message.docIdIfAny.get)
            messsageWithDocResults ++= List(new DocResulttoSent(message, document.get.documentName, document.get.documentDescription, Option(profilePicForUser), Option(comments)))
          }
        } else {
          messsageWithDocResults ++= List(new DocResulttoSent(message, "", "", Option(profilePicForUser), Option(comments)))
        }

    }
    messsageWithDocResults
  }: List[DocResulttoSent]
  /*
	 * Return a copy of the Message with an ProfileImageURL attached
	 */
  //	def getMessageWithProfileImageURL(allMessagesForAStream:List[Message]):List[Message] = {
  //	  	val messageList = new ListBuffer[Message]
  //    
  //	    allMessagesForAStream.foreach(i =>  {
  //	      val media = UserMedia.findUserMediaByUserId(i.userId);
  //	      if(media.hasNext) {
  //	        val media = UserMedia.findUserMediaByUserId(i.userId);
  //		      if(media.hasNext) {
  //		        val item = media.next()
  //		        var newMessage = i.copy(profileImageUrl = 
  //		                   Some(item.mediaUrl))
  //		        messageList.append(newMessage)
  //		      }
  //	      } else
  //	    	messageList.append(i)
  //	    })
  //	    
  //	    messageList.toList
  //	}

}

object MessageDAO extends SalatDAO[Message, ObjectId](collection = MongoHQConfig.mongoDB("message"))




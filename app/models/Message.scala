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



case class Message(@Key("_id") id: ObjectId, text: String, messageType: MessageType.Value, messageAccess: MessageAccess.Value, timeCreated:Date , userId: ObjectId, streamId: ObjectId, firstNameofMsgPoster: String,
  lastNameofMsgPoster: String, rocks: Int, rockers: List[ObjectId])

case class MessageForm(message: String, access: Option[Boolean])

object Message {
  
  val formatter : DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy HH:mm:ss")
   
   
//  val currentDate=Calendar.getInstance
//  val dateNow = formatter.parse(currentDate.getTime.toString)
  
  
  def create(messageForm: MessageForm, userId: ObjectId, streamId: ObjectId, firstNameofMsgPoster: String, lastNameofMsgPoster: String): String = {
    
    (messageForm.access == None) match {
      case true => Message.createMessage(new Message((new ObjectId), messageForm.message, MessageType.Audio, MessageAccess.Public, formatter.parse("21-07-12 12:22:23"), userId, streamId, firstNameofMsgPoster, lastNameofMsgPoster, 0, List()))
      case _ => Message.createMessage(new Message((new ObjectId), messageForm.message, MessageType.Audio, MessageAccess.Private, formatter.parse("21-07-12 12:22:23"), userId, streamId, firstNameofMsgPoster, lastNameofMsgPoster, 0, List()))
    }
    
  
    UserDAO.find(MongoDBObject("_id" -> userId)).toList(0).firstName
  }

  def messagetypes: Seq[(String, String)] = {
    val messageType = for (value <- MessageAccess.values) yield (value.id.toString, value.toString)
    val v = messageType.toSeq
    v
  }

  def createMessage(message: Message): Unit = {

    validateUserHasRightToPost(message.userId, message.streamId) match {
      case true => MessageDAO.insert(message)
      case _ => println("No rights to Post")
    }
    //MessageDAO.insert(message).get

  }
  def findUser(userId: Int): User = {
    val user = UserDAO.findOneByID(userId)
    user.get
  }

  private def validateUserHasRightToPost(userId: ObjectId, streamId: ObjectId): Boolean = {
    val stream = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)
    stream.users.contains(userId)
  }

  def removeMessage(message: Message) {
    MessageDAO.remove(message)
  }

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
  def totalRocks(messageId: ObjectId): Int = {
    val messageRocked = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
    messageRocked.rocks
  }

  /*
   *  Update the Rockers List and increase the count by one 
   */

  def rockedIt(messageId: ObjectId, userId: ObjectId): List[ObjectId] = {
    val SelectedmessagetoRock = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
    MessageDAO.update(MongoDBObject("_id" -> messageId), SelectedmessagetoRock.copy(rockers = (SelectedmessagetoRock.rockers ++ List(userId))), false, false, new WriteConcern)

    val updatedMessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
    MessageDAO.update(MongoDBObject("_id" -> messageId), updatedMessage.copy(rocks = (updatedMessage.rocks + 1)), false, false, new WriteConcern)

    val finalMessage = MessageDAO.find(MongoDBObject("_id" -> messageId)).toList(0)
    finalMessage.rockers

  }


  /*
   * Sort messages within a stream on the basis of total rocks
   */

   def getAllMessagesForAStreamSortedbyRocks(streamId: ObjectId): List[Message] = {
    val messsages = MessageDAO.find(MongoDBObject("streamId" -> streamId)).toList.sortBy(message => message.rocks)
    messsages
  }
   
   def getAllMessagesForAStreamSortedbyTime(streamId: ObjectId): List[Message] = {
    val messsages = MessageDAO.find(MongoDBObject("streamId" -> streamId)).toList.sortBy(message => message.timeCreated)
    messsages
  }
}

object MessageDAO extends SalatDAO[Message, Int](collection = MongoHQConfig.mongoDB("message"))




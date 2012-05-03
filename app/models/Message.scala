package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import org.bson.types.ObjectId
import utils.MongoHQConfig
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

//TODO use a datetime instead of string for timestamp

case class Message(@Key("_id") id: ObjectId, text: String, messageType: MessageType.Value, messageAccess: MessageAccess.Value, timeCreated: String, userId: ObjectId, streamId: ObjectId, firstNameofMsgPoster: String,
  lastNameofMsgPoster: String, rocks: Int, rockers: List[ObjectId])
//case class MessageForm(message: String, messageAccess: String ,access:Option[Boolean])
case class MessageForm(message: String, access: Option[Boolean])

object Message {

  def create(messageForm: MessageForm, userId: ObjectId, streamId: ObjectId, firstNameofMsgPoster: String, lastNameofMsgPoster: String): String = {
    (messageForm.access == None) match {
      case true => Message.createMessage(new Message((new ObjectId), messageForm.message, MessageType.Audio, MessageAccess.Public, "Mar,20 10:12AM", userId, streamId, firstNameofMsgPoster, lastNameofMsgPoster, 0, List()))
      case _ => Message.createMessage(new Message((new ObjectId), messageForm.message, MessageType.Audio, MessageAccess.Private, "Mar,20 10:12AM", userId, streamId, firstNameofMsgPoster, lastNameofMsgPoster, 0, List()))
    }
    UserDAO.find(MongoDBObject("_id" -> userId)).toList(0).firstName
  }

  def messagetypes: Seq[(String, String)] = {
    val c = for (value <- MessageAccess.values) yield (value.id.toString, value.toString)
    val v = c.toSeq
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
  def countRoles(usersList: List[ObjectId]): Map[String, Int] = {

    var students, professionals, educators: Int = 0
    
    val users = UserDAO.find(MongoDBObject()).toList

    for (user <- users) {

      if (user.userType == UserType.Student && usersList.contains(user.id)) {
        students += 1
      } else if (user.userType == UserType.Professional && usersList.contains(user.id)) {
        professionals += 1
      } else if (user.userType == UserType.Educator && usersList.contains(user.id)) {
        educators += 1
      }

    }

    Map("Student" -> students, "Professional" -> professionals, "Educator" -> educators)

  } */

}

object MessageDAO extends SalatDAO[Message, Int](collection = MongoHQConfig.mongoDB("message"))




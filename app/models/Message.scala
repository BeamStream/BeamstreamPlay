package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection

object MessageType extends Enumeration {
  val Text = Value(0, "text")
  val Picture = Value(1, "Picture")
  val Video = Value(2, "Video")
  val Audio = Value(3, "Audio")
}

object MessageAccess extends Enumeration {
  val Private = Value(0, "Private")
  val Public = Value(1, "Public")
}

//TODO use a datetime instead of string for timestamp
case class Message(@Key("_id") id: Int, text: String, messageType: MessageType.Value, messageAccess: MessageAccess.Value, timeCreated: String, userId: Int, streamId: Int)

object Message {
  def createMessage(message: Message): Int = {
    validateUserHasRightToPost(message.userId, message.streamId) match {
      case true => MessageDAO.insert(message).get
      case _ => -1
    }

  }

  private def validateUserHasRightToPost(userId: Int, streamId: Int): Boolean = {
    val stream = StreamDAO.findOneByID(streamId)
    stream.get.users.contains(userId)
  }

  def removeMessage(message: Message) {
    MessageDAO.remove(message)
  }

  def getAllMessagesForAStream(streamId: Int): List[Message] = {
    MessageDAO.find(MongoDBObject("streamId" -> streamId)).toList
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

}

object MessageDAO extends SalatDAO[Message, Int](collection = MongoConnection()("beamstream")("message"))


package models
import com.mongodb.casbah.Imports.ObjectId
import com.novus.salat.annotations.raw.Key

object MessageType extends Enumeration {
  val Text = Value(0, "text")
  val Picture = Value(1, "Picture")
  val Video = Value(2, "Video")
  val Audio = Value(3, "Audio")
}

case class Message(@Key("_id") id: Int, text: String, messageType: MessageType.Value, timeCreated:String, userId: ObjectId, streamId: ObjectId)


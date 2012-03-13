package models
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import scala.collection.JavaConversions._

case class Stream(@Key("_id") id: Int, name: String, streamType: StreamType.Value, creator: Int, users: List[Int])
case class StreamForm(name: String, streamType: String, creator: Int)

object Stream {

  def all(): List[Stream] = Nil
  def create(streamForm: StreamForm) {

   Stream.createStream(new Stream((new ObjectId)._inc, streamForm.name,StreamType.apply(streamForm.streamType.toInt), streamForm.creator, List(21,22)))

  }

  def streamtypes: Seq[(String, String)] = {
    val c = for (value <- StreamType.values) yield (value.id.toString, value.toString)  
    val v = c.toSeq
    v
  }

  def getStreamByName(name: String): List[Stream] = {
    val regexp = (""".*""" + name + """.*""").r
    val streams = StreamDAO.find(MongoDBObject("name" -> regexp))
    streams.toList
  }

  def createStream(stream: Stream): Option[Int] = {
    StreamDAO.insert(stream)
  }

  def joinStream(streamId: Int, userId: Int) {
    val stream = StreamDAO.findOneByID(streamId)
    StreamDAO.update(MongoDBObject("_id" -> streamId), stream.get.copy(users = (stream.get.users ++ List(userId))), false, false, new WriteConcern)
  }
}

object StreamType extends Enumeration {
  type StreamType = Value
  val Class = Value(0, "Class")
  val Study = Value(1, "Study")
  val Research = Value(2, "Research")
  val Friends = Value(3, "Friends")
   val Scala = Value(4, "Scala")
}

object StreamDAO extends SalatDAO[Stream, Int](collection = MongoConnection()("beamstream")("stream"))

package models
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import scala.collection.JavaConversions._
import org.bson.types.ObjectId

case class Stream(@Key("_id") id: ObjectId, name: String, streamType: StreamType.Value, creator: Int, users: List[Int], posttoMyprofile: Boolean)
case class StreamForm(name: String, streamType: String, className: String, posttoMystream: Option[Boolean])
case class JoinStreamForm(streamname: String)

object Stream {

  def all(): List[Stream] = Nil
  def create(streamForm: StreamForm, userId: Int) {
    (streamForm.posttoMystream == None) match {
      case true =>
        val stream=Stream.createStream(new Stream(new ObjectId, streamForm.name, StreamType.apply(streamForm.streamType.toInt), userId, List(userId), false))
        Class.attachStreamtoClass(stream.id, new ObjectId(streamForm.className))
      case false =>
        val stream=Stream.createStream(new Stream(new ObjectId, streamForm.name, StreamType.apply(streamForm.streamType.toInt), userId, List(userId), true))
        Class.attachStreamtoClass(stream.id, new ObjectId(streamForm.className))
    }
   
  }

  def listall(): List[Stream] = Nil
  def join(streamname: String, userId: Int) {
    val stream = StreamDAO.find(MongoDBObject("name" -> streamname)).toList
    Stream.joinStream(stream(0).id, userId)
  }

  def streamtypes: Seq[(String, String)] = {
    val c = for (value <- StreamType.values) yield (value.id.toString, value.toString)
    val v = c.toSeq
    v
  }

  var UserObtained: Int = 0
  def obtainUser(userId: Int) = {
    UserObtained = userId
    getClassesforAUser

  }

  def getClassesforAUser: Seq[(String, String)] = {
    var myClasses = Seq[(String, String)]()
    print(UserObtained)
    val user = UserDAO.findOneByID(UserObtained).get
    for (schoolids <- user.schoolId) {
      val school = SchoolDAO.find(MongoDBObject("_id" -> schoolids)).toList(0)
      myClasses ++= (for (eachclass <- school.classes) yield (eachclass.id.toString, eachclass.className)).toSeq
    }
    myClasses
  }

  def getStreamByName(name: String): List[Stream] = {
    val regexp = (""".*""" + name + """.*""").r
    val streams = StreamDAO.find(MongoDBObject("name" -> regexp))
    streams.toList
  }

  def createStream(stream: Stream): Stream = {
    StreamDAO.insert(stream)
     stream
  }
  
  
  def getAllStream: List[Stream] = {
    val streams = StreamDAO.find(MongoDBObject("name" -> ".*".r))
    streams.toList
  }

  def joinStream(streamId: ObjectId, userId: Int) {
    val stream = StreamDAO.find(MongoDBObject("_id" -> streamId)).toList(0)
    StreamDAO.update(MongoDBObject("_id" -> streamId), stream.copy(users = (stream.users ++ List(userId))), false, false, new WriteConcern)
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

object StreamDAO extends SalatDAO[Stream, Int](collection = MongoConnection()("beamstream")("stream"))

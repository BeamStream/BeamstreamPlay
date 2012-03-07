package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import com.mongodb.gridfs.GridFS
import java.io.File
import com.mongodb.gridfs.GridFSInputFile
import org.bson.types.ObjectId

case class Media(@Key("_id") id: Int, userId: Int, mediaName: String, mediaType: MediaType.Value, mediaId: ObjectId)

object Media {

  def createMedia(media: Media) {
    
    MediaDAO.insert(media)

  }

  def deleteMedia(media: Media) {
    MediaDAO.remove(media)
  }

  def getAllMediaByUser(userId: Int): List[Media] = {
    MediaDAO.find(MongoDBObject("userId" -> userId)).toList
  }

}

object MediaType extends Enumeration {
  val Image = Value(0, "Image")
  val Video = Value(1, "Video")
  val Pdf = Value(2, "Pdf")
}
object MediaDAO extends SalatDAO[Media, Int](collection = MongoConnection()("beamstream")("media"))
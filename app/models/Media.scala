package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import java.io.File
import com.mongodb.gridfs.GridFSInputFile
import org.bson.types.ObjectId
import com.mongodb.Mongo
import java.io.InputStream
import play.api.mvc.Response
import utils.MongoHQConfig
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.gridfs.Imports._

case class Media(@Key("_id") id: ObjectId, userId: ObjectId, mediaType: MediaType.Value, showOnProfileView: Boolean, gridFsId: ObjectId)
case class MediaTransfer(userId: ObjectId, mediaType: MediaType.Value, showOnProfileView: Boolean, data: InputStream, profilePicName: String)

object Media {

 
  val gridFS = GridFS(MongoHQConfig.mongoDB)
  
  
  def createMedia(mediaTransfer: MediaTransfer) {

    val gfsFile = gridFS.createFile(mediaTransfer.data)
    gfsFile.filename=mediaTransfer.profilePicName
    gfsFile.save
    val gridFSMediaId = gfsFile.id.asInstanceOf[ObjectId]
    MediaDAO.insert(new Media(new ObjectId, mediaTransfer.userId, mediaTransfer.mediaType, mediaTransfer.showOnProfileView, gridFSMediaId))

  }

  def findMedia(mediaId: ObjectId): GridFSDBFile = {
    val myMedia = gridFS.findOne(mediaId)
    println(myMedia.get.chunkSize+"HOHOChunksize")
    myMedia.get
  }

  def deleteMedia(media: Media) {
    MediaDAO.remove(media)
  }

  def getAllMediaByUser(userId: ObjectId): List[Media] = {
    MediaDAO.find(MongoDBObject("userId" -> userId)).toList
  }

}

object MediaType extends Enumeration {
  val Image = Value(0, "Image")
  val Video = Value(1, "Video")
  val Pdf = Value(2, "Pdf")
}
object MediaDAO extends SalatDAO[Media, Int](collection =  MongoHQConfig.mongoDB("media"))
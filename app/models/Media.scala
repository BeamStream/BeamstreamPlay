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
import com.mongodb.gridfs.GridFSDBFile
import org.bson.types.ObjectId
import com.mongodb.Mongo
import java.io.InputStream
import play.api.mvc.Response

case class Media(@Key("_id") id: ObjectId, userId: Int, mediaType: MediaType.Value, showOnProfileView:Boolean, gridFsId:ObjectId)
case class MediaTransfer(userId: Int, mediaType: MediaType.Value, showOnProfileView:Boolean, data:InputStream,profilePicName:String)

object Media {

    val mongo = new Mongo("localhost", 27017)
    val db = mongo.getDB("beamstream")
    val collection = db.getCollection("media")
    val gfsPhoto = new GridFS(db, "photo")
  
   def createMedia(mediaTransfer: MediaTransfer) {
    
//    val mongo = new Mongo("localhost", 27017)
//    val db = mongo.getDB("beamstream")
//    val collection = db.getCollection("media")
//    val gfsPhoto = new GridFS(db, "photo")
      
    val gfsFile = gfsPhoto.createFile(mediaTransfer.data)
    gfsFile.setFilename(mediaTransfer.profilePicName)
    gfsFile.save
    val gridFSMediaId = gfsFile.getId().asInstanceOf[ObjectId]
    MediaDAO.insert(new Media(new ObjectId, mediaTransfer.userId, mediaTransfer.mediaType, mediaTransfer.showOnProfileView, gridFSMediaId))
    
  }

    
  def findMedia(mediaId:ObjectId):GridFSDBFile = {
   val myMedia= gfsPhoto.findOne(mediaId)
   
   myMedia
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
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

case class Media(@Key("_id") id: ObjectId, userId: ObjectId, mediaType: MediaType.Value, showOnProfileView: Boolean, userProfileImageId: ObjectId,
  userProfileVideoId: ObjectId, mobile: String, uploadType: String)
case class MediaTransfer(userId: ObjectId, mediaType: MediaType.Value, showOnProfileView: Boolean, profileImage: InputStream, profilePicName: String,
  profileVideo: InputStream, profileVideoName: String, mobile: String, uploadType: String)

object Profile {

  val gridFS = GridFS(MongoHQConfig.mongoDB)

  def createMedia(mediaTransfer: MediaTransfer) {

    val userProfileImage = gridFS.createFile(mediaTransfer.profileImage)
    userProfileImage.filename = mediaTransfer.profilePicName
    userProfileImage.save

    val userProfileVideo = gridFS.createFile(mediaTransfer.profileVideo)
    userProfileVideo.filename = mediaTransfer.profileVideoName
    userProfileVideo.save

    val userProfileImageId = userProfileImage.id.asInstanceOf[ObjectId]
    val userProfileVideoId = userProfileVideo.id.asInstanceOf[ObjectId]

    MediaDAO.insert(new Media(new ObjectId, mediaTransfer.userId, mediaTransfer.mediaType, mediaTransfer.showOnProfileView, userProfileImageId, userProfileVideoId, mediaTransfer.mobile, mediaTransfer.uploadType))

  }

  def findMedia(mediaId: ObjectId): GridFSDBFile = {
    val myMedia = gridFS.findOne(mediaId)
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
  val File = Value(3, "File")
  val Presentation = Value(4, "Presentation")

}
object MediaDAO extends SalatDAO[Media, Int](collection = MongoHQConfig.mongoDB("media"))
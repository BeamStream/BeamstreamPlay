package models

//TODO : This was with our previous architecture. To Be Removed.

import com.mongodb.casbah.Imports._
import java.io.InputStream
import utils.MongoHQConfig
import com.mongodb.casbah.gridfs.Imports._
import models.mongoContext._
import com.novus.salat.annotations.raw.Key
import com.novus.salat.dao.SalatDAO



/**
 * This Code Would Be Used When We'll Save File In GridFS DB
 */
case class Media(@Key("_id") id: ObjectId,
  userId: ObjectId,
  mediaType: MediaType.Value,
  showOnProfileView: Boolean,
  userProfileImageId: ObjectId,
  userProfileVideoId: ObjectId,
  mobile: String,
  uploadType: String)

case class MediaTransfer(userId: ObjectId,
  mediaType: MediaType.Value,
  showOnProfileView: Boolean,
  profileImage: InputStream,
  profilePicName: String,
  profileVideo: InputStream,
  profileVideoName: String,
  mobile: String,
  uploadType: String)

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

package models

import com.novus.salat.dao.SalatDAO
import utils.MongoHQConfig
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject

case class UserMedia(@Key("_id") id: ObjectId, userId: ObjectId, mediaUrl: String, contentType: UserMediaType.Value, isProfile: Boolean)

object UserMediaType extends Enumeration {
  val Image = Value(0, "Image")
  val Video = Value(1, "Video")
  val Pdf = Value(2, "Pdf")
  val File = Value(3, "File")
  val Presentation = Value(4, "Presentation")

}
object UserMedia {

  def saveMediaForUser(media: UserMedia) {
    val mediaId = UserMediaDAO.insert(media)
    //ProfileImageProvider.profileImageMap += media.userId -> media.mediaUrl
  }

  /*
 * Get profile picture for a user
 */
  def getProfilePicForAUser(userId: ObjectId): UserMedia = {
    val mediaObtained = UserMediaDAO.find(MongoDBObject("userId" -> userId, "contentType" -> "Image")).toList
    mediaObtained(0)
  }

  /*
  /*
   * Mark other picture as "not profile picture"
   */
  def isNotProfilePic(userId: ObjectId) {
    UserMediaDAO.update(MongoDBObject("userId" -> userId), MongoDBObject("isProfilePicture" -> false), false, false)

  }
*/
/*
 * Get All picture for a user
 */
  def getAllProfilePicForAUser(userId: ObjectId): List[String] = {
    var userPhotos: List[String] = List()
    val mediaObtained = UserMediaDAO.find(MongoDBObject("userId" -> userId, "contentType" -> "Image")).toList
    for (media <- mediaObtained) {
      userPhotos ++= List(media.mediaUrl)
    }
    userPhotos
  }
  
  
  /*
 * Get All videos for a user
 */
  def getAllProfileVideoForAUser(userId: ObjectId): List[String] = {
    var userVideos: List[String] = List()
    val mediaObtained = UserMediaDAO.find(MongoDBObject("userId" -> userId, "contentType" -> "Video")).toList
    for (media <- mediaObtained) {
      userVideos ++= List(media.mediaUrl)
    }
    userVideos
  }

}
object UserMediaDAO extends SalatDAO[UserMedia, ObjectId](collection = MongoHQConfig.mongoDB("userMedia"))
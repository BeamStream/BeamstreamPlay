package models

import com.novus.salat.dao.SalatDAO
import utils.MongoHQConfig
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern

case class UserMedia(@Key("_id") id: ObjectId, userId: ObjectId, mediaUrl: String, contentType: UserMediaType.Value, isPrimary: Boolean,frameURL:String)

object UserMediaType extends Enumeration {
  val Image = Value(0, "Image")
  val Video = Value(1, "Video")
  val Pdf = Value(2, "Pdf")
  val File = Value(3, "File")
  val Presentation = Value(4, "Presentation")

}
object UserMedia {

  /**
   * Save User Media
   */
  def saveMediaForUser(media: UserMedia) {
    (media.isPrimary == true) match {
      case true => makePresentOnePrimary(media.userId)
      case false =>
    }
    val mediaId = UserMediaDAO.insert(media)
  }

  /*
 * Get profile picture for a user
 */
  def getProfilePicForAUser(userId: ObjectId): List[UserMedia] = {
    val mediaObtained = UserMediaDAO.find(MongoDBObject("userId" -> userId, "isPrimary" -> true)).toList
    mediaObtained
  }

  /*
 * Get All picture for a user
 */
  def getAllProfilePicForAUser(userId: ObjectId): List[UserMedia] = {
    var userPhotos: List[UserMedia] = List()
    val mediaObtained = UserMediaDAO.find(MongoDBObject("userId" -> userId, "contentType" -> "Image")).toList
    for (media <- mediaObtained) {
      userPhotos ++= List(media)
    }
    userPhotos
  }

  /*
 * Get All videos for a user
 * @Purpose : Show all Videos for a user
 */
  def getAllProfileVideoForAUser(userId: ObjectId): List[UserMedia] = {
    var userVideos: List[UserMedia] = List()
    val mediaObtained = UserMediaDAO.find(MongoDBObject("userId" -> userId, "contentType" -> "Video")).toList
    for (media <- mediaObtained) {
      userVideos ++= List(media)
    }
    userVideos
  }

  /*
 * Get All Media for a user
 * @Purpose : Show all Media for a user
 */
  def getAllMediaForAUser(userId: ObjectId): List[UserMedia] = {
    val mediaObtained = UserMediaDAO.find(MongoDBObject("userId" -> userId)).toList
    mediaObtained
  }

  def makePresentOnePrimary(userId: ObjectId) {
    val AlluserMedia = getAllMediaForAUser(userId)
    for (media <- AlluserMedia) {
      val updatedMedia = new UserMedia(media.id, media.userId, media.mediaUrl, media.contentType, false,media.frameURL)
      UserMediaDAO.update(MongoDBObject("_id" -> media.id), updatedMedia, false, false, new WriteConcern)
    }

  }
}
object UserMediaDAO extends SalatDAO[UserMedia, ObjectId](collection = MongoHQConfig.mongoDB("userMedia"))
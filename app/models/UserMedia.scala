package models

import com.novus.salat.dao.SalatDAO
import utils.MongoHQConfig
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern

case class UserMedia(@Key("_id") id: ObjectId, userId: ObjectId, mediaUrl: String, contentType: UserMediaType.Value, isPrimary: Boolean,frameURL:String,rocks:Int,rockers: List[ObjectId])

object UserMediaType extends Enumeration {
  val Image = Value(0, "Image")
  val Video = Value(1, "Video")
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
      val updatedMedia = new UserMedia(media.id, media.userId, media.mediaUrl, media.contentType, false,media.frameURL,0,List())
      UserMediaDAO.update(MongoDBObject("_id" -> media.id), updatedMedia, false, false, new WriteConcern)
    }
  }
  
  
   /*
   *  Update the Rockers List and increase the count by one 
   */

  def rockUserMedia(userMediaId: ObjectId, userId: ObjectId): Int = {

    val userMedia = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
    userMedia.rockers.contains(userId) match {

      case true =>
        UserMediaDAO.update(MongoDBObject("_id" -> userMediaId), userMedia.copy(rockers = (userMedia.rockers -- List(userId))), false, false, new WriteConcern)
        val updatedUserMedia = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
        UserMediaDAO.update(MongoDBObject("_id" -> userMediaId), updatedUserMedia.copy(rocks = (updatedUserMedia.rocks - 1)), false, false, new WriteConcern)
        val userMedia = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
        userMedia.rocks
      case false =>
         UserMediaDAO.update(MongoDBObject("_id" -> userMediaId), userMedia.copy(rockers = (userMedia.rockers ++ List(userId))), false, false, new WriteConcern)
        val updatedUserMedia = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
        UserMediaDAO.update(MongoDBObject("_id" -> userMediaId), updatedUserMedia.copy(rocks = (updatedUserMedia.rocks + 1)), false, false, new WriteConcern)
        val userMedia = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
        userMedia.rocks
    }
  }
  
    /*
  * Names of a rockers for a UserMedia
  */
  def rockersNamesOfUserMedia(userMediaId: ObjectId): List[String] = {
    val userMedia = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
    val rockersName = User.giveMeTheRockers(userMedia.rockers)
    rockersName
  }

}
object UserMediaDAO extends SalatDAO[UserMedia, ObjectId](collection = MongoHQConfig.mongoDB("userMedia"))
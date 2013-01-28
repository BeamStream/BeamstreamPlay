package models

import com.novus.salat.dao.SalatDAO
import utils.MongoHQConfig
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern
import java.util.Date
case class UserMedia(@Key("_id") id: ObjectId,
  name: String,
  description: String,
  userId: ObjectId,
  dateCreated: Date,
  mediaUrl: String,
  contentType: UserMediaType.Value,
  access: DocumentAccess.Value,
  isPrimary: Boolean,
  frameURL: String,
  rocks: Int,
  rockers: List[ObjectId],
  comments: List[ObjectId],
  views: Int = 0)

object UserMediaType extends Enumeration {
  val Image = Value(0, "Image")
  val Video = Value(1, "Video")
}

object UserMedia extends RockConsumer {

  /**
   * Save User Media
   */
  def saveMediaForUser(media: UserMedia) = {
    (media.isPrimary == true) match {
      case true => makePresentOnePrimary(media.userId)
      case false =>
    }
    val mediaId = UserMediaDAO.insert(media)
    mediaId
  }

  /*
   * Find Media by Id
   */

  def findMediaById(mediaId: ObjectId) = {
    val media = UserMediaDAO.findOneByID(mediaId)
    media
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
      val updatedMedia = new UserMedia(media.id, media.name, media.description, media.userId, media.dateCreated, media.mediaUrl, media.contentType, media.access, false, media.frameURL, 0, List(), media.comments)
      UserMediaDAO.update(MongoDBObject("_id" -> media.id), updatedMedia, false, false, new WriteConcern)
    }
  }

  /**
   * add Comment to UserMedia
   */
  def addCommentToUserMedia(commentId: ObjectId, usermediaId: ObjectId) = {
    val userMedia = UserMediaDAO.find(MongoDBObject("_id" -> usermediaId)).toList(0)
    UserMediaDAO.update(MongoDBObject("_id" -> usermediaId), userMedia.copy(comments = (userMedia.comments ++ List(commentId))), false, false, new WriteConcern)
  }

  /**
   *  Update the Rockers List and increase the count by one
   */

  def rockUserMedia(userMediaId: ObjectId, userId: ObjectId): Int = {

    val userMedia = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
    userMedia.rockers.contains(userId) match {

      case true =>
        UserMediaDAO.update(MongoDBObject("_id" -> userMediaId), userMedia.copy(rockers = (userMedia.rockers filterNot (List(userId) contains))), false, false, new WriteConcern)
        val updatedUserMedia = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
        UserMediaDAO.update(MongoDBObject("_id" -> userMediaId), updatedUserMedia.copy(rocks = (updatedUserMedia.rocks - 1)), false, false, new WriteConcern)
        val updatedUserMedia1 = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
        updatedUserMedia1.rocks
      case false =>
        UserMediaDAO.update(MongoDBObject("_id" -> userMediaId), userMedia.copy(rockers = (userMedia.rockers ++ List(userId))), false, false, new WriteConcern)
        val updatedUserMedia = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
        UserMediaDAO.update(MongoDBObject("_id" -> userMediaId), updatedUserMedia.copy(rocks = (updatedUserMedia.rocks + 1)), false, false, new WriteConcern)
        val updatedUserMedia1 = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
        updatedUserMedia1.rocks
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

  /**
   * Change the Title and description of Media
   */
  def updateTitleAndDescription(userMediaId: ObjectId, newName: String, newDescription: String) = {
    val usermedia = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
    UserMediaDAO.update(MongoDBObject("_id" -> userMediaId), usermedia.copy(description = newDescription, name = newName), false, false, new WriteConcern)
  }

  /**
   * Increasing View Count
   */
  def increaseViewCountOfUsermedia(userMediaId: ObjectId) {
    val userMediaFound = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
    UserMediaDAO.update(MongoDBObject("_id" -> userMediaId), userMediaFound.copy(views = (userMediaFound.views + 1)), false, false, new WriteConcern)
    val updatedUserMedia1 = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
    updatedUserMedia1.views
  }
  
  //TODO : Add Rock to Media If Message Contains docIdIfAny
  def rockTheMediaOrDoc(idToBeRocked: ObjectId, userId: ObjectId) {
    val userMedia = UserMedia.findMediaById(idToBeRocked)
    if (!(userMedia == None)) UserMedia.rockUserMedia(idToBeRocked, userId)

  }
  //TODO : Add Comment to Media If Message Contains docIdIfAny
  def commentTheMediaOrDoc(id: ObjectId, commentId: ObjectId) {
    val userMedia = UserMedia.findMediaById(id)
    (userMedia == None) match {
      case true =>
      case false => addCommentToUserMedia(commentId, id)
    }
  }

}
object UserMediaDAO extends SalatDAO[UserMedia, ObjectId](collection = MongoHQConfig.mongoDB("userMedia"))
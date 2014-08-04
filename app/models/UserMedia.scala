package models

import com.novus.salat.dao.SalatDAO
import utils.MongoHQConfig
import com.novus.salat.annotations.raw.Key
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern
import java.util.Date
import java.util.regex.Pattern
import models.mongoContext._
import scala.language.postfixOps
import com.mongodb.casbah.Imports.WriteResult

case class UserMedia(@Key("_id") id: ObjectId,
  name: String,
  description: String,
  userId: ObjectId,
  dateCreated: Date,
  mediaUrl: String,
  contentType: UserMediaType.Value,
  access: Access.Value,
  isPrimary: Boolean,
  streamId: Option[ObjectId] = None,
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
   * Find userMedia by userId
   *
   */
  def findUserMediaByUserId(userId: ObjectId): List[UserMedia] = {
    UserMediaDAO.find(MongoDBObject("userId" -> userId, "isPrimary" -> true)).toList

  }

  /**
   * Save User Media
   */
  def saveMediaForUser(media: UserMedia): Option[ObjectId] = {
    media.isPrimary match {
      case true => makePresentOnePrimary(media.userId)
      case false =>
    }
    UserMediaDAO.insert(media)

  }

  /*
   * Find Media by Id
   */

  def findMediaById(mediaId: ObjectId): Option[UserMedia] = {
    UserMediaDAO.findOneById(mediaId)

  }
  /**
   * Get profile picture for a user
   */
  def getProfilePicForAUser(userId: ObjectId): List[UserMedia] = {
    UserMediaDAO.find(MongoDBObject("userId" -> userId, "isPrimary" -> true)).toList
  }

  /**
   * Get Picture URL String for a User
   */
  def getProfilePicUrlString(userId: ObjectId): String = {
    val userMedia = UserMedia.getProfilePicForAUser(userId)

    val profilePicForUser = (!userMedia.isEmpty) match {
      case true => (userMedia.head.frameURL != "") match {
        case true => userMedia.head.frameURL
        case false => userMedia.head.mediaUrl
      }
      case false => ""
    }

    profilePicForUser
  }

  /**
   * Get All picture for a user
   */
  def getAllPicsForAUser(userId: ObjectId): List[UserMedia] = {
    UserMediaDAO.find(MongoDBObject("userId" -> userId, "contentType" -> "Image")).toList
  }

  /**
 * Get All videos for a user
 * Purpose : Show all Videos for a user
 */
  def allVideosForAuser(userId: ObjectId): List[UserMedia] = {
    UserMediaDAO.find(MongoDBObject("userId" -> userId, "contentType" -> "Video")).toList
  }

  /**
   * Get All Media for a user
   * Purpose : Show all Media for a user (V)
   */
  def getAllMediaForAUser(userId: ObjectId): List[UserMedia] = {
    UserMediaDAO.find(MongoDBObject("userId" -> userId)).toList
  }

  def makePresentOnePrimary(userId: ObjectId) {
    val AlluserMedia = getAllMediaForAUser(userId)
    AlluserMedia map {
      case media =>
        val updatedMedia = new UserMedia(media.id, media.name, media.description, media.userId, media.dateCreated, media.mediaUrl, media.contentType, media.access, false, media.streamId, media.frameURL, 0, List(), media.comments)
        UserMediaDAO.update(MongoDBObject("_id" -> media.id), updatedMedia, false, false, new WriteConcern)
    }
  }

  /**
   * add Comment to UserMedia
   */
  def addCommentToUserMedia(commentId: ObjectId, usermediaId: ObjectId): WriteResult = {
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

  /**
   * Names of a rockers for a UserMedia
   */
  def rockersNamesOfUserMedia(userMediaId: ObjectId): List[String] = {
    val userMedia = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
    User.giveMeTheRockers(userMedia.rockers)
  }

  /**
   * Change the Title and description of Media
   */
  def updateTitleAndDescription(userMediaId: ObjectId, newName: String, newDescription: String): WriteResult = {
    val usermedia = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
    UserMediaDAO.update(MongoDBObject("_id" -> userMediaId), usermedia.copy(description = newDescription, name = newName), false, false, new WriteConcern)
  }

  /**
   * Increasing View Count
   */
  def increaseViewCountOfUsermedia(userMediaId: ObjectId): Int = {
    val userMediaFound = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
    UserMediaDAO.update(MongoDBObject("_id" -> userMediaId), userMediaFound.copy(views = (userMediaFound.views + 1)), false, false, new WriteConcern)
    val updatedUserMedia1 = UserMediaDAO.find(MongoDBObject("_id" -> userMediaId)).toList(0)
    updatedUserMedia1.views
  }

  /**
   * Recent Profile pic of user
   */
  def recentProfilePicForAUser(userId: ObjectId): Option[UserMedia] = {
    val profilePic = UserMediaDAO.find(MongoDBObject("userId" -> userId, "contentType" -> "Image")).sort(orderBy = MongoDBObject("dateCreated" -> -1)).limit(2).toList
    profilePic.isEmpty match {
      case true => None
      case false => Option(profilePic.head)
    }

  }

  /**
   * Recent Profile video of user
   */
  def recentProfileVideoForAUser(userId: ObjectId): Option[UserMedia] = {
    val profilePic = UserMediaDAO.find(MongoDBObject("userId" -> userId, "contentType" -> "Video")).sort(orderBy = MongoDBObject("dateCreated" -> -1)).limit(2).toList
    profilePic.isEmpty match {
      case true => None
      case false => Option(profilePic.head)
    }

  }

  /**
   * Search Media For A User By Keyword
   */

  def searchMediaForAUserByName(userId: ObjectId, keyword: String): List[UserMedia] = {
    val keyWordPattern = Pattern.compile(keyword, Pattern.CASE_INSENSITIVE)
    UserMediaDAO.find(MongoDBObject("userId" -> userId, "name" -> keyWordPattern)).toList

  }

  //Add Rock to Media If Message Contains docIdIfAny
  def rockTheMediaOrDoc(idToBeRocked: ObjectId, userId: ObjectId) {
    val userMedia = UserMedia.findMediaById(idToBeRocked)
    if (!(userMedia == None)) UserMedia.rockUserMedia(idToBeRocked, userId)

  }
  // Add Comment to Media If Message Contains docIdIfAny
  def commentTheMediaOrDoc(id: ObjectId, commentId: ObjectId) {
    val userMedia = UserMedia.findMediaById(id)
    (userMedia == None) match {
      case true =>
      case false => addCommentToUserMedia(commentId, id)
    }
  }

}
object UserMediaDAO extends SalatDAO[UserMedia, ObjectId](collection = MongoHQConfig.mongoDB("userMedia"))

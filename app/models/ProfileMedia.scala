package models

import com.novus.salat.dao.SalatDAO
import utils.MongoHQConfig
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject

case class ProfileMedia(@Key("_id") id: ObjectId, userId: ObjectId, profileImageUrl: String, profileVideoUrl: String, mobile: String, uploadType: String)
object ProfileMedia {

  def saveMediaForUser(media: ProfileMedia) {
    val mediaId = ProfileMediaDAO.insert(media)
  }

  /*
 * Get Media for a user
 */
  def getMediaForAUser(userId: ObjectId): ProfileMedia = {
  val mediaObtained=ProfileMediaDAO.find(MongoDBObject("userId" -> userId)).toList(0)
  mediaObtained
  }

}
object ProfileMediaDAO extends SalatDAO[ProfileMedia, ObjectId](collection = MongoHQConfig.mongoDB("profileMedia"))
package models

import com.novus.salat.dao.SalatDAO
import utils.MongoHQConfig
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject

case class ProfileMedia(@Key("_id") id: ObjectId, userId: ObjectId, mediaUrl: String, contentType: ProfileMediaType.Value, isProfile: Boolean)

object ProfileMediaType extends Enumeration {
  val Image = Value(0, "Image")
  val Video = Value(1, "Video")
  val Pdf = Value(2, "Pdf")
  val File = Value(3, "File")
  val Presentation = Value(4, "Presentation")

}
object ProfileMedia {

  def saveMediaForUser(media: ProfileMedia) {
    val mediaId = ProfileMediaDAO.insert(media)
  }

 
  
  /*
 * Get profile picture for a user
 */
  def getProfilePicForAUser(userId: ObjectId): ProfileMedia = {
    val mediaObtained = ProfileMediaDAO.find(MongoDBObject("userId" -> userId, "contentType" -> "Image")).toList
    mediaObtained(0)
  }

  
   /*
  /*
   * Mark other picture as "not profile picture"
   */
  def isNotProfilePic(userId: ObjectId) {
    ProfileMediaDAO.update(MongoDBObject("userId" -> userId), MongoDBObject("isProfilePicture" -> false), false, false)

  }

  /*
 * Get All picture for a user
 */
  def getAllMediaForAUser(userId: ObjectId): List[ProfileMedia] = {
    val mediaObtained = ProfileMediaDAO.find(MongoDBObject("userId" -> userId)).toList
    mediaObtained
  }

*/
}
object ProfileMediaDAO extends SalatDAO[ProfileMedia, ObjectId](collection = MongoHQConfig.mongoDB("profileMedia"))
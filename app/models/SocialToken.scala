package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import org.bson.types.ObjectId
import utils.MongoHQConfig
import com.mongodb.casbah.commons.MongoDBObject

case class SocialToken(@Key("_id") id: ObjectId, refreshToken: String)
object SocialToken {
  /**
   * Store RefreshToken
   */
  def addToken(refreshToken: SocialToken) = {
    SocialTokenDAO.insert(refreshToken)
  }

  /**
   * Find RefreshToken for a User
   */
  def findSocialToken(userId: ObjectId): Option[String] = {
    val tokenFound = SocialTokenDAO.find(MongoDBObject("userId" -> userId)).toList
    tokenFound.isEmpty match {
      case true => None
      case false => Option(tokenFound.head.refreshToken)
    }
  }

}
object SocialTokenDAO extends SalatDAO[SocialToken, Int](collection = MongoHQConfig.mongoDB("socialtoken"))
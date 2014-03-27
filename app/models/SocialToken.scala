package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import org.bson.types.ObjectId
import utils.MongoHQConfig
import com.mongodb.casbah.commons.MongoDBObject
import models.mongoContext._
import com.mongodb.WriteConcern

case class SocialToken(@Key("_id") id: ObjectId, refreshToken: String, tokenFlag: Boolean)
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
    val tokenFound = SocialTokenDAO.find(MongoDBObject("_id" -> userId)).toList
    tokenFound.isEmpty match {
      case true => None
      case false => Option(tokenFound.head.refreshToken)
    }
  }

  def findSocialTokenObject(userId: ObjectId) = {
    val tokenFound = SocialTokenDAO.find(MongoDBObject("_id" -> userId)).toList
    tokenFound.isEmpty match {
      case true => None
      case false => Option(tokenFound.head)
    }
  }

  def updateTokenFlag(userId: ObjectId, flag: Boolean) = {
    val tokenRequired = SocialTokenDAO.find(MongoDBObject("_id" -> userId)).toList
    SocialTokenDAO.update(MongoDBObject("_id" -> userId), tokenRequired.head.copy(tokenFlag = flag), false, false, new WriteConcern)
  }

  def deleteSocialToken(refreshToken: String) = {
    val socialTokenToRemove = SocialTokenDAO.find(MongoDBObject("refreshToken" -> refreshToken)).toList
    SocialTokenDAO.remove(socialTokenToRemove(0))
  }

}
object SocialTokenDAO extends SalatDAO[SocialToken, Int](collection = MongoHQConfig.mongoDB("socialtoken"))
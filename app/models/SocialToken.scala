package models

import com.novus.salat.annotations.raw.Key
import com.novus.salat.dao.SalatDAO
import org.bson.types.ObjectId
import utils.MongoHQConfig
import com.mongodb.casbah.commons.MongoDBObject
import models.mongoContext._
import com.mongodb.WriteConcern
import com.mongodb.casbah.Imports.WriteResult

case class SocialToken(@Key("_id") id: ObjectId, refreshToken: String, tokenFlag: Boolean, gmailId: String)
object SocialToken {
  /**
   * Store RefreshToken
   */
  def addToken(refreshToken: SocialToken): Option[Int] = {
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

  def findSocialTokenObject(userId: ObjectId): Option[SocialToken] = {
    val tokenFound = SocialTokenDAO.find(MongoDBObject("_id" -> userId)).toList
    tokenFound.isEmpty match {
      case true => None
      case false => Option(tokenFound.head)
    }
  }

  def findGmailId(userId: ObjectId): Option[String] = {
    val gmailIdFound = SocialTokenDAO.find(MongoDBObject("_id" -> userId)).toList
    gmailIdFound.isEmpty match {
      case true => None
      case false => Option(gmailIdFound.head.gmailId)
    }
  }

  def updateTokenFlag(userId: ObjectId, flag: Boolean): WriteResult = {
    val tokenRequired = SocialTokenDAO.find(MongoDBObject("_id" -> userId)).toList
    SocialTokenDAO.update(MongoDBObject("_id" -> userId), tokenRequired.head.copy(tokenFlag = flag), false, false, new WriteConcern)
  }

  def deleteSocialToken(id: ObjectId): WriteResult = {
    val socialTokenToRemove = SocialTokenDAO.find(MongoDBObject("_id" -> id)).toList
    socialTokenToRemove.isEmpty match {
      case false => SocialTokenDAO.remove(socialTokenToRemove(0))
      case true => SocialTokenDAO.remove(new SocialToken(new ObjectId, "", false, ""))
    }
  }

}
object SocialTokenDAO extends SalatDAO[SocialToken, Int](collection = MongoHQConfig.mongoDB("socialtoken"))

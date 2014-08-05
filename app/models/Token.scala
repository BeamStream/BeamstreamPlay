package models

import com.novus.salat.annotations.raw.Key
import com.novus.salat.dao.SalatDAO
import org.bson.types.ObjectId
import utils.MongoHQConfig
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern
import models.mongoContext._
import com.mongodb.casbah.Imports.WriteResult

case class Token(@Key("_id") id: ObjectId, userId: String, tokenString: String, used: Boolean)
object Token {

  /**
   * Add Mail Token
   */
  def addToken(token: Token): Option[Int] = {
    TokenDAO.insert(token)
  }

  /**
   * Remove token by Token Id
   */
  def removeToken(token: Token) {
    TokenDAO.remove(token)
  }

  /**
   * Find Mail TOken on basis of token string
   */

  def findToken(tokenString: String): List[Token] = {
    TokenDAO.find(MongoDBObject("tokenString" -> tokenString)).toList
  }

  def findTokenByUserId(userId: String): List[Token] = {
    TokenDAO.find(MongoDBObject("userId" -> userId)).toList
  }

  /**
   * Find Mail Token on basis of user Id
   */

  //  def findTokenOnBasisOfUserID(userId: String): List[Token] = {
  //    TokenDAO.find(MongoDBObject("userId" -> new ObjectId(userId))).toList
  //  }
  //
  //  def isUserRegistered(userId: String) = {
  //    TokenDAO.find(MongoDBObject("userId" -> new ObjectId(userId))).toList.head.used
  //  }

  /**
   * Update Mail TOken (VA)
   */

  def updateToken(tokenString: String): WriteResult = {
    val tokenRequired = TokenDAO.find(MongoDBObject("tokenString" -> tokenString)).toList
    TokenDAO.update(MongoDBObject("tokenString" -> tokenString), tokenRequired.head.copy(used = true), false, false, new WriteConcern)

  }

}
object TokenDAO extends SalatDAO[Token, Int](collection = MongoHQConfig.mongoDB("token"))

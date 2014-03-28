package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import org.bson.types.ObjectId
import utils.MongoHQConfig
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern
import models.mongoContext._

case class Token(@Key("_id") id: ObjectId, tokenString: String, used: Boolean)
object Token {

  /**
   * Add Mail Token
   */
  def addToken(token: Token) = {
    TokenDAO.insert(token)
  }

  /**
   * Find Mail TOken on basis of token string
   */

  def findToken(tokenString: String): List[Token] = {
    TokenDAO.find(MongoDBObject("tokenString" -> tokenString)).toList
  }

  
  def findTokenById(userId: ObjectId): List[Token] = {
    TokenDAO.find(MongoDBObject("_id" -> userId)).toList
  }
  
  /**
   * Find Mail TOken on basis of user Id
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

  def updateToken(tokenString: String) = {
    val tokenRequired = TokenDAO.find(MongoDBObject("tokenString" -> tokenString)).toList
    TokenDAO.update(MongoDBObject("tokenString" -> tokenString), tokenRequired.head.copy(used = true), false, false, new WriteConcern)

  }

}
object TokenDAO extends SalatDAO[Token, Int](collection = MongoHQConfig.mongoDB("token"))
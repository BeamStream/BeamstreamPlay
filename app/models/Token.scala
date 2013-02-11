package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import org.bson.types.ObjectId
import utils.MongoHQConfig
import com.mongodb.casbah.commons.MongoDBObject

case class Token(@Key("_id") id: ObjectId, tokenString: String)
object Token {
  
  def addToken(token:Token)={
    TokenDAO.insert(token)
  }
  
  def findToken(tokenString:String): List[Token]={
    TokenDAO.find(MongoDBObject("tokenString"-> tokenString)).toList
  }

}
object TokenDAO extends SalatDAO[Token, Int](collection =  MongoHQConfig.mongoDB("token"))
package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import org.bson.types.ObjectId
import utils.MongoHQConfig
import com.mongodb.casbah.commons.MongoDBObject

case class BetaUser(@Key("_id") id: ObjectId, emailId: String)

object BetaUser {

  /**
   * Add Beta User
   */
  def addBetaUser(betaUser: BetaUser) = {
    BetaUserDAO.insert(betaUser)
  }: Option[ObjectId]

  /**
   * Find User By Id
   */

  def findBetaUserbyEmail(email: String) = {
    BetaUserDAO.find(MongoDBObject("emailId" -> email)).toList
  }: List[BetaUser]

}


object BetaUserDAO extends SalatDAO[BetaUser, ObjectId](collection = MongoHQConfig.mongoDB("betausers"))
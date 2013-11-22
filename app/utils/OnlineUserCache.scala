package utils

import play.api.cache.Cache
import play.api.Play.current
import com.novus.salat.dao.SalatDAO
import org.bson.types.ObjectId
import com.novus.salat.global._
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern
import models.mongoContext._

case class OnlineUsers(onlineUsers: scala.collection.mutable.Map[ObjectId, BigInt] = scala.collection.mutable.Map())
object OnlineUserCache {

  /*var onlineUsers: List[String] = Nil*/

  /**
   * Deactivate The User Session
   */

  def setOffline(userIdkey: String) = {
    /* onlineUsers filterNot (List(userIdkey)contains)
        Cache.set("Online Users", onlineUsers)*/

    val onlineUsersFound = OnlineUserDAO.find(MongoDBObject()).toList
    (onlineUsersFound.isEmpty) match {
      case true =>
      case false =>
        if (onlineUsersFound.head.onlineUsers.contains(new ObjectId(userIdkey))) {
          OnlineUserDAO.update(MongoDBObject(), onlineUsersFound.head.copy(onlineUsers = (onlineUsersFound.head.onlineUsers -- ( new ObjectId -> 222222)), false, false, new WriteConcern)
        }
    }

  }

  /**
   * Activate The User Session (V)
   */

  def setOnline(userIdkey: String) = {
    /*if (onlineUsers.contains(userIdkey) == false) {
          onlineUsers ++= List(userIdkey)
          Cache.set("Online Users", onlineUsers)
        }*/

    val onlineUsersFound = OnlineUserDAO.find(MongoDBObject()).toList
    (onlineUsersFound.isEmpty) match {
      case true => OnlineUserDAO.insert(OnlineUsers(List(new ObjectId(userIdkey))))
      case false =>
        if (!onlineUsersFound.head.onlineUsers.contains(new ObjectId(userIdkey))) {
          OnlineUserDAO.update(MongoDBObject(), onlineUsersFound.head.copy(onlineUsers = (onlineUsersFound.head.onlineUsers ++ List(new ObjectId(userIdkey)))), false, false, new WriteConcern)
        }
    }

  }

  /**
   * List Of All Online Users (V)
   */
  def returnOnlineUsers = {
    /* Cache.get("Online Users")*/
    OnlineUserDAO.find(MongoDBObject()).toList
  }

}

object OnlineUserDAO extends SalatDAO[OnlineUsers, ObjectId](collection = MongoHQConfig.mongoDB("onlineusers"))
package utils

import com.novus.salat.dao.SalatDAO
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.WriteConcern
import models.mongoContext._
import java.util.Calendar

case class OnlineUsers(onlineUsers: scala.collection.mutable.Map[String, Long] = scala.collection.mutable.Map())
object OnlineUserCache {

  /*var onlineUsers: List[String] = Nil*/

  /**
   * Deactivate The User Session
   */

  def setOffline(userIdkey: String): Any = {
    /* onlineUsers filterNot (List(userIdkey)contains)
        Cache.set("Online Users", onlineUsers)*/
    val onlineUsersFound = OnlineUserDAO.find(MongoDBObject()).toList
    (onlineUsersFound.isEmpty) match {
      case true =>
      case false =>
        //        if (onlineUsersFound.head.onlineUsers.contains(userIdkey)) {
        OnlineUserDAO.update(MongoDBObject(), onlineUsersFound.head.copy(onlineUsers = (onlineUsersFound.head.onlineUsers -= userIdkey)), false, false, new WriteConcern)
      //        }
    }

  }

  /**
   * Activate The User Session (V)
   */

  def setOnline(userIdkey: String, timeStamp: Long): Object = {
    /*if (onlineUsers.contains(userIdkey) == false) {
          onlineUsers ++= List(userIdkey)
          Cache.set("Online Users", onlineUsers)
        }*/
    val onlineUsersFound = OnlineUserDAO.find(MongoDBObject()).toList
    (onlineUsersFound.isEmpty) match {

      case true => OnlineUserDAO.insert(OnlineUsers(scala.collection.mutable.Map(userIdkey -> timeStamp)))
      case false =>
        //        if (!onlineUsersFound.head.onlineUsers.contains(new ObjectId(userIdkey))) {
        OnlineUserDAO.update(MongoDBObject(), onlineUsersFound.head.copy(onlineUsers = (onlineUsersFound.head.onlineUsers += userIdkey -> timeStamp)), false, false, new WriteConcern)
      //        }
    }

  }

  /**
   * List Of All Online Users (V)
   */
  def returnOnlineUsers: List[utils.OnlineUsers] = {
    /* Cache.get("Online Users")*/
    OnlineUserDAO.find(MongoDBObject()).toList
  }

  /**
   * return current time
   */
  def returnUTCTime: Long = {
    val c = Calendar.getInstance
    val utcOffset: Int = c.get(Calendar.ZONE_OFFSET) + c.get(Calendar.DST_OFFSET);
    c.getTimeInMillis() + utcOffset;
  }

}

object OnlineUserDAO extends SalatDAO[OnlineUsers, ObjectId](collection = MongoHQConfig.mongoDB("onlineusers"))

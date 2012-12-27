package utils

import play.api.cache.Cache
import play.api.Play.current
object onlineUserCache {

  var onlineUser: List[String] = List()

  /**
   * Activate The User Session
   */

  def setOffline(userIdkey: String) = {
    onlineUser --= List(userIdkey)
    Cache.set("Online Users", onlineUser)
    onlineUser.length
  }

  /**
   * Deactivate The User Session
   */

  def setOnline(userIdkey: String): Int = {
    if (onlineUser.contains(userIdkey) == false) {
      onlineUser ++= List(userIdkey)
      Cache.set("Online Users", onlineUser)
    }
    onlineUser.length
  }

  /**
   * List Of All Online Users
   */
  def returnOnlineUsers = {
    Cache.get("Online Users")
  }

}
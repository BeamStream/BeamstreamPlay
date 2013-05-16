package utils

import play.api.cache.Cache
import play.api.Play.current
object onlineUserCache {

 //TODO : Check Again

  var onlineUsers: List[String] = Nil

  /**
   * Activate The User Session
   */

  def setOffline(userIdkey: String) = {
    onlineUsers filterNot (List(userIdkey)contains)
    Cache.set("Online Users", onlineUsers)
    println(">>>>>> Set offlihne >>>>>>" + returnOnlineUsers)
  }

  /**
   * Deactivate The User Session
   */

  def setOnline(userIdkey: String) = {
    if (onlineUsers.contains(userIdkey) == false) {
      onlineUsers ++= List(userIdkey)
      Cache.set("Online Users", onlineUsers)
    }
    println(">>>>>> Set Online >>>>>>" + returnOnlineUsers)

  }

  /**
   * List Of All Online Users
   */
  def returnOnlineUsers = {
    Cache.get("Online Users")
  }

}
package utils

import play.api.cache.Cache
import play.api.Play.current
object onlineUserCache {
  println(">>>>>>>>>>>>>>>>>>>>>>>>>>>."+returnOnlineUsers)
  var onlineUsers: List[String] = Nil

  /**
   * Activate The User Session
   */

  def setOffline(userIdkey: String):Int = {
    onlineUsers filterNot (List(userIdkey)contains)
    Cache.set("Online Users", onlineUsers)
     println(">>>>>> Set offlihne >>>>>>"+ returnOnlineUsers)
    onlineUsers.length
  }

  /**
   * Deactivate The User Session
   */

  def setOnline(userIdkey: String): Int = {
    if (onlineUsers.contains(userIdkey) == false) {
      onlineUsers ++= List(userIdkey)
      Cache.set("Online Users", onlineUsers)
    }
    println(">>>>>> Set Online >>>>>>"+ returnOnlineUsers)
    onlineUsers.length
  }

  /**
   * List Of All Online Users
   */
  def returnOnlineUsers = {
    Cache.get("Online Users")
  }

}
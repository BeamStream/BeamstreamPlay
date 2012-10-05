package models

import org.bson.types.ObjectId
import play.api.cache.Cache
import play.api.Play.current

object ProfileImageProviderCache {

  var profileImageMap = Map[String, String]()
  def getImage(userIdkey: String): String = profileImageMap.get(userIdkey).get
  def setImage(userIdkey: String, mediaUrl: String) = profileImageMap += userIdkey -> mediaUrl

}

object onlineUserCache {

  var onlineUser: List[String] = List()

  def setOffline(userIdkey: String) : Int={
    onlineUser --= List(userIdkey)
    Cache.set("Online Users", onlineUser)
    onlineUser.length

  }
  def setOnline(userIdkey: String): Int= {
    onlineUser ++= List(userIdkey)
    Cache.set("Online Users", onlineUser)
    onlineUser.length
  }

}




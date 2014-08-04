package models

import org.bson.types.ObjectId

object ProfileImageProviderCache {

  var profileImageMap = Map[String, String]()
  def getImage(userIdkey: String): String = profileImageMap.get(userIdkey).get
  def setImage(userIdkey: String, mediaUrl: String): Unit = profileImageMap += userIdkey -> mediaUrl

}


package models
import org.bson.types.ObjectId

object ProfileImageProviderCache {

  var profileImageMap = Map[ObjectId, String]()

  def getImage(userIdkey: ObjectId): String = profileImageMap.get(userIdkey).get
  def setImage(userIdkey: ObjectId, mediaUrl: String) = profileImageMap += userIdkey -> mediaUrl

}
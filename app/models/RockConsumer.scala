package models

import org.bson.types.ObjectId

//For Rocking Doc Or Media
trait RockConsumer {
  def rockTheMediaOrDoc(idToBeRocked: ObjectId, userId: ObjectId)
  def commentTheMediaOrDoc(id: ObjectId, commentId: ObjectId)
}

object RockDocOrMedia {
  /**
   * Rock Document Or Media
   */
  def rockDocOrMedia(id: ObjectId, userId: ObjectId) {
    val consumers: List[RockConsumer] = List(Document, UserMedia)
    consumers.map(_.rockTheMediaOrDoc(id, userId))
  }

  /**
   * Comment Document Or Media
   */
  def commentDocOrMedia(id: ObjectId, commentId: ObjectId) {
    val consumers: List[RockConsumer] = List(Document, UserMedia)
    consumers.map(_.commentTheMediaOrDoc(id, commentId))
  }
}

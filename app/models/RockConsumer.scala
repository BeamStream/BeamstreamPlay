package models
import org.bson.types.ObjectId

//For Rocking Doc Or Media
trait RockConsumer {
 def rockTheMediaOrDoc(idToBeRocked: ObjectId, userId: ObjectId)
}

object RockDocOrMedia {
    def rockDocOrMedia(id: ObjectId, userId: ObjectId) {
      val consumers: List[RockConsumer] = List(Document, UserMedia)
      consumers.map(_.rockTheMediaOrDoc(id, userId))
    }
  }
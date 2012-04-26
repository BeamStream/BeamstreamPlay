package utils
import com.mongodb.casbah.MongoConnection

object MongoHQConfig {
  
  val mongoDB = MongoConnection()("beamstream2")
//  mongoDB.authenticate("neel", "neel")
}
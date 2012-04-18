package utils
import com.mongodb.casbah.MongoConnection

object MongoHQConfig {
  
  val mongoDB = MongoConnection("Flame.mongohq.com",27091)("beamstream2")
  mongoDB.authenticate("neel", "neel")
}
package utils
import com.mongodb.casbah.MongoConnection

object MongoHQConfig {
  
  val mongoDB = MongoConnection()("beamstream")

  
  
   
// val mongoDB = MongoConnection("staff.mongohq.com",10055)("beamstream-v3")
// mongoDB.authenticate("neel", "neel")
}
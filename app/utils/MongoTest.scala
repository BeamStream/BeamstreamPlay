package utils

import com.mongodb.casbah.Imports._

object MongoTest extends App {

  connectToMongo

 def connectToMongo {
    val mongoConn = MongoConnection()
    val mongoColl = mongoConn("test")("vikas")
    val bread1 = MongoDBObject("name" -> "parrys",
      "price" -> "10 INR")
    val bread2 = MongoDBObject("name" -> "breadAndMore")
    mongoColl += bread1
    mongoColl += bread2
    mongoColl.find()

    for { x <- mongoColl } yield println("value "+ x)
  }

}
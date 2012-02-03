package utils

import com.mongodb.casbah.Imports._

object MongoTest extends App {

  connectToMongo

  def connectToMongo {
    val mongoConn = MongoConnection()
    val mongoColl = mongoConn("test")("vikas")
    val user1 = MongoDBObject("user" -> "bwmcadams",
      "email" -> "~~brendan~~<AT>10genDOTcom")
    val user2 = MongoDBObject("user" -> "someOtherUser")
    mongoColl += user1
    mongoColl += user2
    mongoColl.find()

    for { x <- mongoColl } yield println("value "+ x)
    /* Iterable[com.mongodb.DBObject] = List(
    { "_id" : { "$oid" : "4c3e2bec521142c87cc10fff"} ,
      "user" : "bwmcadams" ,
      "email" : "~~brendan~~<AT>10genDOTcom"},
     { "_id" : { "$oid" : "4c3e2bec521142c87dc10fff"} ,
      "user" : "someOtherUser"}
 ) */

  }

}
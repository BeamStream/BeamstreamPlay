package OtherTests
import com.mongodb.Mongo
import com.mongodb.casbah.MongoConnection
import java.net.URI

/**
 * Connects to MongoHQ using Casbah
 */
object MongoHQConnectorTest extends App {

  // hostname, port and database
  val mongoDB = MongoConnection("staff.mongohq.com", 10054)("beamstream")
  mongoDB.authenticate("beamstream", "beamstream")
  // collection name
  val mongoConnection = mongoDB("test")

  // Iterate and print the collection elements
  mongoConnection foreach {
    testElement => println("Printing the value fetched from MongoHQ [" + testElement + "]")
  }

}
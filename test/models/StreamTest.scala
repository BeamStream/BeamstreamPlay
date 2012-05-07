package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId

@RunWith(classOf[JUnitRunner])
class StreamTest extends FunSuite with BeforeAndAfter {

  var stream1 = Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(),true)
  val stream2 = Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(),true)
  val stream3 = Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(),true)
  val stream4 = Stream(new ObjectId, "al1pha", StreamType.Class, new ObjectId, List(),true)

  before {

    Stream.createStream(stream1)
    Stream.createStream(stream2)
    Stream.createStream(stream3)
    Stream.createStream(stream4)

  }

  test("Fetch matching stream names") {
    val streams = Stream.getStreamByName("al1p")
    assert(streams.size === 4)
  }


  

  

  after {
   StreamDAO.remove(MongoDBObject("name" -> ".*".r))
  }

}
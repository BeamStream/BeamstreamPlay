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

  var stream1 = Stream(new ObjectId, "al1pha", StreamType.Class, 199, List(),true)
  val stream2 = Stream(new ObjectId, "al1pha", StreamType.Class, 299, List(),true)
  val stream3 = Stream(new ObjectId, "al1pha", StreamType.Class, 399, List(),true)
  val stream4 = Stream(new ObjectId, "al1pha", StreamType.Class, 499, List(),true)

  before {

    Stream.createStream(stream1)
    Stream.createStream(stream2)
    Stream.createStream(stream3)
    Stream.createStream(stream4)

  }

  test("Fetch matching stream names") {
    val streams = Stream.getStreamByName("al1p")
    assert(streams.size === 4)

    val l = streams filter (_.creator == 199)
    assert(l.size === 1)

    val listOfCreators = for (stream <- streams) yield stream.creator
    assert(listOfCreators.contains(199))
  }

//  test("Validating the stream join") {
//    Stream.joinStream(100, 900)
//    val stream = StreamDAO.findOneByID(id = 100)
//    stream1 = stream.get
//    assert(stream.get.users.size === 1)
//  }
  

  

  after {
   StreamDAO.remove(MongoDBObject("name" -> ".*".r))
  }

}
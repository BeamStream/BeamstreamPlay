package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject

@RunWith(classOf[JUnitRunner])
class StreamTest extends FunSuite with BeforeAndAfter {

  var stream1 = Stream(100, "al1pha", StreamType.Class, "vikas", List())
  val stream2 = Stream(101, "al1pha", StreamType.Class, "meetu", List())
  val stream3 = Stream(102, "al1pha", StreamType.Class, "neel", List())
  val stream4 = Stream(103, "al1pha", StreamType.Class, "cee", List())

  before {

    Stream.createStream(stream1)
    Stream.createStream(stream2)
    Stream.createStream(stream3)
    Stream.createStream(stream4)

  }

  test("Fetch matching stream names") {
    val streams = Stream.getStreamByName("al1p")
    assert(streams.size === 4)

    val l = streams filter (_.creator == "neel")
    assert(l.size === 1)

    val listOfCreators = for (stream <- streams) yield stream.creator
    assert(listOfCreators.contains("neel"))
  }

  test("Validating the stream join") {
    Stream.joinStream(100, 900)
    val stream = StreamDAO.findOneByID(id = 100)
    stream1 = stream.get
    assert(stream.get.users.size === 1)
  }

  after {
    StreamDAO.remove(stream1)
    StreamDAO.remove(stream2)
    StreamDAO.remove(stream3)
    StreamDAO.remove(stream4)
  }

}
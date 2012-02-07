package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject

@RunWith(classOf[JUnitRunner])
class StreamTest extends FunSuite with BeforeAndAfter {
  val stream1 = Stream(100, "al1pha", "class", "vikas")
  val stream2 = Stream(101, "al1pha", "class2", "meetu")
  val stream3 = Stream(102, "al1pha", "class3", "neel")
  val stream4 = Stream(103, "al1pha", "class423232323", "cee")

  before {

    Stream.createStream(stream1)
    Stream.createStream(stream2)
    Stream.createStream(stream3)
    Stream.createStream(stream4)

  }

  test("Fetch matching stream names") {
    val streams = Stream.getStreamByName("al1p")
    assert(streams.size === 5)

    val l = streams filter (_.creator == "neel")
    assert(l.size === 1)

    val listOfCreators = for (stream <- streams) yield stream.creator
    assert(listOfCreators.contains("neel"))
  }

  test("Fetch1 matching stream names") {
    Stream.getStreamByName("alpha").foreach {
      x =>
      //println(x)
    }
  }

  after {
    StreamDAO.remove(stream1)
    StreamDAO.remove(stream2)
    StreamDAO.remove(stream3)
    StreamDAO.remove(stream4)
  }

}
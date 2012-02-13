package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject

@RunWith(classOf[JUnitRunner])
class SmallStreamTest extends FunSuite with BeforeAndAfter {

  val stream1 = Stream(100, "al1pha", StreamType.Class, 199, List())

  before {
    StreamDAO.insert(stream1)
  }

  test("Insert and retrieve a stream") {

    val streams = StreamDAO.find(MongoDBObject("name" -> ".*".r))
    assert(streams.size === 1)

  }

  after {
     StreamDAO.remove(MongoDBObject("name" -> ".*".r))
  }

}
package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId

@RunWith(classOf[JUnitRunner])
class ScenarioTest extends FunSuite with BeforeAndAfter {

  val chris = User(new ObjectId,UserType.Professional,"u@u.com","Neel" ,"Sachdeva" ,"","Neil","Neel","Knoldus","",List(),List(),List(),List(),List())
  val vikas = User(new ObjectId,UserType.Professional,"u1@u1.com","Vikas" ,"Hazrati" ,"","Vikki","Vikas","Knoldus","",List(),List(),List(),List(),List())
  val meetu = User(new ObjectId,UserType.Professional,"u1@u1.com","Meetu" ,"Maltiar" ,"","Meet","Meetu","Inphina","",List(),List(),List(),List(),List())


  before {
    User.createUser(chris)
    User.createUser(vikas)
    User.createUser(meetu)
  }

  test("Scenario to test the flow") {

    /* user chris creates a new stream*/
    Stream.createStream(Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(new ObjectId),true,List()))
    Stream.createStream(Stream(new ObjectId, "Inphina stream", StreamType.Research, new ObjectId, List(new ObjectId),true,List()))

    /* vikas hunts for a stream to join*/
    val stream = Stream.getStreamByName("Bea")
    assert(stream.size === 1)
    assert(stream(0).streamName === "Beamstream stream")

    /*vikas joins this stream */
    Stream.joinStream(stream(0).id, new ObjectId)

    /*total number of users on the stream must be 2*/
    assert(Stream.getStreamByName("Beam")(0).usersOfStream.size === 2)
    
  
    
    


  }

  after {
    StreamDAO.remove(MongoDBObject("name" -> ".*".r))
    MessageDAO.remove(MongoDBObject("text" -> ".*".r))
    User.removeUser(chris)
    User.removeUser(vikas)
    User.removeUser(meetu)
  }

}
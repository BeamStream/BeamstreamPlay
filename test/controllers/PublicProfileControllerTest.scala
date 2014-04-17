package controllers

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.UserMediaDAO
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import org.scalatest.junit.JUnitRunner
import models.UserDAO
import play.api.test.FakeRequest
import play.api.test.Helpers._
import play.api.libs.concurrent.Execution.Implicits._
import models.MessageDAO
import models.Message
import org.bson.types.ObjectId
import models.Type
import models.Access
import java.text.DateFormat
import java.util.Date
import models.StreamType
import models.User
import models.UserType
import models.Stream
import models.Document
import models.DocType
import models.DocumentDAO

@RunWith(classOf[JUnitRunner])
class PublicProfileControllerTest extends FunSuite with BeforeAndAfter {
  
  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
  
  before {
    running(FakeApplication()) {
      MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
      UserDAO.remove(MongoDBObject("name" -> ".*".r))
      DocumentDAO.remove(MongoDBObject("documentName" -> ".*".r))
    }
  }

  test("Render Public profile page") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/renderProfilePage")).get
      result onComplete {
        case stat => assert(stat.isSuccess === true)
      }
    }
  }
  
  test("Get all Public Messages for a User") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId.get, List(), true, List())
      val streamId = Stream.createStream(stream)
      val message = Message(new ObjectId, "some message", Option(Type.Audio), Option(Access.Public), formatter.parse("23-07-12"), user.id, Option(stream.id), "", "", 0, Nil, Nil, 0, Nil)
      val messageId = Message.createMessage(message)
      val result = route(FakeRequest(GET, "/publicMessages/user/"+userId.get.toString())).get
      result onComplete {
        case stat => assert(stat.isSuccess === true)
      }
    }
  }

  test("Get all Public Documents for a User") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToCreate = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.Public, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val result = route(FakeRequest(GET, "/publicDocuments/user/"+userId.get.toString())).get
      result onComplete {
        case stat => assert(stat.isSuccess === true)
      }
    }
  }
  
  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("name" -> ".*".r))
      MessageDAO.remove(MongoDBObject("messageBody" -> ".*".r))
      DocumentDAO.remove(MongoDBObject("documentName" -> ".*".r))
    }
  }

}
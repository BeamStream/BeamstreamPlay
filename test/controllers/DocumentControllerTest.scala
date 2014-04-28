package controllers

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.DocumentDAO
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import org.scalatest.junit.JUnitRunner
import models.Document
import models.User
import org.bson.types.ObjectId
import models.UserType
import models.DocType
import models.Access
import java.util.Date
import play.api.test.FakeRequest
import play.api.test.Helpers._
import models.UserDAO
import models.StreamDAO
import models.StreamType
import models.Stream
import play.api.libs.json.JsValue

@RunWith(classOf[JUnitRunner])
class DocumentControllerTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      DocumentDAO.remove(MongoDBObject("documentName" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
    }
  }

  test("Get All Files Of A User") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val secondDocumentToCreate = Document(new ObjectId, "Neel'sFile.mp3", "Neel'sFile", "http://neel.ly/Neel'sFile.mp3", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val thirdDocumentToCreate = Document(new ObjectId, "Neel'sFile.mp4", "Neel'sFile", "http://neel.ly/Neel'sFile.mp4", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      Document.addDocument(firstDocumentToCreate)
      Document.addDocument(secondDocumentToCreate)
      Document.addDocument(thirdDocumentToCreate)
      val result = route(FakeRequest(GET, "/AllFilesForAUser").withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Get All Audio Files") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val secondDocumentToCreate = Document(new ObjectId, "Neel'sFile.mp3", "Neel'sFile", "http://neel.ly/Neel'sFile.mp3", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val thirdDocumentToCreate = Document(new ObjectId, "Neel'sFile.mp4", "Neel'sFile", "http://neel.ly/Neel'sFile.mp4", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      Document.addDocument(firstDocumentToCreate)
      Document.addDocument(secondDocumentToCreate)
      Document.addDocument(thirdDocumentToCreate)
      val result = route(FakeRequest(GET, "/audioFilesOfAUser").withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Get All PDF Files") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val secondDocumentToCreate = new Document(new ObjectId, "Neel'sFile.mp3", "Neel'sFile", "http://neel.ly/Neel'sFile.mp3", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      Document.addDocument(firstDocumentToCreate)
      Document.addDocument(secondDocumentToCreate)
      val result = route(FakeRequest(GET, "/allPDFFilesForAUser").withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Get All PPT Files") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.ppt", "Neel'sFile", "http://neel.ly/Neel'sFile.ppt", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val secondDocumentToCreate = new Document(new ObjectId, "Neel'sFile.mp3", "Neel'sFile", "http://neel.ly/Neel'sFile.mp3", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      Document.addDocument(firstDocumentToCreate)
      Document.addDocument(secondDocumentToCreate)
      val result = route(FakeRequest(GET, "/allPPTFilesForAUser").withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Get All Docs File") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val secondDocumentToCreate = new Document(new ObjectId, "Neel'sFile.mp3", "Neel'sFile", "http://neel.ly/Neel'sFile.mp3", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      Document.addDocument(firstDocumentToCreate)
      Document.addDocument(secondDocumentToCreate)
      val result = route(FakeRequest(GET, "/allDOCSFilesForAUser").withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Get All Google Docs for a User") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.GoogleDocs, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val secondDocumentToCreate = new Document(new ObjectId, "Neel'sFile.mp3", "Neel'sFile", "http://neel.ly/Neel'sFile.mp3", DocType.GoogleDocs, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      Document.addDocument(firstDocumentToCreate)
      Document.addDocument(secondDocumentToCreate)
      val result = route(FakeRequest(GET, "/getAllGoogleDocs").withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Follow The Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val documentId = Document.addDocument(firstDocumentToCreate)
      val result = route(FakeRequest(PUT, "/follow/document/" + documentId.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)

    }
  }

  test("Rock The Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val documentId = Document.addDocument(firstDocumentToCreate)
      val result = route(FakeRequest(PUT, "/rock/document/" + documentId.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)

    }
  }

  test("View Count of a Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val documentId = Document.addDocument(firstDocumentToCreate)
      val result1 = route(FakeRequest(PUT, "/viewCountOf/document/" + documentId.toString).withSession("userId" -> userId.get.toString))
      assert(status(result1.get) === 200)
      val result2 = route(FakeRequest(PUT, "/viewCountOf/document/" + documentId.toString).withSession("userId" -> userId.get.toString))
      assert(status(result2.get) === 200)

    }
  }

  test("New Google Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val result = route(FakeRequest(POST, "/newGoogleDocument").withFormUrlEncodedBody("streamId" -> "53478c1bc4aad844bfb5a542", "docName" -> "Untitled document", "description" -> "                ", "docUrl" -> "https://docs.google.com/a/knoldus.com/document/d/1GElqfup4LngRqK_t-TaCbD6J1Psa6V1GhQSnl1f_Zv8/edit?usp=drivesdk").withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 303)

    }
  }

  /**
   * TODO testing after getting JSON output of Changing Title & Description of Document
   */
  test("Change Title & Description of a Document") {
    running(FakeApplication()) {
      val jsonString = """{"docDescription": "Good","docName": "Neel's file"}"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonString)
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val documentId = Document.addDocument(firstDocumentToCreate)
      val result = route(FakeRequest(PUT, "/document/" + documentId).withJsonBody(json)).get
      assert(status(result) === 200)
    }
  }

  /*test("Rockers of a Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, List(userId.get), Nil, Nil, "")
      val documentId = Document.addDocument(firstDocumentToCreate)
      val result = route(FakeRequest(PUT, "/rockersOf/document/" + documentId.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)

    }
  }*/
  
  /**
   * TODO testing after getting JSON output of Uploading Doc from Disk
   */
  test("Upload Document from Disk") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId.get, List(), true, List())
      val streamId = Stream.createStream(stream)
      val result = route(FakeRequest(POST, "/uploadDocumentFromDisk").withSession("userId" -> userId.get.toString).withFormUrlEncodedBody("docAccess" -> "Public", "streamId" -> streamId.get.toString(), "docDescription" -> "", "uploadedFrom" -> "discussion")).get
      assert(status(result) === 500)
    }
  }

  after {
    running(FakeApplication()) {
      DocumentDAO.remove(MongoDBObject("documentName" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
    }
  }

}
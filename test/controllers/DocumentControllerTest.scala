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

@RunWith(classOf[JUnitRunner])
class DocumentControllerTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      DocumentDAO.remove(MongoDBObject("documentName" -> ".*".r))
    }
  }

  test("Get All Files Of A User") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
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
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
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
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
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
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
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
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
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
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
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
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val documentId = Document.addDocument(firstDocumentToCreate)
      val result = route(FakeRequest(PUT, "/follow/document/" + documentId.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)

    }
  }

  test("Rock The Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val documentId = Document.addDocument(firstDocumentToCreate)
      val result = route(FakeRequest(PUT, "/rock/document/" + documentId.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)

    }
  }
  
  test("View Count of a Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val documentId = Document.addDocument(firstDocumentToCreate)
      val result = route(FakeRequest(PUT, "/viewCountOf/document/" + documentId.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)

    }
  }
  
  test("New Google Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val documentId = Document.addDocument(firstDocumentToCreate)
      val result = route(FakeRequest(PUT, "/viewCountOf/document/" + documentId.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)

    }
  }
  
  /*test("Rockers of a Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val documentId = Document.addDocument(firstDocumentToCreate)
      val result = route(FakeRequest(PUT, "/rockersOf/document/" + documentId.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)

    }
  }*/
  
  after {
    running(FakeApplication()) {
      DocumentDAO.remove(MongoDBObject("documentName" -> ".*".r))
    }
  }

}
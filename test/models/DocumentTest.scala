package models

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import java.text.DateFormat
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject
import play.api.test.Helpers.running
import play.api.test.FakeApplication
import play.api.test.Helpers.running
import java.util.Date

@RunWith(classOf[JUnitRunner])
class DocumentTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      DocumentDAO.remove(MongoDBObject("documentName" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
    }
  }

  test("Add Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToCreate = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val docsBefore = DocumentDAO.find(MongoDBObject())
      assert(docsBefore.size === 0)
      Document.addDocument(docToCreate)
      val docsAfter = DocumentDAO.find(MongoDBObject())
      assert(docsAfter.size === 1)
    }
  }

  test("Delete Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToDelete = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      Document.addDocument(docToDelete)
      val docsBefore = DocumentDAO.find(MongoDBObject())
      assert(docsBefore.size === 1)
      Document.removeDocument(docToDelete)
      val docsAfter = DocumentDAO.find(MongoDBObject())
      assert(docsAfter.size === 0)
    }
  }

  test("Rock the Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToRock = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val docId = Document.addDocument(docToRock)
      assert(Document.rockTheDocument(docId, userId.get) === 1)
      assert(Document.rockTheDocument(docId, userId.get) === 0)
    }
  }

  test("Document's Rockers Names") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docRocked = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 1, List(userId.get), Nil, Nil, "")
      val docId = Document.addDocument(docRocked)
      assert(Document.rockersNames(docId).size === 1)
    }
  }

  test("Get all Google Documents of a User") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToFetch = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.GoogleDocs, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val docId = Document.addDocument(docToFetch)
      assert(Document.getAllGoogleDocumentsForAUser(userId.get).size === 1)
      assert(Document.getAllGoogleDocumentsForAUser(userId.get)(0).userId === userId.get)
    }
  }

  test("Get all Public Documents of a User") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToCheck = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.Public, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val docId = Document.addDocument(docToCheck)
      assert(Document.getAllPublicDocumentForAUser(userId.get).size === 1)
      assert(Document.getAllPublicDocumentForAUser(userId.get)(0).userId === userId.get)
    }
  }

  test("Update Title and Descriptipon of a Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToUpdate = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.Public, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val docId = Document.addDocument(docToUpdate)
      Document.updateTitleAndDescription(docId, "Himanshu'sFile.jpg", "Himanshu'sFile")
      assert(DocumentDAO.findOneById(docId).get.documentName === "Himanshu'sFile.jpg")
      assert(DocumentDAO.findOneById(docId).get.documentDescription === "Himanshu'sFile")
    }
  }

  test("Update Preview Image Url of a Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToUpdate = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.Public, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val docId = Document.addDocument(docToUpdate)      
      assert(Document.updatePreviewImageUrl("Neel'sFile.jpg", "http://himanshu.ly/Himanshu'sFile.jpg") === docId)
      assert(Document.updatePreviewImageUrl("NeelFile.jpg", "http://himanshu.ly/Himanshu'sFile.jpg") !== docId)
    }
  }

  test("Add Comment to a Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToUpdate = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.Public, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val docId = Document.addDocument(docToUpdate)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, List(userId.get), streamId.get)
      val commentId = Comment.createComment(comment)
      Document.addCommentToDocument(commentId.get, docId)
      assert(DocumentDAO.findOneById(docId).get.commentsOnDocument.size === 1)
    }
  }
  
  test("Follow the Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToFollow = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val docId = Document.addDocument(docToFollow)
      assert(Document.followDocument(userId.get, docId) === 1)
      assert(Document.followDocument(userId.get, docId) === 0)
    }
  }
  
  test("Increase View Count of a Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToView = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val docId = Document.addDocument(docToView)
      assert(Document.increaseViewCountOfADocument(docId) === 1)
    }
  }
  
  test("Recent Document of a User") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToFind = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val docId = Document.addDocument(docToFind)
      assert(Document.recentDocForAUser(new ObjectId) === None)
      assert(Document.recentDocForAUser(userId.get).get.userId === userId.get)
    }
  }
  
  test("Recent Google Document of a User") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToFind = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.GoogleDocs, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val docId = Document.addDocument(docToFind)
      assert(Document.recentGoogleDocsForAUser(new ObjectId) === None)
      assert(Document.recentGoogleDocsForAUser(userId.get).get.userId === userId.get)
    }
  }
  
  test("Search a Document by Username") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToFind = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val docId = Document.addDocument(docToFind)
      assert(Document.searchDocumentForAUserByName(userId.get, "Neel's").size === 1)
    }
  }
  
  test("Rock the Media or Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToRock = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val docId = Document.addDocument(docToRock)
      Document.rockTheMediaOrDoc(docId, userId.get)
      assert(DocumentDAO.findOneById(docId).get.documentRocks === 1)
    }
  }
  
  test("Comment on the Media or Document") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val docToRock = Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId.get, Access.PrivateToClass, new ObjectId, new Date, new Date, 0, Nil, Nil, Nil, "")
      val docId = Document.addDocument(docToRock)
      val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, new ObjectId, List(userId.get), true, Nil)
      val streamId = Stream.createStream(stream)
      val comment = Comment(new ObjectId, "Comment1", new Date, userId.get, user.firstName, user.lastName, 0, List(userId.get), streamId.get)
      val commentId = Comment.createComment(comment)
      Document.commentTheMediaOrDoc(docId, commentId.get)
      assert(DocumentDAO.findOneById(docId).get.commentsOnDocument.size === 1)
    }
  }
  
  /*test("Find Class By Name") {

    running(FakeApplication()) {
      val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), Nil)
      val userId = User.createUser(user)
      assert(Class.getAllClassesIdsForAUser(userId.get).size === 0)
      Class.createClass(classToBeCretaed, userId.get)
      assert(Class.findClasssById(classToBeCretaed.id).size === 1)
      assert(Class.findClasssById(classToBeCretaed.id).get.className === "IT")
      val classesFound = Class.findClassByName("IT", new ObjectId("47cc67093475061e3d95369d"))
      assert(classesFound.size === 1)
      val classesNotFound = Class.findClassByName("CSE", new ObjectId("47cc67093475061e3d95369d"))
      assert(classesNotFound.size === 0)
    }
  }

  test("Find Class By Code") {
    running(FakeApplication()) {
      val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), Nil)
      val userId = User.createUser(user)
      assert(Class.getAllClassesIdsForAUser(userId.get).size === 0)
      Class.createClass(classToBeCretaed, userId.get)
      assert(Class.findClasssById(classToBeCretaed.id).size === 1)
      assert(Class.findClasssById(classToBeCretaed.id).get.className === "IT")
      val classesFound = Class.findClassByCode("201", new ObjectId("47cc67093475061e3d95369d"))
      assert(classesFound.size === 1)
      val classesNotFound = Class.findClassByCode("301", new ObjectId("47cc67093475061e3d95369d"))
      assert(classesNotFound.size === 0)
    }
  }

  test("find class by time") {
    running(FakeApplication()) {
      val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), Nil)
      val userId = User.createUser(user)
      assert(Class.getAllClassesIdsForAUser(userId.get).size === 0)
      Class.createClass(classToBeCretaed, userId.get)
      assert(Class.findClasssById(classToBeCretaed.id).size === 1)
      assert(Class.findClasssById(classToBeCretaed.id).get.className === "IT")
      val classesFound = Class.findClassByTime("3:30")
      assert(classesFound.size === 1)
    }
  }

  test("find class by Id") {
    running(FakeApplication()) {
      val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), Nil)
      val userId = User.createUser(user)
      assert(Class.getAllClassesIdsForAUser(userId.get).size === 0)
      Class.createClass(classToBeCretaed, userId.get)
      assert(Class.findClasssById(classToBeCretaed.id).size === 1)
      assert(Class.findClasssById(classToBeCretaed.id).get.className === "IT")
      val classesFound = Class.findClasssById(classToBeCretaed.id)
      assert(classesFound.size === 1)
    }
  }
  test("Remove Class") {
    running(FakeApplication()) {
      val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), Nil)
      val userId = User.createUser(user)
      assert(Class.getAllClassesIdsForAUser(userId.get).size === 0)
      Class.createClass(classToBeCretaed, userId.get)
      assert(Class.findClasssById(classToBeCretaed.id).size === 1)
      assert(Class.findClasssById(classToBeCretaed.id).get.className === "IT")
      val classFound = Class.findClasssById(classToBeCretaed.id)
      Class.deleteClass(classFound.get)
      assert(Class.findClasssById(classToBeCretaed.id) === None)
    }
  }

  test("Find All Classes Of A User") {
    running(FakeApplication()) {
      val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), Nil)
      val userId = User.createUser(user)
      assert(Class.getAllClassesIdsForAUser(userId.get).size === 0)
      Class.createClass(classToBeCretaed, userId.get)
      assert(Class.findClasssById(classToBeCretaed.id).size === 1)
      assert(Class.getAllClassesForAUser(userId.get).size === 1)
    }
  }

  test("Get All Classes") {
    running(FakeApplication()) {
      val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), Nil)
      val userId = User.createUser(user)
      Class.createClass(classToBeCretaed, userId.get)
      val classes = Class.getAllClasses(List(classToBeCretaed.id))
      assert(classes.head.classCode === "201")
    }
  }
*/
  after {
    running(FakeApplication()) {
      DocumentDAO.remove(MongoDBObject("documentName" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
    }
  }
}
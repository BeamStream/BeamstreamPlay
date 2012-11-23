package models
import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject
import java.util.Date

@RunWith(classOf[JUnitRunner])
class FilesTest extends FunSuite with BeforeAndAfter {

  before {

  }

  test("Get All Audio Files") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", "", List(), List(), List(), List(), List(), List())
    val userId = User.createUser(user)
    val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.jpg", "Neel'sFile", "http://neel.ly/Neel'sFile.jpg", DocType.Other, userId, DocumentAccess.Private, new ObjectId, new Date, new Date, 0, List(), List(), List(), "")
    val secondDocumentToCreate = new Document(new ObjectId, "Neel'sFile.mp3", "Neel'sFile", "http://neel.ly/Neel'sFile.mp3", DocType.Other, userId, DocumentAccess.Private, new ObjectId, new Date, new Date, 0, List(), List(), List(), "")
    val thirdDocumentToCreate = new Document(new ObjectId, "Neel'sFile.mp4", "Neel'sFile", "http://neel.ly/Neel'sFile.mp4", DocType.Other, userId, DocumentAccess.Private, new ObjectId, new Date, new Date, 0, List(), List(), List(), "")
    Document.addDocument(firstDocumentToCreate)
    Document.addDocument(secondDocumentToCreate)
    Document.addDocument(thirdDocumentToCreate)

    val audioFilesObtained = Files.getAllAudioFiles(userId)
    assert(audioFilesObtained.size === 1)

    val forthDocumentToCreate = new Document(new ObjectId, "NeelKanth'sFile.mp3", "Neel'sFile", "http://neel.ly/Neel'sFile.mp3", DocType.Other, userId, DocumentAccess.Private, new ObjectId, new Date, new Date, 0, List(), List(), List(), "")
    Document.addDocument(forthDocumentToCreate)

    val audioFilesObtainedAgain = Files.getAllAudioFiles(userId)
    assert(audioFilesObtainedAgain.size === 2)

    val fifthDocumentToCreate = new Document(new ObjectId, "NeelKanth'sFile", "Neel'sFile", "http://neel.ly/Neel'sFile.ODP", DocType.Other, userId, DocumentAccess.Private, new ObjectId, new Date, new Date, 0, List(), List(), List(), "")
    val sixthDocumentToCreate = new Document(new ObjectId, "NeelKanth'sFile", "Neel'sFile", "http://neel.ly/Neel'sFile.odp", DocType.GoogleDocs, userId, DocumentAccess.Private, new ObjectId, new Date, new Date, 0, List(), List(), List(), "")
    Document.addDocument(fifthDocumentToCreate)
    Document.addDocument(sixthDocumentToCreate)

    val pptFilesObtained = Files.getAllPPTFiles(userId)
    assert(pptFilesObtained.size === 1)

  }

  test("Get All PDF Files") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", "", List(), List(), List(), List(), List(), List())
    val userId = User.createUser(user)
    val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.Other, userId, DocumentAccess.Private, new ObjectId, new Date, new Date, 0, List(), List(), List(), "")
    val secondDocumentToCreate = new Document(new ObjectId, "Neel'sFile.mp3", "Neel'sFile", "http://neel.ly/Neel'sFile.mp3", DocType.Other, userId, DocumentAccess.Private, new ObjectId, new Date, new Date, 0, List(), List(), List(), "")
    val thirdDocumentToCreate = new Document(new ObjectId, "Neel'sFile.mp4", "Neel'sFile", "http://neel.ly/Neel'sFile.mp4", DocType.Other, userId, DocumentAccess.Private, new ObjectId, new Date, new Date, 0, List(), List(), List(), "")
    Document.addDocument(firstDocumentToCreate)
    Document.addDocument(secondDocumentToCreate)
    Document.addDocument(thirdDocumentToCreate)

    val pdfFilesObtained = Files.getAllPDFFiles(userId)
    assert(pdfFilesObtained.size === 1)

    val forthDocumentToCreate = new Document(new ObjectId, "NeelKanth'sFile.PDF", "Neel'sFile", "http://neel.ly/Neel'sFile.PDF", DocType.Other, userId, DocumentAccess.Private, new ObjectId, new Date, new Date, 0, List(), List(), List(), "")
    Document.addDocument(forthDocumentToCreate)
    val pdfFilesObtainedA = Files.getAllPDFFiles(userId)
    assert(pdfFilesObtainedA.size === 2)
  }

  test("Get All Docs File") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", "", List(), List(), List(), List(), List(), List())
    val userId = User.createUser(user)
    val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.Other, userId, DocumentAccess.Private, new ObjectId, new Date, new Date, 0, List(), List(), List(), "")
    val secondDocumentToCreate = new Document(new ObjectId, "Neel'sFile.mp3", "Neel'sFile", "http://neel.ly/Neel'sFile.mp3", DocType.Other, userId, DocumentAccess.Private, new ObjectId, new Date, new Date, 0, List(), List(), List(), "")
    val thirdDocumentToCreate = new Document(new ObjectId, "Neel'sFile.mp4", "Neel'sFile", "http://neel.ly/Neel'sFile.mp4", DocType.Other, userId, DocumentAccess.Private, new ObjectId, new Date, new Date, 0, List(), List(), List(), "")
    Document.addDocument(firstDocumentToCreate)
    Document.addDocument(secondDocumentToCreate)
    Document.addDocument(thirdDocumentToCreate)

    val docsFilesObtained = Files.getAllDOCSFiles(userId)
    assert(docsFilesObtained.size === 0)

    val forthDocumentToCreate = new Document(new ObjectId, "NeelKanth'sFile.PDF", "Neel'sFile", "http://neel.ly/Neel'sFile.RTF", DocType.Other, userId, DocumentAccess.Private, new ObjectId, new Date, new Date, 0, List(), List(), List(), "")
    Document.addDocument(forthDocumentToCreate)

    val docsFilesObtainedAgain = Files.getAllDOCSFiles(userId)
    assert(docsFilesObtainedAgain.size === 1)
  }

  test("Follow The Document") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", "", List(), List(), List(), List(), List(), List())
    val userId = User.createUser(user)
    val firstDocumentToCreate = new Document(new ObjectId, "Neel'sFile.pdf", "Neel'sFile", "http://neel.ly/Neel'sFile.pdf", DocType.Other, userId, DocumentAccess.Private, new ObjectId, new Date, new Date, 0, List(), List(), List(), "")
    val documentId = Document.addDocument(firstDocumentToCreate)
    assert(Document.findDocumentById(documentId).get.documentFollwers.size === 0)
    Document.followDocument(userId, documentId)
    assert(Document.findDocumentById(documentId).get.documentFollwers.size === 1)
  }

  after {

    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))

  }
}
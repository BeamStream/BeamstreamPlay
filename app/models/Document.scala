package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import org.joda.time.DateTime
import org.bson.types.ObjectId
import utils.MongoHQConfig
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import java.util.Date
import java.net.URL

/*
 * Enumeration for the document access 
 * 
 * Private - Only available for the owner
 * Public - Available to all
 * Restricted - Available to a restricted list of users
 * Stream - Available to all the Sub-streams and current members of this stream
 */

object DocumentAccess extends Enumeration {
  type DocumentAccess = Value
  val Private = Value(0, "Private")
  val Public = Value(1, "Public")
  val Restricted = Value(2, "Restricted")
  val Stream = Value(3, "Stream")

}

/*
 * Enumeration for the document type
 */
object DocType extends Enumeration {
  type DocType = Value
  val GoogleDocs = Value(0, "GoogleDocs")
  val YoutubeVideo = Value(1, "YoutubeVideo")
  val Other = Value(3, "Other")
}

case class Document(@Key("_id") id: ObjectId,
  documentName: String,
  documentDescription: String,
  documentURL: String,
  documentType: DocType.Value,
  userId: ObjectId,
  documentAccess: DocumentAccess.Value,
  streamId: ObjectId,
  creationDate: Date,
  lastUpdateDate: Date,
  documentRocks: Int,
  documentRockers: List[ObjectId],
  commentsOnDocument: List[ObjectId])

object Document {

  /*
 * Add a document
 */
  def addDocument(document: Document, userId: ObjectId): ObjectId = {
    val documentId = DocumentDAO.insert(document)
    User.addDocumentToUser(userId, document.id)
    documentId.get
  }

  /*
   * Remove document
   */
  def removeDocument(document: Document) {
    DocumentDAO.remove(document)
  }

  /*
   * Find Document by Id
   */

  def findDocumentById(docId: ObjectId): Document = {
    val document = DocumentDAO.findOneByID(docId)
    document.get
  }

  /*
  * Names of a rockers for a document
  */
  def rockersNames(docId: ObjectId): List[String] = {
    val docRocked = DocumentDAO.find(MongoDBObject("_id" -> docId)).toList(0)
    val rockersName = User.giveMeTheRockers(docRocked.documentRockers)
    rockersName
  }

  /*
   * Get all documents for a user
   */
  def getAllDocumentsForAUser(userId: ObjectId): List[Document] = {
    val user = UserDAO.find(MongoDBObject("_id" -> userId)).toList(0)
    getAllDocuments(user.documents)
  }

  /*
   * Get all Documents List
   */

  def getAllDocuments(documentIdList: List[ObjectId]): List[Document] = {
    var documentList: List[Document] = List()

    for (documentId <- documentIdList) {
      val doc = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList
      documentList ++= doc
    }

    documentList
  }

  /*
   *  Update the Rockers List and increase the count by one 
   */

  def rockedIt(documentId: ObjectId, userId: ObjectId): Int = {

    val documentToRock = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
    documentToRock.documentRockers.contains(userId) match {
     
      case true =>
        DocumentDAO.update(MongoDBObject("_id" -> documentId), documentToRock.copy(documentRockers = (documentToRock.documentRockers -- List(userId))), false, false, new WriteConcern)
        val updatedDocument = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
        DocumentDAO.update(MongoDBObject("_id" -> documentId), updatedDocument.copy(documentRocks = (updatedDocument.documentRocks - 1)), false, false, new WriteConcern)
        val document = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
        document.documentRocks
      case false =>
        DocumentDAO.update(MongoDBObject("_id" -> documentId), documentToRock.copy(documentRockers = (documentToRock.documentRockers ++ List(userId))), false, false, new WriteConcern)
        val updatedDocument = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
        DocumentDAO.update(MongoDBObject("_id" -> documentId), updatedDocument.copy(documentRocks = (updatedDocument.documentRocks + 1)), false, false, new WriteConcern)
        val document = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
        document.documentRocks
    }
  }

  //  /*
  //   * Change the access of a document
  //   */
  //  def changeAccess(documentId: ObjectId, newAccess: DocumentAccess.Value) = {
  //    val document = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
  //    DocumentDAO.update(MongoDBObject("_id" -> documentId), document.copy(documentAccess = newAccess), false, false, new WriteConcern)
  //  }

  /*
   * Change the Title and description of a document
   */
  def updateTitleAndDescription(documentId: ObjectId, newName: String, newDescription: String) = {
    val document = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
    DocumentDAO.update(MongoDBObject("_id" -> documentId), document.copy(documentDescription = newDescription,documentName = newName), false, false, new WriteConcern)
  }

  //  /*
  //   * Total number of rocks for a particular document
  //   */
  //  def totalRocks(documentId: ObjectId): Int = {
  //    val document = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
  //    document.documentRocks
  //  }

  /**
   * Documents for a user sorted by creation date
   */

  def getAllDocumentsForAUserSortedbyDate(userId: ObjectId): List[Document] = {
    val docs = getAllDocumentsForAUser(userId).sortBy(doc => doc.creationDate)
    docs
  }

}

object DocumentDAO extends SalatDAO[Document, ObjectId](collection = MongoHQConfig.mongoDB("document"))
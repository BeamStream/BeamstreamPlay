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
  commentsOnDocument: List[ObjectId],
  documentFollwers: List[ObjectId],
  previewImageUrl:String)

object Document {

  /**
   * Add a document(Modified)
   */
  def addDocument(document: Document): ObjectId = {
    val documentId = DocumentDAO.insert(document)
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

  /**
   * Get all documents for a user (Modified)
   */
  def getAllGoogleDocumentsForAUser(userId: ObjectId): List[Document] = {
    val docsObtained = DocumentDAO.find(MongoDBObject("userId" -> userId, "documentType" -> "GoogleDocs")).toList
    docsObtained
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

  /**
   * Change the Title and description of a document (Modified)
   */
  def updateTitleAndDescription(documentId: ObjectId, newName: String, newDescription: String) = {
    val document = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
    DocumentDAO.update(MongoDBObject("_id" -> documentId), document.copy(documentDescription = newDescription, documentName = newName), false, false, new WriteConcern)
  }
  
  /**
   * add Comment to document
   */
  def addCommentToDocument(commentId: ObjectId, docId: ObjectId) = {
    val doc = DocumentDAO.find(MongoDBObject("_id" -> docId)).toList(0)
    DocumentDAO.update(MongoDBObject("_id" -> docId), doc.copy(commentsOnDocument = (doc.commentsOnDocument ++ List(commentId))), false, false, new WriteConcern)
  }

}

object DocumentDAO extends SalatDAO[Document, ObjectId](collection = MongoHQConfig.mongoDB("document"))
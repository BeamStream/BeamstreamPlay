package models

import com.mongodb.casbah.Imports._
import utils.MongoHQConfig
import java.util.Date
import java.util.regex.Pattern
import models.mongoContext._
import scala.language.postfixOps
import com.novus.salat.annotations.raw.Key
import com.novus.salat.dao.SalatDAO
import com.mongodb.casbah.commons.MongoDBObject

/**
 * Enumeration for the document access
 *
 * Private - Only available for the owner
 * Public - Available to all
 * Restricted - Available to a restricted list of users
 * Stream - Available to all the Sub-streams and current members of this stream
 */

/**
 * Enumeration for the document type
 */
object DocType extends Enumeration {
  type DocType = Value
  val GoogleDocs = Value(0, "GoogleDocs")
  val Other = Value(1, "Other")
}

/**
 * Enumeration for the document type
 */
object Category extends Enumeration {
  type DocCategory = Value
  val ClassDocument = Value(0, "ClassDocument")
  val Assignment = Value(1, "Assignment")
  val Homework = Value(2, "Homework")
  val Notes = Value(3, "Notes")
  val Project = Value(4, "Project")
  val Lecture = Value(5, "Lecture")
  val ReferenceMaterial = Value(6, "ReferenceMaterial")
  val Tutorial = Value(7, "Tutorial")
  val EdTechTool = Value(8, "EdTechTool")
  val Amusement = Value(9, "Amusement")
}

case class Document(@Key("_id") id: ObjectId,
  documentName: String,
  documentDescription: String,
  documentURL: String,
  documentType: DocType.Value,
  userId: ObjectId,
  documentAccess: Access.Value,
  streamId: ObjectId,
  creationDate: Date,
  lastUpdateDate: Date,
  documentRocks: Int,
  documentRockers: List[ObjectId],
  commentsOnDocument: List[ObjectId],
  documentFollwers: List[ObjectId],
  previewImageUrl: String = "",
  views: Int = 0,
  postToFileMedia: Boolean = true,
  googleDocId: String = "")

object Document extends RockConsumer {

  /**
   * Add a document(Modified)
   */
  def addDocument(document: Document): ObjectId = {
    val documentId = DocumentDAO.insert(document)
    documentId.get
  }

  /**
   * Remove document
   */
  def removeDocument(document: Document) {
    DocumentDAO.remove(document)
  }

  /*
   * Find Document by Id
   */

  def findDocumentById(docId: ObjectId): Option[Document] = {
    DocumentDAO.findOneById(docId)
  }

  /*
  * Names of a rockers for a document
  */
  def rockersNames(docId: ObjectId): List[String] = {
    val docRocked = DocumentDAO.find(MongoDBObject("_id" -> docId)).toList(0)
    User.giveMeTheRockers(docRocked.documentRockers)
  }

  /**
   * Get all documents for a user
   */
  def getAllGoogleDocumentsForAUser(userId: ObjectId): List[Document] = {
    DocumentDAO.find(MongoDBObject("userId" -> userId, "documentType" -> "GoogleDocs")).toList
  }

  /**
   * Get all documents for a user (Modified)
   */
  def getAllPublicDocumentForAUser(userId: ObjectId): List[Document] = {
    DocumentDAO.find(MongoDBObject("userId" -> userId, "documentAccess" -> "Public")).toList
  }
  /**
   *  Update the Rockers List and increase the count by one
   */

  def rockTheDocument(documentId: ObjectId, userId: ObjectId): Int = {

    val documentToRock = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
    documentToRock.documentRockers.contains(userId) match {

      case true =>
        DocumentDAO.update(MongoDBObject("_id" -> documentId),
          documentToRock.copy(documentRockers = (documentToRock.documentRockers filterNot (List(userId)contains))), false, false, new WriteConcern)
        val updatedDocument = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
        DocumentDAO.update(MongoDBObject("_id" -> documentId),
          updatedDocument.copy(documentRocks = (updatedDocument.documentRocks - 1)), false, false, new WriteConcern)
        val document = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
        document.documentRocks
      case false =>
        DocumentDAO.update(MongoDBObject("_id" -> documentId),
          documentToRock.copy(documentRockers = (documentToRock.documentRockers ++ List(userId))), false, false, new WriteConcern)
        val updatedDocument = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
        DocumentDAO.update(MongoDBObject("_id" -> documentId),
          updatedDocument.copy(documentRocks = (updatedDocument.documentRocks + 1)), false, false, new WriteConcern)
        val document = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
        document.documentRocks
    }
  }

  /**
   * Change the Title and description of a document (Modified)
   */
  def updateTitleAndDescription(documentId: ObjectId, newName: String, newDescription: String): WriteResult = {
    val document = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
    DocumentDAO.update(MongoDBObject("_id" -> documentId),
      document.copy(documentDescription = newDescription, documentName = newName), false, false, new WriteConcern)
  }

  /**
   * add Comment to document
   */
  def addCommentToDocument(commentId: ObjectId, docId: ObjectId): WriteResult = {
    val doc = DocumentDAO.find(MongoDBObject("_id" -> docId)).toList(0)
    DocumentDAO.update(MongoDBObject("_id" -> docId),
      doc.copy(commentsOnDocument = (doc.commentsOnDocument ++ List(commentId))), false, false, new WriteConcern)
  }

  /**
   * Follow Document
   */

  def followDocument(userIdOfFollower: ObjectId, documentId: ObjectId): Int = {
    val documentToFollow = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
    (documentToFollow.documentFollwers.contains(userIdOfFollower)) match {
      case true =>
        DocumentDAO.update(MongoDBObject("_id" -> documentId),
          documentToFollow.copy(documentFollwers = (documentToFollow.documentFollwers filterNot (List(userIdOfFollower) contains))), false, false, new WriteConcern)
        val updatedDocumentWithAddedIdOfFollower = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
        updatedDocumentWithAddedIdOfFollower.documentFollwers.size
      case false =>
        DocumentDAO.update(MongoDBObject("_id" -> documentId),
          documentToFollow.copy(documentFollwers = (documentToFollow.documentFollwers ++ List(userIdOfFollower))), false, false, new WriteConcern)
        val updatedDocumentWithAddedIdOfFollower = DocumentDAO.find(MongoDBObject("_id" -> documentId)).toList(0)
        updatedDocumentWithAddedIdOfFollower.documentFollwers.size
    }
  }

  /**
   * Increasing View Count
   */
  def increaseViewCountOfADocument(docId: ObjectId): Int = {
    val docFound = DocumentDAO.find(MongoDBObject("_id" -> docId)).toList(0)
    DocumentDAO.update(MongoDBObject("_id" -> docId), docFound.copy(views = (docFound.views + 1)), false, false, new WriteConcern)
    val updatedDocFound = DocumentDAO.find(MongoDBObject("_id" -> docId)).toList(0)
    updatedDocFound.views
  }

  /**
   * Recent Profile pic of user
   */
  def recentDocForAUser(userId: ObjectId): Option[Document] = {
    val document = DocumentDAO.find(MongoDBObject("userId" -> userId, "documentType" -> "Other")).sort(orderBy = MongoDBObject("creationDate" -> -1)).toList
    document.isEmpty match {
      case true => None
      case false => Option(document.head)
    }

  }

  /**
   * Recent Profile pic of user
   */
  def recentGoogleDocsForAUser(userId: ObjectId): Option[Document] = {
    val document =
      DocumentDAO
        .find(MongoDBObject("userId" -> userId, "documentType" -> "GoogleDocs"))
        .sort(orderBy = MongoDBObject("creationDate" -> -1))
        .toList
    document.isEmpty match {
      case true => None
      case false => Option(document.head)
    }

  }

  /**
   * Search Media For A User By Keyword
   */

  def searchDocumentForAUserByName(userId: ObjectId, keyword: String): List[Document] = {
    val keyWordPattern = Pattern.compile(keyword, Pattern.CASE_INSENSITIVE)
    DocumentDAO.find(MongoDBObject("userId" -> userId, "documentName" -> keyWordPattern)).toList

  }

  //TODO : To Be Removed if visitors pattern will not be used
  // Add Rock to Doc If Message Contains docIdIfAny
  def rockTheMediaOrDoc(idToBeRocked: ObjectId, userId: ObjectId) {
    val docToBeRocked = Document.findDocumentById(idToBeRocked)
    if (!docToBeRocked.isEmpty) Document.rockTheDocument(idToBeRocked, userId)

  }

  //TODO : Add Comment to Doc If Message Contains docIdIfAny
  def commentTheMediaOrDoc(id: ObjectId, commentId: ObjectId) {
    val doc = Document.findDocumentById(id)
    (doc == None) match {
      case true =>
      case false => addCommentToDocument(commentId, id)
    }

  }

  /**
   * Update Preview image of Document
   */
  def updatePreviewImageUrl(documentURL: String, newPreviewImageUrl: String = ""): List[ObjectId] = {
    val documentList = DocumentDAO.find(MongoDBObject("documentURL" -> documentURL)).toList
    documentList.isEmpty match {
      case false => {
        documentList map {
          case doc =>
            DocumentDAO.update(MongoDBObject("_id" -> doc.id), doc.copy(previewImageUrl = newPreviewImageUrl), false, false, new WriteConcern)
            doc.id
        }
        // TODO Remove it when pushing on Production
        /*documentList map {
          case getDocumentId => getDocumentId.id
        }*/
      }
      case true => List(new ObjectId)
    }
  }

  def deletePreviewImageUrl(documentURL: String): List[ObjectId] = {
    val documentList = DocumentDAO.find(MongoDBObject("documentURL" -> documentURL)).toList
    documentList.isEmpty match {
      case false => {
        documentList map {
          case doc =>
            DocumentDAO.update(MongoDBObject("_id" -> doc.id), doc.copy(previewImageUrl = ""), false, false, new WriteConcern)
            doc.id
        }
        // TODO Remove it when pushing on Production
        /*documentList map {
          case getDocumentId => getDocumentId.id
        }*/
      }
      case true => List(new ObjectId)
    }
  }

  def findDocumentByURL(docURL: String): Option[String] = {
    val documentList = DocumentDAO.find(MongoDBObject("documentURL" -> docURL)).toList
    documentList.isEmpty match {
      case true => None
      case false => Option(documentList.head.googleDocId)
    }
  }

  def updateTitle(googleDocId: String, newName: String): List[ObjectId] = {
    val document = DocumentDAO.find(MongoDBObject("googleDocId" -> googleDocId)).toList
    document.isEmpty match {
      case false => document map {
        case doc =>
          DocumentDAO.update(MongoDBObject("_id" -> doc.id), doc.copy(documentName = newName), false, false, new WriteConcern)
          doc.id
      }
      case true => List(new ObjectId)
    }
  }

}

object DocumentDAO extends SalatDAO[Document, ObjectId](collection = MongoHQConfig.mongoDB("document"))

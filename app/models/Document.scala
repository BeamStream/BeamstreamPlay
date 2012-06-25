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

/**
 * This class is used to store and retrieve all the information about documents.
 * 
 * @author Kishen 
 */

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
  val Stream = Value(3,"Stream")

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

case class Document(@Key("_id") id: ObjectId, name: String, url: URL, docType: DocType.Value, userId: ObjectId, access: DocumentAccess.Value, streamId: ObjectId,
  creationDate: Option[Date], lastUpdateDate: Option[Date], rocks: Int, rockers: List[ObjectId], comments : List[Message])

case class DocumentForm(name: String)
object Document {

  implicit val formats = DefaultFormats

  def allDocuments(): List[Document] = Nil

/*
 * Add a document
 */
  def addDocument(document : Document) {
      DocumentDAO.insert(document)
   }

  /*
   * Remove document
   */
  def removeDocument(document : Document) {
    DocumentDAO.remove(document)

  }

  /*
   * Find document by name
   */

  def findDocumentByName(name: String): List[Document] = {
    val regexp = (""".*""" + name + """.*""").r
    for (document <- DocumentDAO.find(MongoDBObject("name" -> regexp)).toList) yield document
  }

  /*
   * Get all documents for a user
   */
  def getAllDocumentsforAUser(userId: ObjectId): List[Document] = {

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

}

object DocumentDAO extends SalatDAO[Document, ObjectId](collection = MongoHQConfig.mongoDB("document"))
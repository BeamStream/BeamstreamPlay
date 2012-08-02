package controllers
import play.api.mvc.Controller
import play.api._
import play.api.mvc._
import play.api.mvc.Response
import models.Stream
import play.api.data._
import play.api.data.Forms._
import play.api.Play.current
import models.User
import org.bson.types.ObjectId
import play.api.cache.Cache
import models.Media
import com.mongodb.gridfs.GridFSDBFile
import models.UserType
import java.io.File
import play.api.libs.iteratee.Enumerator
import java.util.Date
import models.DocumentAccess
import models.DocType
import models.Message
import models.Document
import models.User
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import java.text.SimpleDateFormat
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import java.net.URL
import models.ResulttoSent

/**
 * This controller class is used to store and retrieve all the information about documents.
 * 
 * @author Kishen 
 */

object DocumentController extends Controller {

   implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("MM/dd/yyyy")
  }  + new ObjectIdSerializer

/*
 * 
 * Add a document
 */
  
  def newDocument = Action { implicit request =>
    val documentListJsonMap = request.body.asFormUrlEncoded.get
    (documentListJsonMap.contains(("docURL"))) match {
          case false =>
        Ok(write(new ResulttoSent("Failure", "Document URL Not Found")))
        case true =>
	    val name = documentListJsonMap("docName").toList(0)
	    val url = documentListJsonMap("docURL").toList(0)
	    val access = documentListJsonMap("docAccess").toList(0)
	    val docType = documentListJsonMap("docType").toList(0)
	    val doc = User.getUserProfile(new ObjectId(request.session.get("userId").get))
	    val date = new Date
	    val documentToCreate = new Document(new ObjectId(), name, url, 
		DocType.withName(docType),new ObjectId(request.session.get("userId").get),
		DocumentAccess.withName(access), new ObjectId(request.session.get("userId").get), date, date, 0, List(), List())
	    val docId=Document.addDocument(documentToCreate)
	    val docObtained = Document.findDocumentById(docId)
	    val docJson = write(List(docObtained))
	    Ok(docJson).as("application/json")
	    
	 }   
  }

  def documents = Action { implicit request =>
    val profileName = User.getUserProfile((new ObjectId(request.session.get("userId").get)))
    val docs = Document.getAllDocumentsForAUser(new ObjectId(request.session.get("userId").get))
    Ok
  }

  def getAllDocumentsForAUser = Action { implicit request =>
    val documentIdJsonMap = request.body.asFormUrlEncoded.get
    val docId = documentIdJsonMap("documentId").toList(0)
    val allDocumentsForAUser = Document.getAllDocumentsForAUser(new ObjectId(docId))
    val allDocumentForAStreamJson = write(allDocumentsForAUser)
    Ok(allDocumentForAStreamJson).as("application/json")
  }
  
  /*
   * Rock the document
   */
   def rockTheDocument = Action { implicit request =>
     val documentIdJsonMap = request.body.asFormUrlEncoded.get
     val id = documentIdJsonMap("documentId").toList(0)
     val totalRocks=Document.rockedIt(new ObjectId(id),new ObjectId(request.session.get("userId").get))
     val totalRocksJson=write(totalRocks.toString)
     Ok(totalRocksJson).as("application/json")
   }
   
   /*
    * Rockers of a document
    */
   def giveMeRockers =  Action { implicit request =>
     val documentIdJsonMap = request.body.asFormUrlEncoded.get
     val id = documentIdJsonMap("documentId").toList(0)
     val rockers=Document.rockersNames(new ObjectId(id))
     val rockersJson=write(rockers)
     Ok(rockersJson).as("application/json")
   }
   

}


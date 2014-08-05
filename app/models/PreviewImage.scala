package models

import java.net.URL

import com.mongodb.casbah.MongoConnection
import com.mongodb.casbah.gridfs.GridFS

import javax.net.ssl.HttpsURLConnection
import play.api.Logger
import play.api.mvc.Controller

object PreviewImage extends Controller {

  def addPreviewImage(docPreviewImageUrl: String) = {
    if (docPreviewImageUrl != null) {
      try {
        val url = new URL(docPreviewImageUrl)
        val connection = url.openConnection().asInstanceOf[HttpsURLConnection]
        connection.setRequestMethod("GET")
        if (connection.getContentLength() != -1) {
          val in = connection.getInputStream()
          val mongoDBConnection = MongoConnection()("myTestDB")
          val gridFS = GridFS(mongoDBConnection, "image")
          val gfsFile = gridFS.createFile(in)
          gfsFile.contentType_=("image/png")
          gfsFile.filename = docPreviewImageUrl
          gfsFile.save
          in.close
        }
      } catch {
        case ex: Exception => Logger.error("This error occurred while Adding Preview Image of Google Docs :- ", ex)
      } finally {
        //      out.close
        //      in.close
      }
    }

  }

  /*def getPhoto(previewImageUrl: String) = Action { implicit request =>

    val mongoDBConnection = MongoConnection()("myTestDB")
    val gridFs = GridFS(mongoDBConnection, "image")
    val fileName = (new PasswordHashingUtil).encryptThePassword(previewImageUrl)
    gridFs.findOne(fileName) match {
      case None => NotFound
      case Some(img) => SimpleResult(
        ResponseHeader(200, Map(
          CONTENT_LENGTH -> img.length.toString,
          CONTENT_TYPE -> img.contentType.getOrElse("image/png"))),
        Enumerator.fromStream(img.inputStream))
    }
  }*/
}

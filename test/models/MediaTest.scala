package models

import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import java.io.File
import com.mongodb.Mongo
import com.mongodb.gridfs.GridFS
import org.bson.types.ObjectId
import java.io.FileInputStream

@RunWith(classOf[JUnitRunner])
class MediaTest extends FunSuite with BeforeAndAfter {

  val imageFile1 = new File("/home/neelkanth/Desktop/photo.jpg")

  test("Saving the media object") {
    val mediaTransfer = MediaTransfer(901, MediaType.Image, false, new FileInputStream(imageFile1))
    Media.createMedia(mediaTransfer)
  }

  after {
    MediaDAO.remove(MongoDBObject("mediaType" -> ".*".r))

  }
}
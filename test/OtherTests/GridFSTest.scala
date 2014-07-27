package OtherTests

import com.mongodb.casbah.MongoConnection
import java.io.File
import java.io.FileInputStream
import com.mongodb.casbah.gridfs.GridFS

object GridFSTest extends App {

  /**
   * Making The Connection
   */

  val mongoDBConnection = MongoConnection()("myTestDB")

  /**
   * Initiating the GridFS within the created Mongo Connection
   */

  val gridFS = GridFS(mongoDBConnection)

  /**
   * Creating the inputstream of java file
   */

  val imageFile = new File("/home/neelkanth/neel.jpg")
  val fileInputStream = new FileInputStream(imageFile)

  /**
   * Saving the file in to GridFS
   */

  val gfsFile = gridFS.createFile(fileInputStream)
  gfsFile.filename = "Neel.jpg"
  gfsFile.save

}
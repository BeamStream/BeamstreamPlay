package utils

import com.amazonaws.services.s3.AmazonS3Client
import com.amazonaws.services.s3.model.PutObjectRequest
import com.amazonaws.auth.BasicAWSCredentials
import java.io.File
import play.api.Play
import java.io.InputStream
import com.amazonaws.services.s3.model.ObjectMetadata
import play.api.Logger
import javax.imageio.ImageIO
import java.io.FileInputStream
import java.io.ByteArrayOutputStream
import com.sksamuel.scrimage._
import com.sksamuel.scrimage.ImageMetadata
import utils.Constants._

object AmazonUploadUtil {

}
class AmazonUpload {

  private def fetchS3Client = {
    val AWS_ACCESS_KEY_RAW = Play.current.configuration.getString("A_A_K").get
    val AWS_SECRET_KEY_RAW = Play.current.configuration.getString("A_S_K").get
    val AWS_ACCESS_KEY = ConversionUtility.decodeMe(AWS_ACCESS_KEY_RAW)
    val AWS_SECRET_KEY = ConversionUtility.decodeMe(AWS_SECRET_KEY_RAW)
    val awsCredentials = new BasicAWSCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY)
    new AmazonS3Client(awsCredentials)
  }

  /**
   * Upload File To Amazon
   * param fileName is the name of file
   * param filePic is the file to be uploaded
   */
  def uploadFileToAmazon(fileName: String, filePic: File): Boolean = {
    val bucketName = "BeamStream"
    val s3Client = fetchS3Client
    try {
      s3Client.putObject(bucketName, fileName, filePic)
      true
    } catch {
      case ex: Exception =>
        Logger.error("This error occurred while Uploading a File to Amazon :- ", ex)
        false
    }
  }

  
   /**
   * Upload profilePicName To Amazon
   * param profilePicName is the name of file
   * param profilePic is the file to be uploaded
   */
  
  def uploadProfilePicToAmazon(profilePicName: String, profilePic: File): Boolean = {
    val bucketName = "BeamStream"
    val s3Client = fetchS3Client
    try {
      
      val inputStream = new FileInputStream(profilePic)
      
      val scaleImage = scaledImage(inputStream)
      
      /**
       * Upload original uploaded image
       */
      
      val originalUploadFile = fitProfileImage(scaleImage, 500, 500)
      s3Client.putObject(bucketName, profilePicName , originalUploadFile)
      
      
      /**
       *  Header Size image
       */
      
      val headerSize = Constants.HEADER_SIZE
      val headerName = Constants.HEADER_NAME
      val combineHeaderName = s"$headerName".concat(profilePicName)
      val uploadFile = fitProfileImage(scaleImage, headerSize("width"), headerSize("height"))
      s3Client.putObject(bucketName, combineHeaderName, uploadFile)
      
      /*
       *  Chat Size image
       */
        
      val chatSize = Constants.CHAT_SIZE
      val chatName = Constants.CHAT_NAME
      val uploadChatFile = fitProfileImage(scaleImage, chatSize("width"), chatSize("height"))
      val combineChatName = s"$chatName".concat(profilePicName)
      s3Client.putObject(bucketName, combineChatName , uploadChatFile)

      true
    } catch {
      case ex: Exception =>
        Logger.error("This error occurred while Uploading profile pic to Amazon :- ", ex)
        false
    }
  }

  /**
   * Create a new Image from an input stream. This is intended to create
   * an image from an image format eg PNG, not from a stream of pixels.
   * This method will also attach metadata if available.
   *
   * @param in the stream to read the bytes from
   * @return a new Image
   */
  
  
  private def scaledImage(inputStream: FileInputStream):Image ={
    val processedImage = Image(inputStream)
    processedImage.autocrop(Color.White).scale(0.5)
  }

  private def fitProfileImage(fitImage: Image, width: Int, height: Int): File = {
    
    val autoCropImage = fitImage.fit(width, height).autocrop(Color.White)
    
    val path = getCurrentDirectory

    val result = autoCropImage.output(new File("/tmp/1.png")) // use implicit writer
    
    result
  }
  
  private def getCurrentDirectory = new java.io.File( "." ).getCanonicalPath

  def uploadCompressedFileToAmazon(profilePicName: String, profilePic: InputStream): Boolean = {
    val bucketName = "BeamStream"
    val s3Client = fetchS3Client
    val putObjectRequest = new PutObjectRequest(bucketName, profilePicName, profilePic, new ObjectMetadata)
    try {
      s3Client.putObject(putObjectRequest)
      true
    } catch {
      case ex: Exception =>
        Logger.error("This error occured while uploading a Compressed File to Amazon :- ", ex)
        false
    }
  }

  def isFileExists(profilePicName: String): Boolean = {
    val bucketName = "BeamStream"
    val s3Client = fetchS3Client
    try {
      s3Client.getObject(bucketName, profilePicName)
      true
    } catch {
      case ex: Exception =>
        Logger.error("This error occurred while Checking a File's Exixtence :- ", ex)
        false
    }
  }

  def deleteFileFromAmazon(profilePicName: String): Boolean = {
    val bucketName = "BeamStream"
    val s3Client = fetchS3Client
    try {
      s3Client.deleteObject(bucketName, profilePicName)
      true
    } catch {
      case ex: Exception =>
        Logger.error("This error occured while Deleting a File from Amazon :- ", ex)
        false
    }
  }

}

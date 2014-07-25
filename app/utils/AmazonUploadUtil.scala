package utils

import com.amazonaws.AmazonClientException
import com.amazonaws.AmazonServiceException
import com.amazonaws.auth.PropertiesCredentials
import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.AmazonS3Client
import com.amazonaws.services.s3.model.PutObjectRequest
import com.amazonaws.auth.BasicAWSCredentials
import java.io.File
import java.util.UUID
import play.api.Play
import java.io.InputStream
import com.amazonaws.services.s3.model.ObjectMetadata
import com.amazonaws.services.s3.model.ProgressListener
import com.amazonaws.services.s3.model.ProgressEvent
import play.api.Logger

object AmazonUploadUtil {
  //
  //  var totalFileSize: Double = 0
  //  var totalByteRead: Double = 0
  //  var percentage: Int = 0
  //  def setTotalFileSize(fileSize: Double) {
  //    totalFileSize += fileSize
  //  }
}
class AmazonUpload {

  /* var totalByteRead: Double = 0
    var percentage: Int = 0

      def uploadCompressedFileToAmazon(profilePicName: String, profilePic: InputStream, totalFileSize: Double, flag: Boolean, userId: String) {
        val bucketName = "BeamStream"
        val s3Client = fetchS3Client
        val putObjectRequest = new PutObjectRequest(bucketName, profilePicName, profilePic, new ObjectMetadata)
        if (flag) updateProgressStatus(putObjectRequest, totalFileSize, userId)

        s3Client.putObject(putObjectRequest)
      }

    private def updateProgressStatus(putObjectRequest: PutObjectRequest, totalFileSize: Double, userId: String) = {

      putObjectRequest.setProgressListener(new ProgressListener {
        @Override
        def progressChanged(progressEvent: ProgressEvent) {
          totalByteRead += progressEvent.getBytesTransfered
          percentage = ((totalByteRead / totalFileSize) * 100).toInt
          //Setting the progress status
          ProgressBar.setProgressBar(userId, percentage)
          if (progressEvent.getEventCode == ProgressEvent.COMPLETED_EVENT_CODE) {
          }
        }

      });

    }*/

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
   * param profilePicName is the name of file
   * param profilePic is the file to be uploaded
   */
  def uploadFileToAmazon(profilePicName: String, profilePic: File): Boolean = {
    val bucketName = "BeamStream"
    val s3Client = fetchS3Client
    try {

      s3Client.putObject(bucketName, profilePicName, profilePic)
      true
    } catch {
      case ex: Exception =>
        Logger.error("This error occurred while Uploading a File to Amazon :- ", ex)
        false
    }
  }

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

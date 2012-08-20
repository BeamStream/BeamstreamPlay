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

object AmazonUpload {

  /*
   * This will upload the images and video to Amazon
   */
  def uploadFileToAmazon(profilePicName: String, profilePic: File) {
    val bucketName = "BeamStream"
    val AWS_ACCESS_KEY_RAW = Play.current.configuration.getString("A_A_K").get
    val AWS_SECRET_KEY_RAW = Play.current.configuration.getString("A_S_K").get

    val AWS_ACCESS_KEY = ConversionUtility.decodeMe(AWS_ACCESS_KEY_RAW)
    val AWS_SECRET_KEY = ConversionUtility.decodeMe(AWS_SECRET_KEY_RAW)
    val awsCredentials = new BasicAWSCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY)
    val s3Client = new AmazonS3Client(awsCredentials);
    s3Client.putObject(bucketName, profilePicName, profilePic)
  }
}


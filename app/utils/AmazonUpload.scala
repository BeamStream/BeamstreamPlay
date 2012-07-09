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

object AmazonUpload {
  
  
  def uploadFileToAmazon(profilePicName:String , profilePic : File) {

  val bucketName = "Beamstream"
  val AWS_ACCESS_KEY = "AKIAJZX7II4LFBTVC65A"
  val AWS_SECRET_KEY="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"
  val awsCredentials = new BasicAWSCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY);
  val s3Client = new AmazonS3Client(awsCredentials);
  val a=s3Client.putObject(bucketName, profilePicName, profilePic)
  }
}


package models
import java.io.InputStream


/*
 * JSON format for response 
 * @purpose :  Success or failure
 */
case class ResulttoSent(status: String,
  message: String)

// To be used for getting the Media
case class mediaComposite(name: String,
  contentType: String,
  inputStream: InputStream)


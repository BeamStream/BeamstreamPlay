package models
import java.io.InputStream


case class ResulttoSent(status:String,message:String)


// To be used for getting the Media
case class mediaComposite(name: String , contentType : String , inputStream : InputStream)


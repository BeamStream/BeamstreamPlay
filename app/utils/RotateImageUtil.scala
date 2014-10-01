package utils

import com.beamstream.exifRotate.ExifRotate
import java.io.File
import play.api.Logger

object RotateImageUtil {

  def rotatingImage(imgFile: File) {
    try {
      ExifRotate.correctImageRotation(imgFile)
    } catch {
      case ex: Exception => Logger.info("Image has undefined Source" + ex.getMessage())
    }
  }

}
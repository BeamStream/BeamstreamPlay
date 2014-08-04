package utils

import java.io.FileInputStream
import javax.imageio.ImageIO
import java.io.File
import javax.imageio.ImageWriteParam
import java.io.InputStream
import javax.imageio.IIOImage
import java.io.ByteArrayOutputStream
import java.io.ByteArrayInputStream

object CompressFileUtil extends App {

  /**
   * Compress Image Files
   * param file is the image file
   * param filename is the name of the file
   * param qualityOfOutPutImage is the quality of the image that is needed
   */
  def compressImage(file: File, filename: String, qualityOfOutPutImage: Float): InputStream = {
    val inputStream = new FileInputStream(file)

    // Creating An In Memory Output Stream
    val outPutStream = new ByteArrayOutputStream

    val image = ImageIO.read(inputStream) // BufferedImage

    val writers = ImageIO.getImageWritersByFormatName("jpg")
    val writer = writers.next
    val imageOutputStream = ImageIO.createImageOutputStream(outPutStream) // Image Output Stream
    writer.setOutput(imageOutputStream)

    val param = writer.getDefaultWriteParam
    param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT) // Setting Compression Mode

    // Specifying The Image Quality , We Can Choose The Quality Required
    param.setCompressionQuality(qualityOfOutPutImage)

    writer.write(null, new IIOImage(image, null, null), param)

    // Closing The Input and Output Streams
    inputStream.close
    outPutStream.close
    imageOutputStream.close
    writer.dispose // Disposing writer

    // Creating The InputStream From ByteArrayInputStream
    val fileInputStream: InputStream = new ByteArrayInputStream(outPutStream.toByteArray)
    fileInputStream // Returned The Compressed Image Input Stream
  }
}


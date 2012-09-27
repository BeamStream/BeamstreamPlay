package utils
import java.io.FileInputStream
import javax.imageio.ImageIO
import java.io.File
import java.io.FileOutputStream
import javax.imageio.ImageWriter
import java.awt.image.BufferedImage
import javax.imageio.ImageWriteParam
import javax.imageio.stream.ImageOutputStream
import java.io.OutputStream
import java.io.InputStream
import javax.imageio.IIOImage
import java.util.Iterator
import java.io.ByteArrayOutputStream
import java.io.ByteArrayInputStream

object CompressFile extends App{

  def compressImage(inputImage : File , filename: String, quality: Float) : InputStream={
    println(inputImage.getTotalSpace() + "Before")
    val is= new FileInputStream(inputImage)
    val os= new ByteArrayOutputStream
    val image = ImageIO.read(is);
    val writers = ImageIO.getImageWritersByFormatName("jpg")
    val writer = writers.next();
    val ios= ImageIO.createImageOutputStream(os);
    writer.setOutput(ios);
    val param = writer.getDefaultWriteParam();
    param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
    param.setCompressionQuality(quality);
    writer.write(null, new IIOImage(image, null, null), param);
    is.close();
    os.close();
    ios.close();
    writer.dispose();
    println(os.size + "After")
   	val decodedInput : InputStream =new ByteArrayInputStream(( os).toByteArray())
    println(decodedInput)
    decodedInput
  }
}
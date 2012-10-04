package utils

import java.awt.image.BufferedImage
import java.io.File
import java.io.IOException
import javax.imageio.ImageIO
import com.xuggle.mediatool.IMediaReader
import com.xuggle.mediatool.MediaListenerAdapter
import com.xuggle.mediatool.ToolFactory
import com.xuggle.mediatool.event.IVideoPictureEvent
import com.xuggle.xuggler.Global
import java.io.ByteArrayOutputStream
import java.awt.image.DataBufferByte
import java.io.ByteArrayInputStream
import java.io.InputStream

object ExtractFrameFromVideo extends App {
  def extractFrameFromVideo(filePath: String): InputStream = {
    var ip: InputStream = null
    val inputFilename = "/home/neelkanth/Desktop/Tere-Naam-(2003)---DVD---Rip---ARAHAN-1.mp4"
    var count = 0

    val mediaReader: IMediaReader = ToolFactory.makeReader(filePath)

    mediaReader.setBufferedImageTypeToGenerate(BufferedImage.TYPE_3BYTE_BGR)

    mediaReader.addListener(new ImageSnapListener)

    while (count < 1) {
      mediaReader.readPacket()
    }

    class ImageSnapListener extends MediaListenerAdapter {

      override def onVideoPicture(event: IVideoPictureEvent) = {
        val obtainedinputStream = dumpImageToFile(event.getImage)
        ip = obtainedinputStream
        count = count + 1
      }

      def dumpImageToFile(image: BufferedImage): InputStream = {
        val baos: ByteArrayOutputStream = new ByteArrayOutputStream
        println(baos.size + "Before")
        ImageIO.write(image, "png", baos)
        println(baos.size + "After")
        val imageInByte = baos.toByteArray
        val decodedInput: InputStream = new ByteArrayInputStream(imageInByte)
        decodedInput

      }
    }
    ip
  }

  val a = extractFrameFromVideo("/home/neelkanth/Desktop/Tere-Naam-(2003)---DVD---Rip---ARAHAN-1.mp4")
  println(a.read)
}
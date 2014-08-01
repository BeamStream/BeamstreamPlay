package utils

import java.awt.image.BufferedImage
import javax.imageio.ImageIO
import com.xuggle.mediatool.IMediaReader
import com.xuggle.mediatool.MediaListenerAdapter
import com.xuggle.mediatool.ToolFactory
import com.xuggle.mediatool.event.IVideoPictureEvent
import java.io.ByteArrayOutputStream
import java.io.ByteArrayInputStream
import java.io.InputStream

object ExtractFrameFromVideoUtil {

  /**
   * Extracting a Frame From Video
   * @param filePath is the path of the Video from which the frame has to be extracted
   */

  def extractFrameFromVideo(filePath: String): InputStream = {
    var ip: InputStream = null
    var count = 0

    val mediaReader: IMediaReader = ToolFactory.makeReader(filePath)

    mediaReader.setBufferedImageTypeToGenerate(BufferedImage.TYPE_3BYTE_BGR)

    mediaReader.addListener(new ImageSnapListener)

    while (count < 1) {
      mediaReader.readPacket()
    }

    class ImageSnapListener extends MediaListenerAdapter {

      override def onVideoPicture(event: IVideoPictureEvent): Unit = {
        val obtainedinputStream = dumpImageToFile(event.getImage)
        ip = obtainedinputStream
        count = count + 1
      }

      def dumpImageToFile(image: BufferedImage): InputStream = {
        val baos: ByteArrayOutputStream = new ByteArrayOutputStream
        ImageIO.write(image, "png", baos)
        val imageInByte = baos.toByteArray
        val decodedInput: InputStream = new ByteArrayInputStream(imageInByte)
        decodedInput

      }
    }
    ip
  }

}

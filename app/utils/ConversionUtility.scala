package utils

import org.apache.commons.codec.binary.Hex

object ConversionUtility extends App {

  
  /*
   * Does the encoding
   */
  val str = ""
  val encodedString = Hex.encodeHexString(str.getBytes("cp424"))
  println(encodedString)

  
  /*
   * Decoding Part for a string
   */
  def decodeMe(encodedString: String): String = {
    val originalString = new String(Hex.decodeHex(encodedString.toCharArray), "cp424")
    originalString
  }

}
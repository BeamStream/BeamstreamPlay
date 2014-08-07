package utils

import org.apache.commons.codec.binary.Hex

object ConversionUtility extends App {

  /*
   * Does the encoding
   */
  /*val str = ""
  val encodedString = Hex.encodeHexString(str.getBytes("cp424"))*/

  /*
   * Decoding Part for a string
   */
  def decodeMe(encodedString: String): String = {
    new String(Hex.decodeHex(encodedString.toCharArray), "cp424")

  }

  /*
   * Encryption Of PassWord
   */

  def encryptPassword(password: String): String = {
    Hex.encodeHexString(password.getBytes("cp424"))
  }

}

package utils
import java.security.Key
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec
import sun.misc.BASE64Decoder
import sun.misc.BASE64Encoder

class PasswordHashing {

  val ALGO = "AES"
  val keyValue: Array[Byte] = Array('T', 'h', 'e', 'B', 'e', 's', 't', 'S', 'e', 'c', 'r', 'e', 't', 'K', 'e', 'y')

  /*
   * Creates The Unique Key For The Purpose Of Encryption & Decryption 
   */

  def generateKey = {
    val key = new SecretKeySpec(keyValue, ALGO)
    println(key)
    key
  }

  /*
   * Encryption Of Password By AES
   */
  def encryptThePassword(password: String) = {
    println(password)
    val key = generateKey
    val cipher = Cipher.getInstance(ALGO)
    cipher.init(Cipher.ENCRYPT_MODE, key)
    val encVal = cipher.doFinal(password.getBytes())
    val encryptedPassword = new BASE64Encoder().encode(encVal)
    println(encryptedPassword)
    encryptedPassword
  }
  
   /*
   * Decryption Of Password By AES
   */
  def decryptThePassword(encryptedPassword: String) = {
    val key = generateKey
    val cipher = Cipher.getInstance(ALGO)
    cipher.init(Cipher.DECRYPT_MODE, key)
    val decordedValue = new BASE64Decoder().decodeBuffer(encryptedPassword)
    val decValue = cipher.doFinal(decordedValue)
    val decryptedpassword = new String(decValue)
    decryptedpassword
  }
  
   
}
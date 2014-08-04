package utils

import java.util.UUID

object TokenEmailUtil {

  /**
   * Generate the security token
   */
  /*def generateToken: String = {
    val secureRandom = SecureRandom.getInstance("SHA1PRNG");
    val digest = MessageDigest.getInstance("SHA-256");
    secureRandom.setSeed(secureRandom.generateSeed(128))
    new String(digest.digest((secureRandom.nextLong() + "").getBytes()))
  }*/

  /**
   * Generate the security token using UUID
   */
  def securityToken: String = {
    UUID.randomUUID.toString
  }

}

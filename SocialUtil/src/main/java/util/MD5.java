package util;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 
 * @author ylr
 * MD5加密
 *
 */
public class MD5 {
	/**
	 * 
	 * @param str - 需要MD5加密的字符串
	 * @return	MD5加密后的字符串
	 * @throws NoSuchAlgorithmException 
	 * @throws Exception
	 */
	public static String getMD5(String str) throws NoSuchAlgorithmException {
		MessageDigest md = MessageDigest.getInstance("MD5");
		md.update(str.getBytes());
		return new BigInteger(1,md.digest()).toString(16);
	}
}

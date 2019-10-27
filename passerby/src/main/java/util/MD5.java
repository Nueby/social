package util;

import java.math.BigInteger;
import java.security.MessageDigest;

/**
 * 
 * @author ylr
 *
 */
public class MD5 {
	public static String getMD5(String str) {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(str.getBytes());
			return new BigInteger(1,md.digest()).toString(16);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}

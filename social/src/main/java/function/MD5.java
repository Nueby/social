package function;

import java.math.BigInteger;
import java.security.MessageDigest;

/**
 * 
 * @author ylr
 * MD5����
 *
 */
public class MD5 {
	public static String getMD5(String str) throws Exception {
		MessageDigest md = MessageDigest.getInstance("MD5");
		md.update(str.getBytes());
		return new BigInteger(1,md.digest()).toString(16);
	}
}

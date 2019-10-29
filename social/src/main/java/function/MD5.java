package function;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 
 * @author ylr
 * MD5����
 *
 */
public class MD5 {
	/**
	 * 
	 * @param str - ��ҪMD5���ܵ��ַ���
	 * @return	MD5���ܺ���ַ���
	 * @throws NoSuchAlgorithmException 
	 * @throws Exception
	 */
	public static String getMD5(String str) throws NoSuchAlgorithmException {
		MessageDigest md = MessageDigest.getInstance("MD5");
		md.update(str.getBytes());
		return new BigInteger(1,md.digest()).toString(16);
	}
}

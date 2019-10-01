package dao;

import java.util.Random;
import java.util.Properties;
import javax.mail.*;
import javax.mail.Message.RecipientType;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

/**
 * 
 * @author ylr
 *
 */
public class SendEmail {
	private SendEmail() {
	}
	
	/**
	 * 
	 * @param email - 收件人
	 * @return - 验证码
	 * @throws AddressException
	 * @throws MessagingException
	 */
	public static int send(String email) throws AddressException, MessagingException {
		//随机数字
		Random rand = new Random();
		int randNum = 0;
		for(int i = 0; i < 4; i++) {
			randNum = randNum * 10 + rand.nextInt(10);
		}
		Properties pro = new Properties();
		//校验用户名和密码
		pro.setProperty("mail.smtp.auth", "true");
		//邮箱协议
		pro.setProperty("mail.transport.protocol", "smtp");
		//邮件服务器地址
		pro.setProperty("mail.host", "smtp.qq.com");
		Session session = Session.getInstance(pro, new Authenticator() {
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication("yoshinomikoto@vip.qq.com", "buztgabmycqwccca");		//发件人账号和密码
			}
		});
		Message msg = new MimeMessage(session);
		//发件人
		msg.setFrom(new InternetAddress("yoshinomikoto@vip.qq.com"));
		//主题
		msg.setSubject("Passer-by邮箱验证");
		//收件人
		msg.setRecipient(RecipientType.TO, new InternetAddress(email));
		//内容
		msg.setContent("验证码为：<p>" + randNum + "</p>", "text/html;charset=utf-8");
		//发送
		Transport.send(msg);
		return randNum;
	}
	
	/**
	 * 
	 * @param num - 用户输入
	 * @param num2 - 邮箱生成
	 * @return - 是否一致
	 */
	public static Boolean confirm(int num, int num2) {
		return num == num2;
	}
}

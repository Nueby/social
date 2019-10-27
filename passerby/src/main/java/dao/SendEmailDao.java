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
public class SendEmailDao {
	/**
	 * 
	 * @param email - 收件人
	 * @return - 验证码
	 * @throws AddressException
	 * @throws MessagingException
	 */
	public String send(String email) {
		try {
			//随机数字
			Random rand = new Random();
			StringBuffer randNumTemp = new StringBuffer();
			for(int i = 0; i < 4; i++) {
				randNumTemp.append(rand.nextInt(10));
			}
			String randNum = randNumTemp.toString();
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
			//System.out.println(email);
			msg.setRecipient(RecipientType.TO, new InternetAddress(email));
			//内容
			msg.setContent("验证码为：<p>" + randNum + "</p>", "text/html;charset=utf-8");
			//发送
			Transport.send(msg);
			return randNum;
		} catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 
	 * @param num - 用户输入
	 * @param num2 - 邮箱生成
	 * @return - 是否一致
	 */
	public Boolean confirm(String num, String num2) {
		return num.equals(num2);
	}
}

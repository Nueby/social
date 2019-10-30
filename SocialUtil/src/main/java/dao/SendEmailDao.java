package dao;

import java.util.Random;
import java.util.Properties;
import javax.mail.*;
import javax.mail.Message.RecipientType;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpSession;
import com.alibaba.fastjson.JSONObject;

/**
 * 
 * @author ylr
 *
 */
public class SendEmailDao {
	private SendEmailDao() {
	}
	
	/**
	 * 
	 * @param email - 收件人
	 * @return - 验证码
	 * @throws AddressException
	 * @throws MessagingException
	 */
	public static String send(String email) throws AddressException, MessagingException {
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
	}
	
	/**
	 * 
	 * @param num - 用户输入
	 * @param num2 - 邮箱生成
	 * @return - 是否一致
	 */
	public static Boolean confirm(String num, String num2) {
		return num.equals(num2);
	}
	
	/**
	 * 
	 * @param reqJson - 请求json数据
	 * @param resJson - 响应json数据
	 * @param session - 记录
	 */
	public static void doGetSendEmail(JSONObject reqJson, JSONObject resJson, HttpSession session) {
		try {
			String email = reqJson.getString("email");
			String num = send(email);
			session.setAttribute("emailNum", num);
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 
	 * @param reqJson - 请求json数据
	 * @param resJson - 响应json数据
	 * @param session - 记录
	 */
	public static void doGetConfirm(JSONObject reqJson, JSONObject resJson, HttpSession session) {
    	String input = reqJson.getString("input");
    	String create = (String)session.getAttribute("emailNum");
    	resJson.put("msg", confirm(input, create));
	}
}

package controller;

import java.io.IOException;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.alibaba.fastjson.JSONObject;

import dao.SendEmail;

/**
 * 
 * @author ylr
 *
 */
public class SendEmailController extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public SendEmailController() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//获取json数据
    	JSONObject reqJson = (JSONObject)request.getAttribute("json");
    	JSONObject json = new JSONObject();
    	if(reqJson.getString("behaviour").equals("getMsg")) {		//发送信息
    		String email = reqJson.getString("email");
    		try {
    			int num = SendEmail.send(email);
    			HttpSession session = request.getSession();
    			session.setAttribute("emailNum", num);
    			Cookie cookie = new Cookie("JSESSIONID", session.getId());
    			response.addCookie(cookie);
    		} catch (AddressException e) {
    			e.printStackTrace();
    		} catch (MessagingException e) {
    			e.printStackTrace();
    		}
    	} else {		//验证
        	Integer input = reqJson.getInteger("input");
        	Integer create = (Integer)request.getSession().getAttribute("emailNum");
        	json.put("msg", SendEmail.confirm(input, create).toString());
    	}
    	response.getWriter().write(json.toString());
    	response.getWriter().close();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request,response);
	}

}

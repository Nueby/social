package controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.alibaba.fastjson.JSONObject;
import dao.SendEmailDao;

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
    	HttpSession session = request.getSession();
    	switch(reqJson.getInteger("behaviour")) {
    	//发送信息
    	case 0: 		
    		SendEmailDao.doGetSendEmail(reqJson,json,session);
    		Cookie cookie = new Cookie("JSESSIONID", session.getId());
    		response.addCookie(cookie);
    		break;
    	//验证
    	case 1:
    		SendEmailDao.doGetConfirm(reqJson,json,session);
    		break;
    	}
    	response.getWriter().write(json.toString());
    	response.getWriter().close();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request,response);
	}

}

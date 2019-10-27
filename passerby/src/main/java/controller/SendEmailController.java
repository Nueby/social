package controller;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
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
    	//获取会话
    	HttpSession session = request.getSession();
    	//Dao对象
    	SendEmailDao send = new SendEmailDao();
    	//执行操作
    	switch(reqJson.getInteger("behaviour")) {
    	//发送信息
    	case 0:
    		session.setAttribute("emailNum", send.send(reqJson.getString("email")));
    		break;
    	//验证
    	case 1:
    		json.put("msg", send.confirm(reqJson.getString("input"), (String)session.getAttribute("emailNum")));
    		break;
    	}
    	PrintWriter out = response.getWriter();
    	out.write(json.toString());
    	out.close();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request,response);
	}
}

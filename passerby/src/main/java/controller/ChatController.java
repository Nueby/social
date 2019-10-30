package controller;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.alibaba.fastjson.JSONObject;

import dao.ChatDao;

/**
 * 
 * @author ylr
 *
 */
public class ChatController extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public ChatController() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request,response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		JSONObject json = new JSONObject();
		//执行操作
		int behaviour = reqJson.getInteger("behaviour");
		switch(behaviour) {
		//聊天举报
		case 0:
			//account为发送方的账号
			json.put("result", ChatDao.illegal(reqJson.getString("account"), reqJson.getString("date"), reqJson.getString("illegal")));
			break;
		//好友添加
		case 1:
			break;
		//时间延长
		case 2:
			break;
		}
		PrintWriter out = response.getWriter();
		out.write(json.toString());
		out.close();
	}

}

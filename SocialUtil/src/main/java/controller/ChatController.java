package controller;

import java.io.IOException;
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
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		JSONObject resJson = new JSONObject();
		ChatDao.doPost(reqJson,resJson);
		
		//执行操作
		int behaviour = reqJson.getInteger("behaviour");
		switch(behaviour) {
			//查询聊天记录
			case 0:
			json.put("result", ChatDao.findinfo(reqJson.getString("account"),reqJson.getString("time")));
			break;
		}
		response.getWriter().write(resJson.toString());
		response.getWriter().close();
	}
}

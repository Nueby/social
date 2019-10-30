package controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class ManageController extends HttpServlet {
    public ManageController() {
        super();
        // TODO Auto-generated constructor stub
    }

	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		JSONObject json = new JSONObject();
		//执行操作
		int behaviour = reqJson.getInteger("behaviour");
		switch(behaviour) {
			//查询聊天记录
			case 0:
			json.put("result", ChatInfo.doGet(reqJson.getString("account"),reqJson.getString("time")));
			break;
		}
	}

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}

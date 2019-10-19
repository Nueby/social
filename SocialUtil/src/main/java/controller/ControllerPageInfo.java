package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.alibaba.fastjson.JSONObject;
import dao.PageInfo;
import dao.User;

/**
 * 
 * @author ylr
 *
 */
public class ControllerPageInfo extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public ControllerPageInfo() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//获取
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		PrintWriter out = response.getWriter();
		User user = new User(reqJson.getString("account"));
		try {
			PageInfo page = new PageInfo(user.getId());
			Map<String, Object> map = page.getInfo();
			String jsonString = JSONObject.toJSONString(map);
			out.write(jsonString);
			out.close();
		} catch (SQLException e) {
			JSONObject json = new JSONObject();
			json.put("result",false);
			out.write(json.toString());
			out.close();
		}
	}


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		PrintWriter out = response.getWriter();
		User user = new User(reqJson.getString("account"));
		JSONObject json = new JSONObject();		
		try {
			PageInfo page = new PageInfo(user.getId());
			if(reqJson.getString("behaviour").equals("create")) {		//创建
				page.changeInfo(true, reqJson.getString("username"), reqJson.getString("head"), reqJson.getString("signature"), reqJson.getString("birthday"), reqJson.getString("tags"), reqJson.getString("circleInfo"), reqJson.getString("circleImg"));
			}  else {		//修改
				page.changeInfo(false, reqJson.getString("username"), reqJson.getString("head"), reqJson.getString("signature"), reqJson.getString("birthday"), reqJson.getString("tags"), reqJson.getString("circleInfo"), reqJson.getString("circleImg"));
			}
			json.put("result",true);
			out.write(json.toString());
			out.close();
		} catch(Exception e) {
			json.put("result",false);
			out.write(json.toString());
			out.close();
		}
	}
}

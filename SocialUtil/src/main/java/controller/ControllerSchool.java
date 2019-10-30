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
import dao.School;
import dao.User;

/**
 * 
 * @author ylr
 *
 */
public class ControllerSchool extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public ControllerSchool() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//获取
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		PrintWriter out = response.getWriter();
		User user = new User(reqJson.getString("account"));
		try {
			School school = new School(user.getId());
			Map<String, Object> map = school.getInfo();
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
			School school = new School(user.getId());
			if(reqJson.getString("behaviour").equals("create")) {		//创建
				school.changeInfo(true, null, null, null, 2018, null, "男", 20);
				request.getRequestDispatcher("/ControllerPageInfo.do").forward(request, response);
			}  else {		//修改
				school.changeInfo(false, reqJson.getString("school"), reqJson.getString("college"), reqJson.getString("profession"), reqJson.getInteger("grade"), reqJson.getString("email"), reqJson.getString("sex"), reqJson.getInteger("age"));
				json.put("result",true);
				out.write(json.toString());
				out.close();
			}
		} catch(Exception e) {
			json.put("result",false);
			out.write(json.toString());
			out.close();
		}
	}
}

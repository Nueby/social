package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

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
public class ControllerUser extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public ControllerUser() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		//检查账号是否存在
    	JSONObject json = new JSONObject();
    	json.put("result", User.isExist(reqJson.getString("account")));
    	PrintWriter out = response.getWriter();
    	out.write(json.toString());
    	out.close();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	//获取json数据
		JSONObject json = (JSONObject)request.getAttribute("json");
		//行为
		String behaviour = json.getString("behaviour");
		if(behaviour.equals("logup")) {		//注册
			User user = new User(json.getString("account"));
			if(user.createAccount(json.getString("login_password"), json.getString("edu_password"))) {
				json.put("behaviour", "create");
				request.setAttribute("json", json);
				request.getRequestDispatcher("/ControllerSchool.do").forward(request, response);
			}
		} else if(behaviour.equals("changePassword")) {		//修改密码
			User user = new User(json.getString("account"));
			try {
				School school = new School(user.getId());
				user = new User(json.getString("account"),(String)school.getInfo().get("email"));
			} catch (SQLException e) {
				json.put("result",false);
				response.getWriter().write(json.toString());
				response.getWriter().close();
			}
			if(json.getString("wpassword").equals("login_password")) {		//更改登录密码
				json.put("result", user.changeLoginPassword(json.getString("opassword"), json.getString("password"),json.getString("email")));
			} else {		//更改教务系统密码
				json.put("result", user.changeEduPassword(json.getString("password")));
			}
			response.getWriter().write(json.toString());
			response.getWriter().close();
		} else if(behaviour.equals("login")) {		//登录验证
			User user = new User(json.getString("account"));
			if(User.isExist(json.getString("account"))) {
				if(user.judgePassword(json.getString("password"))) {
					json.put("result", "ok");
				} else {
					json.put("result", "password");
				}
			} else {
				json.put("result", "account");
			}
			response.getWriter().write(json.toString());
			response.getWriter().close();
		} else {
			System.out.println("无法找到相应的behaviour");
		}
	}
}

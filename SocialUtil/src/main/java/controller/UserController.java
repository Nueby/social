package controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.alibaba.fastjson.JSONObject;
import dao.UserDao;

/**
 * 
 * @author ylr
 *
 */
public class UserController extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public UserController() {
        super();
    }
    
    @SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	//获取json数据
    	JSONObject reqJson = (JSONObject)request.getAttribute("json");
    	UserDao user = new UserDao(reqJson.getInteger("account"), false);
    	user.loadInfo();
    	JSONObject json = new JSONObject();
    	json.put("phone", user.getPhone());
    	json.put("email", user.getEmail());
    	json.put("sex", user.getSex());
    	json.put("position", user.getPosition());
    	json.put("age", user.getAge());
    	json.put("hobby", user.getHobby());
    	json.put("tags", user.getTags());
    	json.put("picture", user.getPicture());
    	response.getWriter().write(json.toString());
    	response.getWriter().close();
	}
    
    @SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//获取json数据
		JSONObject json = (JSONObject)request.getAttribute("json");
		//行为
		String behaviour = json.getString("behaviour");
		if(behaviour.equals("logup")) {		//注册
			UserDao user = new UserDao((Integer)json.get("account"), true);
			user.setCreateInfo(json.getString("password"), json.getString("email"), json.getString("sex"), json.getInteger("phone"), json.getString("position"), json.getInteger("age"), json.getString("hobby"), json.getString("tags"));
			user.sureCreate();
		} else if(behaviour.equals("change")) {		//修改
			UserDao user = new UserDao(json.getInteger("account"), false);
			user.loadInfo();
			user.changeInfo(json.getInteger("phone"), json.getString("email"), json.getString("sex"), json.getString("position"), json.getInteger("age"), json.getString("hobby"), json.getString("tags"));
			user.updateInfo();
		} else if(behaviour.equals("changePassword")) {		//修改密码
			UserDao user = new UserDao(json.getInteger("account"), false);
			user.loadInfo();
			JSONObject jsonCP = new JSONObject();
			if(user.judgePassword(json.getString("oPassword"))) {
				user.setPassword(json.getString("password"));
				user.updateInfo();
				jsonCP.put("msg", "true");
				response.getWriter().write(jsonCP.toString());
				response.getWriter().close();
			} else {
				jsonCP.put("msg", "false");
				response.getWriter().write(jsonCP.toString());
				response.getWriter().close();
			}
		} else {
			System.out.println("无法找到相应的behaviour");
		}
	}
}
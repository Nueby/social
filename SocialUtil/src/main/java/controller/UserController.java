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

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		JSONObject resJson = new JSONObject();
		UserDao.doGet(reqJson,resJson); 
		response.getWriter().write(resJson.toString());
		response.getWriter().close();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		JSONObject resJson = new JSONObject();
		UserDao.doPost(reqJson,resJson);
		response.getWriter().write(resJson.toString());
		response.getWriter().close();
	}

}

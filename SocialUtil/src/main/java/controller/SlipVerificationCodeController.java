package controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.alibaba.fastjson.JSONObject;
import dao.SlipVerificationCodeDao;

/**
 * 
 * @author ylr
 *
 */
public class SlipVerificationCodeController extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public SlipVerificationCodeController() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//获取图片
		JSONObject json = new JSONObject();
		SlipVerificationCodeDao slip = new SlipVerificationCodeDao();
		slip.doGet(json);
		//保存信息
		HttpSession session = request.getSession();
		session.setAttribute("slip", slip);
		Cookie cookie = new Cookie("JSESSIONID", session.getId());
		cookie.setMaxAge(10*60);
		response.addCookie(cookie);
		response.getWriter().write(json.toString());
		response.getWriter().close();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//获取json数据
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		JSONObject json = new JSONObject();
		HttpSession session = request.getSession();
		SlipVerificationCodeDao slip = (SlipVerificationCodeDao)session.getAttribute("slip");
		slip.doPost(reqJson, json);
		response.getWriter().write(json.toString());
		response.getWriter().close();
	}
}

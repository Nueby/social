package controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.alibaba.fastjson.JSONObject;
import dao.SlipVerificationCodeDao;

public class SlipVerificationCodeController extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public SlipVerificationCodeController() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//获取图片
		SlipVerificationCodeDao slip = new SlipVerificationCodeDao();
		String jsonString = JSONObject.toJSONString(slip.getPic());
		//保存信息
		HttpSession session = request.getSession();
		session.setAttribute("slip", slip);
		Cookie cookie = new Cookie("JSESSIONID", session.getId());
		cookie.setMaxAge(10*60);
		response.addCookie(cookie);
		//响应
		PrintWriter out = response.getWriter();
		out.write(jsonString);
		out.close();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//获取json数据
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		JSONObject json = new JSONObject();
		HttpSession session = request.getSession();
		SlipVerificationCodeDao slip = (SlipVerificationCodeDao)session.getAttribute("slip");
		json.put("verification",slip.check(reqJson));
		//响应
		PrintWriter out = response.getWriter();
		out.write(json.toString());
		out.close();
	}

}

package controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.alibaba.fastjson.JSONObject;
import dao.SlipVerificationCode;

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
		JSONObject json = new JSONObject();
		SlipVerificationCode slip = new SlipVerificationCode();
		String[] image = slip.getSlipPicture();
		int[] pos = slip.getSlipXY();
		json.put("big", image[0]);
		json.put("small",image[1]);
		json.put("posY", pos[1]);
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
		JSONObject json = (JSONObject)request.getAttribute("json");
		HttpSession session = request.getSession();
		SlipVerificationCode slip = (SlipVerificationCode)session.getAttribute("slip");
		int d = json.getInteger("distance");
		JSONObject jsonV = new JSONObject();
		jsonV.put("verification", slip.verificationSuccess(d));
		response.getWriter().write(jsonV.toString());
		response.getWriter().close();
	}
}

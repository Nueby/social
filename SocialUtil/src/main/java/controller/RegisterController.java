package controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONObject;

/**
 * 
 * @author ylr
 *
 */
public class RegisterController extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public RegisterController() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request,response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject json = (JSONObject)request.getAttribute("json");
		String address0 = null;		//学校教务系统url
		if(json.getString("school").equals("广东金融学院")) {
			address0 = "http://jwxt.gduf.edu.cn/app.do";
		} else if(json.getString("school").equals("深圳技术大学")) {
			address0 = "http://isea.sztu.edu.cn/app.do";
		}
		String address = address0 + "?method=" + json.getString("method") + "&xh=" + json.getString("xh") + "&pwd=" + json.getString("pwd");
		URL url = new URL(address);
		HttpURLConnection connection = (HttpURLConnection)url.openConnection();
		connection.setRequestMethod("GET");
		connection.setDoInput(true);
		connection.setDoOutput(false);
		connection.setUseCaches(false);
		connection.setConnectTimeout(5000);
		BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
		StringBuffer sb = new StringBuffer();
		String temp = "";
		while((temp = reader.readLine()) != null) {
			sb.append(temp);
		}
		response.getWriter().write(sb.toString());
		response.getWriter().close();
	}

}

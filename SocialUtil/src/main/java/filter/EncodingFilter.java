package filter;

import java.io.BufferedReader;
import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import com.alibaba.fastjson.JSONObject;

/**
 * 
 * @author ylr
 *
 */
public class EncodingFilter implements Filter {

    public EncodingFilter() {
    }

	public void destroy() {
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		//utf-8编码
		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");
		response.setContentType("application/json");
		JSONObject json = null;
		if(((HttpServletRequest) request).getMethod().equals("GET")) {
			//获取json数据	
			json = new JSONObject();
			for(String s : request.getParameterMap().keySet()) {
				json.put(s, request.getParameter(s));
			}
		} else if(((HttpServletRequest) request).getMethod().equals("POST")) {
			//获取json数据
			StringBuffer sb = new StringBuffer();
			BufferedReader reader = request.getReader();
			String temp = null;
			while((temp = reader.readLine()) != null) {
				sb.append(temp);
			}
			json = JSONObject.parseObject(sb.toString());
		} else {
			try {
				throw new Exception();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		request.setAttribute("json", json);
		chain.doFilter(request, response);
	}

	public void init(FilterConfig fConfig) throws ServletException {
	}
}
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
		//utf-8����
		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");
		response.setContentType("application/json");
		//��ȡjson����
		StringBuffer sb = new StringBuffer();
		BufferedReader reader = request.getReader();
		String temp;
		while((temp = reader.readLine()) != null) {
			sb.append(temp);
		}
		JSONObject json = JSONObject.parseObject(sb.toString());
		request.setAttribute("json", json);
		//ת����ԭurl
		request.getRequestDispatcher(((HttpServletRequest)request).getRequestURL().toString()).forward(request, response);
	}

	public void init(FilterConfig fConfig) throws ServletException {
	}
}

package filter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

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
		//获取json数据
		Map<String, String[]> jsonMapArr = request.getParameterMap();
		Map<String, String> jsonMap = new HashMap<String, String>();
		for(String s : jsonMapArr.keySet()) {
			jsonMap.put(s, jsonMapArr.get(s)[0]);
		}
		JSONObject json = JSONObject.parseObject(JSONObject.toJSONString(jsonMap));
		request.setAttribute("json", json);
		//释放过滤器
		chain.doFilter(request, response);
	}

	public void init(FilterConfig fConfig) throws ServletException {
	}

}

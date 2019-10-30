package dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import com.alibaba.fastjson.JSONObject;

import bean.*;
import util.C3P0Util;

/**
 * 
 * @author ylr
 *
 */
public class ChatDao {
	public static void doPost(JSONObject reqJson, JSONObject resJson) {
		try {
			int behaviour = reqJson.getInteger("behaviour");
			String friendaccount = reqJson.getString("friendaccount");
			String account = reqJson.getString("account");
			User user = new User(account);
			School school = new School(account);
			Own own = new Own(user.getId());
			switch(behaviour) {
			//查询聊天记录
			case 0:
				PreparedStatement ps  = C3P0Util.getConnection().prepareStatement("SELECT from,to,msg,data FROM chat WHERE from=? and to=?");
				ps.setString(1, account);
				ps.setString(2, friendaccount);
				ResultSet rs = ps.executeQuery();
				String msg="";
				String data="";
				while(rs.next()){
	            	//读取数据
	            	msg=rs.getString("chatinfo");
	            	data=rs.getString("data");
				}
				resJson.put("msg", msg);
				resJson.put("data", data);	
			}	
		} catch(Exception e) {
			e.printStackTrace();
			resJson.put("result","false");
		}
	}
}
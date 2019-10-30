package dao;

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
		int behaviour = reqJson.getInteger("behaviour");
		String friendaccount = reqJson.getString("friendaccount");
		String account = reqJson.getString("account");
		User user = new User(account);
		School school = new School(account);
		Own own = new Own(user.getId());
		switch(behaviour) {
		//查询聊天记录
		case 0:
			Statement ps = C3P0Util.getConnection().prepareStatement("SELECT account,friendaccount,chatinfo FROM chatfriends WHERE account=? and friendaccount=?");
			ps.setString(1, account);
			ps.setString(2, friendaccount);
			ResultSet rs = ps.executeQuery();
			String chatinfo="";
			while(rs.next()){
            	//读取数据
            	chatinfo=rs.getString("chatinfo");
			}
			resJson.put("chatinfo", chatinfo);		
		}	
	}
}
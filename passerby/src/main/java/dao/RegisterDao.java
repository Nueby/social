package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.PreparedStatement;
import com.alibaba.fastjson.JSONObject;
import util.C3P0;
import util.MD5;
import util.StaticData;

/**
 * 
 * @author ylr
 *
 */
public class RegisterDao {
	public static JSONObject register(JSONObject json) {
		try {
			String address0 = null;		//学校教务系统
			if(json.getString("school").equals("广东金融学院")) {
				address0 = "http://jwxt.gduf.edu.cn/app.do";
			} else if(json.getString("school").equals("深圳技术大学")) {
				address0 = "http://isea.sztu.edu.cn/app.do";
			} else {
				address0 = "http://jwxt.gduf.edu.cn/app.do";
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
			JSONObject resJson = JSONObject.parseObject(sb.toString());
			resJson.put("account", json.get("xh"));
			resJson.put("password",json.get("password"));
			resJson.put("edupassword", json.getString("pwd"));
			createAccount(resJson);
			return resJson;
		} catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	//创建账号
	private static void createAccount(JSONObject json) {
		try {
			if(json.getString("flag").equals("1")) {
				String account = json.getString("account");
				String password = json.getString("password");
				String edupassword = json.getString("edupassword");
				int id = StaticData.getNextId(0);
				//user表
				PreparedStatement ps = C3P0.getConnection().prepareStatement("INSERT INTO user(id,account, password, edupassword) values(?,?,?,?)");
				ps.setInt(1, id);
				ps.setString(2, account);
				ps.setString(3, MD5.getMD5(password));
				ps.setString(4, MD5.getMD5(edupassword));
				if(!ps.execute()) json.put("result",false);
				//school表
				ps = C3P0.getConnection().prepareStatement("INSERT INTO school(id,account) values(?,?)");
				ps.setInt(1, id);
				ps.setString(2, account);
				if(!ps.execute()) json.put("result",false);
				//own表
				String path = StaticData.class.getClassLoader().getResource("./").getPath();
				//头像	
				String headDir = path + "head/";		//文件夹路径
				File dir = new File(headDir);
				if(!dir.exists()) dir.mkdir();
				String head = (headDir + account + ".png").replace("\\", "/");
				//个人圈图片
				String picture = (path + "ownPicture/" + account + "/").replace("\\", "/");	//文件夹路径
				File dir2 = new File(picture);
				if(!dir2.exists()) dir.mkdirs();
				ps = C3P0.getConnection().prepareStatement("INSERT INTO own(id,head,good,picture) values(?,?,?,?)");
				ps.setInt(1, id);
				ps.setString(2,head);
				ps.setInt(3, 0);
				ps.setString(4, picture);
				if(!ps.execute()) json.put("result", false);
				ps.close();
				json.put("result",true);
			} else {
				json.put("result",false);
			}
		} catch(Exception e) {
			e.printStackTrace();
			json.put("result",false);
		}
	}
}

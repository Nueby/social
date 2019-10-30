package dao;

import java.io.*;
import java.net.URLEncoder;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import bean.*;
import util.C3P0Util;
import util.MD5;

/**
 * 
 * @author ylr
 *
 */
@SuppressWarnings("restriction")
public class UserDao {
	/**
	 * 
	 * @param reqJson - 请求json数据
	 * @param resJson - 响应json数据
	 */
	public static void doPost(JSONObject reqJson, JSONObject resJson) {
		try {
			int behaviour = reqJson.getInteger("behaviour");
			String account = reqJson.getString("account");
			User user = new User(account);
			School school = new School(account);
			Own own = new Own(user.getId());
			switch(behaviour) {
			//忘记密码
			case 0:
					user.setPassword(MD5.getMD5(reqJson.getString("password")));
					if(!user.update()) resJson.put("result","database");
					resJson.put("result", "true");
				break;
			//更改头像
			case 1:
				File f = new File(own.getHead());
				BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(f));
				String head0 = reqJson.getString("head").replaceAll("%2F","/").replaceAll("%2B", "+");
				byte[] head = new BASE64Decoder().decodeBuffer(head0);
				out.write(head);
				out.close();
				resJson.put("result", "true");
				break;
			//更改个人圈图片和个人圈信息
			case 2:
				String path = own.getPicture();
				path = path + account + "/" + reqJson.getInteger("ify") + ".png";
				File picture = new File(path);
				BufferedOutputStream outPicture = new BufferedOutputStream(new FileOutputStream(picture));
				String picture0 = reqJson.getString("picture").replaceAll("%2F","/").replaceAll("%2B", "+");
				byte[] pictureBin = new BASE64Decoder().decodeBuffer(picture0);
				outPicture.write(pictureBin);
				outPicture.close();
				own.setInfo(reqJson.getString("info"));
				own.update();
				resJson.put("result", "true");
				break;
			//修改个人信息
			case 3:
				if(reqJson.getString("sex").equals("男")) {
					school.setSex("m");
				} else {
					school.setSex("n");
				}
				own.setFakename(reqJson.getString("fakename"));
				own.setBirthday(reqJson.getString("birthday"));
				school.update();
				own.update();
				resJson.put("result", "true");
				break;
			//修改邮箱
			case 4:
				school.setEmail(reqJson.getString("email"));
				school.update();
				resJson.put("result", "true");
				break;
			//修改密码
			case 5:
				String md5password = MD5.getMD5(reqJson.getString("password"));
				String md5oldPassword = MD5.getMD5(reqJson.getString("oldpassword"));
				if(md5oldPassword.equals(user.getPassword())) {
					user.setPassword(md5password);
					user.update();
					resJson.put("result", "true");
				} else {
					resJson.put("result","password");
				}
				break;
			//修改个性签名
			case 6:
				own.setSinglesex(reqJson.getString("singlesex"));
				own.update();
				resJson.put("result", "true");
				break;
			//修改标签
			case 7:
				own.setTags(reqJson.getString("tags"));
				own.update();
				PreparedStatement ps = C3P0Util.getConnection().prepareStatement("DELETE FROM tags WHERE id=?");
				ps.setInt(1, user.getId());
				ps.executeQuery();
				C3P0Util.release(ps);
				String[] tags = reqJson.getString("tags").split("&");
				for(String tag : tags) {
					new Tags(user.getId(), tag).insert();
				}
				resJson.put("result", "true");
			//账号邮箱匹配
			case 8:
				if(school.getEmail().equals(reqJson.getString("email"))) {
					resJson.put("result", "email");
				} else {
					resJson.put("result","noemail");
				}
				break;
			//添加好友
			//发送好友请求
			case 9:
				
			//接受好友请求
			case 10:	
				String friendaccount = reqJson.getString("friendaccount");
				
				PreparedStatement ps1 = C3P0Util.getConnection().prepareStatement("update own set friendid=? where id=?");
				ps1.setString(1, account);
				ps1.setString(2, friendaccount);
				ps1.executeQuery();
				C3P0Util.release(ps1);
			}
			
		} catch(Exception e) {
			e.printStackTrace();
			resJson.put("result","false");
		}
	}
	
	/**
	 * 
	 * @param reqJson - 请求json数据
	 * @param resJson - 响应json数据
	 */
	public static void doGet(JSONObject reqJson, JSONObject resJson) {
		try {
			int behaviour = reqJson.getInteger("behaviour");
			String account = reqJson.getString("account");
			User user = new User(account);
			School school = new School(account);
			Own own = new Own(user.getId());
			switch(behaviour) {
			//检查账号是否存在
			case 0:
				PreparedStatement ps = C3P0Util.getConnection().prepareStatement("SELECT account FROM user WHERE account=?");
				ps.setString(1, account);
				ResultSet rs = ps.executeQuery();
				rs.beforeFirst();
				if(!rs.next()) resJson.put("result", "account");
				resJson.put("result", "true");
				C3P0Util.release(rs);
				C3P0Util.release(ps);
				break;
			//获取信息
			case 1:
				resJson.put("fakename",own.getFakename());
				//头像
				File f = new File(own.getHead());
				if(f.exists()) {
					BufferedInputStream in = new BufferedInputStream(new FileInputStream(f));
					byte[] head = new byte[in.available()];
					in.read(head);
					in.close();
					String base64 = new BASE64Encoder().encode(head);
					resJson.put("head",base64);
				} else {		//无头像
					resJson.put("head", "");
				}
				resJson.put("school", school.getSchool());
				resJson.put("college", school.getCollege());
				resJson.put("major",school.getMajor());
				resJson.put("singlesex",own.getSinglesex());
				resJson.put("tags", own.getTags());
				resJson.put("info", own.getInfo());	
				String sex = school.getSex();
				if(sex.equals("m")) resJson.put("sex", "男");
				else resJson.put("sex","女");
				resJson.put("result", "true");
				break;
			//获取个人圈图片
			case 2:
				String path = own.getPicture();
				File dir = new File(path);
				File[] pictures = dir.listFiles();
				JSONArray json = new JSONArray();
				for(File ftemp : pictures) {
					BufferedInputStream in = new BufferedInputStream(new FileInputStream(ftemp));
					byte[] picture = new byte[in.available()];
					in.read(picture);
					in.close();
					json.add(picture);
				}
				resJson.put("picture", json);
				break;
			//筛选
			case 3:
				StringBuffer tempTags = new StringBuffer();
				tempTags.append("select id from tags full join school on tags.id=tags.id AND");
				//标签
				List<Integer> ids = new LinkedList<Integer>(); 
				String reacherTags = reqJson.getString("tags");
				String[] tagsArr = reacherTags.split("&");
				Statement stmt = C3P0Util.getConnection().createStatement();
				
				for(int i = 0; i < tagsArr.length; i++) {
					tempTags.append("tag=" + URLEncoder.encode(tagsArr[i],"utf-8"));
					if(i != tagsArr.length - 1)	tempTags.append(" AND ");
				}
				//性别
					String reacherSex = reqJson.getString("sex");
					if(reacherSex!="") {
						tempTags.append("AND sex=" + URLEncoder.encode(reacherSex,"utf-8") );
					}
					
				//学校
					String reacherSchool = reqJson.getString("school");
					if(reacherSchool!="") {
						tempTags.append("AND school=" + URLEncoder.encode(reacherSchool,"utf-8") );
					}
					
				//学院
					String reacherCollege = reqJson.getString("college");
					if(reacherCollege!="") {
						tempTags.append("AND college=" + reacherCollege );
					}
				ResultSet rs3 = stmt.executeQuery(tempTags.toString());
				rs3.last();
				int rows = rs3.getRow();
				if(rows != 0) {
					int targetId;
					while(true) {
						int rand = new Random().nextInt(rows);
						rs3.absolute(rand);
						targetId = rs3.getInt(1);
						if(targetId != user.getId() || rows == 1) break;
					}
					C3P0Util.release(rs3);
					School school3 = new School(targetId);
					Own own3 = new Own(targetId);
					resJson.put("fakename", own3.getFakename());
					resJson.put("school", school3.getSchool());
					resJson.put("major", school3.getMajor());
					resJson.put("singlesex", own3.getSinglesex());
					resJson.put("tags", own3.getTags());
					resJson.put("info", own3.getInfo());
					resJson.put("account", school3.getAccount());
					resJson.put("result", "true");
				} else {
					resJson.put("result", "people");
				}
				break;
			//账号验证
			case 4:
				if(MD5.getMD5(reqJson.getString("password")).equals(user.getPassword())) resJson.put("result","true");
				else resJson.put("result","password");
				break;
			//获取好友
			case 5:
				PreparedStatement ps1 = C3P0Util.getConnection().prepareStatement("SELECT friendid FROM own WHERE id=?");
				ps1.setString(1, account);
				ResultSet rs1 = ps1.executeQuery();
				String friendaccount="";
				 while(rs1.next()){
		            	//读取数据
		            	friendaccount=rs1.getString("friendid");
				 }
				 resJson.put("friendid", friendaccount);	
				 C3P0Util.release(rs1);
			}		
		} catch(Exception e) {
			e.printStackTrace();
			resJson.put("result", "database");
		}
	}
}

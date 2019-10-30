package dao;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Random;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;
import util.C3P0;
import util.MD5;

/**
 * 
 * @author ylr
 *
 */
public class UserDao {
	//检查账号是否存在
	public static boolean isExist(String account) {
		try {
			PreparedStatement ps = C3P0.getConnection().prepareStatement("SELECT account FROM user WHERE account=?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			boolean result = !rs.isAfterLast();
			rs.close();
			ps.close();
			return result;
		} catch (SQLException e) {
			e.printStackTrace();
			return true;
		}
	}
	
	//获取信息
	public static JSONObject getInfo(String account) {
		JSONObject json = new JSONObject();
		try {
			PreparedStatement ps = C3P0.getConnection().prepareStatement("SELECT fakename, head, school, college, major, singlesex, tags, info, sex FROM user, school, own WHERE user.id = school.id AND school.id = own.id AND account = ?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			json.put("fakename", URLDecoder.decode(rs.getString(1),"utf-8"));
			//头像
			File f = new File(rs.getString(2));
			if(f.exists()) {
				BufferedInputStream in = new BufferedInputStream(new FileInputStream(f));
				byte[] head = new byte[in.available()];
				in.read(head);
				in.close();
				String base64 = new BASE64Encoder().encode(head);
				json.put("head",base64);
			} else {		//无头像
				json.put("head", "");
			}
			json.put("school", URLDecoder.decode(rs.getString(3),"utf-8"));
			json.put("college",URLDecoder.decode(rs.getString(4),"utf-8"));
			json.put("major",URLDecoder.decode(rs.getString(5),"utf-8"));
			json.put("singlesex",URLDecoder.decode(rs.getString(6),"utf-8"));
			json.put("tags", URLDecoder.decode(rs.getString(7),"utf-8"));
			json.put("info", URLDecoder.decode(rs.getString(8),"utf-8"));
			String sex = rs.getString(9);
			if(sex.equals("m")) json.put("sex", "男");
			else json.put("sex", "女");
			json.put("result", "true");
		} catch(Exception e) {
			e.printStackTrace();
			json.put("result","false");
		}
		return json;
	}
	
	//获取个人圈图片
	public static JSONObject getOwnPic(String account) {
		JSONObject json = new JSONObject();
		try {
			PreparedStatement ps = C3P0.getConnection().prepareStatement("SELECT picture FROM own WHERE account=?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			String path = rs.getString(1);
			File dir = new File(path);
			File[] pictures = dir.listFiles();
			JSONArray jsonArr = new JSONArray();
			for(File ftemp : pictures) {
				BufferedInputStream in = new BufferedInputStream(new FileInputStream(ftemp));
				byte[] picture = new byte[in.available()];
				in.read(picture);
				in.close();
				String base64 = new BASE64Encoder().encode(picture);
				JSONObject temp = new JSONObject();
				temp.put("picture", base64);
				jsonArr.add(temp);
			}
			json.put("picture", jsonArr);
		} catch(Exception e) {
			e.printStackTrace();
		}
		return json;
	}
	
	//筛选
	public static JSONObject reacher(String account, String tags) {
		JSONObject json = new JSONObject();
		try {
			String reacherTags = tags;
			String[] tagsArr = reacherTags.split("&");
			Statement stmt = C3P0.getConnection().createStatement();
			StringBuffer tempTags = new StringBuffer();
			tempTags.append("SELECT id, account FROM tags WHERE");
			for(int i = 0; i < tagsArr.length; i++) {
				tempTags.append("tag=" + URLEncoder.encode(tagsArr[i],"utf-8"));
				if(i != tagsArr.length - 1)	tempTags.append(" AND ");
			}
			ResultSet rs = stmt.executeQuery(tempTags.toString());
			rs.last();
			int rows = rs.getRow();
			if(rows != 0) {
				String targetAccount;
				while(true) {
					int rand = new Random().nextInt(rows);
					rs.absolute(rand);
					targetAccount = rs.getString(2);
					if(!targetAccount.equals(account) || rows == 1) break;
				}
				rs.close();
				stmt.close();
				json = getInfo(targetAccount);
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
		return json;
	}
	
	//密码验证
	public static boolean passwordConfirm(String account, String password) {
		String dbpassword = null;
		try {
			PreparedStatement ps = C3P0.getConnection().prepareStatement("SELCET passsword FROM user WHERE account=?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			dbpassword = rs.getString(1);
			return MD5.getMD5(password).equals(dbpassword);
		} catch(Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	
	//忘记密码
	public static JSONObject forgetPassowrd(String account, String email, String password) {
		JSONObject json = new JSONObject();
		try {
			PreparedStatement ps = C3P0.getConnection().prepareStatement("SELECT email, password FROM school, user WHERE account=?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			String dbemail = rs.getString(1);
			rs.close();
			ps.close();
			if(!dbemail.equals(email)) json.put("result", "email");
			else {
				ps = C3P0.getConnection().prepareStatement("UPDATE user SET password=? WHERE account=?");
				ps.setString(1, MD5.getMD5(password));
				ps.setString(2, account);
				if(!ps.execute()) json.put("result", "database");
				else json.put("result","true");
				ps.close();
			}
		} catch(Exception e) {
			json.put("result", "database");
			e.printStackTrace();
		}
		return json;
	}
	
	//更改头像
	public static boolean changeHead(String account, String headBase64) {
		try {
			PreparedStatement ps = C3P0.getConnection().prepareStatement("SELECT head FROM user, own WHERE user.id = own.id AND account = ?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			File f = new File(rs.getString(1));
			BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(f));
			String head0 = headBase64.replaceAll("%2F","/").replaceAll("%2B", "+");
			byte[] head = new BASE64Decoder().decodeBuffer(head0);
			out.write(head);
			out.close();
			rs.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//更改个人圈图片和个人圈信息
	public static boolean changeOwn(String account, String pictureBase64, int ify, String info) {
		try {
			PreparedStatement ps = C3P0.getConnection().prepareStatement("SELECT picture FROM own WHERE account=?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			String path = rs.getString(1);
			rs.close();
			ps.close();
			path = path + account + "/" + ify + ".png";
			File picture = new File(path);
			BufferedOutputStream outPicture = new BufferedOutputStream(new FileOutputStream(picture));
			String picture0 = pictureBase64.replaceAll("%2F","/").replaceAll("%2B", "+");
			byte[] pictureBin = new BASE64Decoder().decodeBuffer(picture0);
			outPicture.write(pictureBin);
			outPicture.close();
			ps = C3P0.getConnection().prepareStatement("UPDATE own SET info=? WHERE account=?");
			ps.setString(1, info);
			ps.setString(2, account);
			ps.execute();
			ps.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//修改邮箱
	public static boolean changeEmail(String account, String email) {
		try {
			PreparedStatement ps = C3P0.getConnection().prepareStatement("UPDATE school SET email=? WHERE account=?");
			ps.setString(1, email);
			ps.setString(2, account);
			return ps.execute();
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//修改密码
	public static boolean changePassword(String account, String password, String oldpassword) {
		try {
			String md5password = MD5.getMD5(password);
			String md5oldpassword = MD5.getMD5(oldpassword);
			PreparedStatement ps = C3P0.getConnection().prepareStatement("SELECT password FROM user WHERE account=?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			if(!rs.getString(1).equals(md5oldpassword)) {
				PreparedStatement ps1 = C3P0.getConnection().prepareStatement("UPDATE user SET password=? WHERE account=?");
				ps1.setString(1, md5password);
				ps1.setString(2, account);
				ps1.execute();
				ps1.close();
				rs.close();
				ps.close();
				return true;
			} else {
				rs.close();
				ps.close();
				return false;
			}
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//修改个人信息
	public static boolean changePersonal(String account, String sex, String fakename, String birthday) {
		try {
			PreparedStatement ps = C3P0.getConnection().prepareStatement("UPDATE school, own SET sex=?, fakename=?, birthday=? WHERE school.id = own.id AND account=?");
			if(sex.equals("男")) ps.setString(1, "m");
			else ps.setString(1, "f");
			ps.setString(2, fakename);
			ps.setString(3, birthday);
			ps.setString(4, account);
			ps.execute();
			ps.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//修改个性签名
	public static boolean changeSinglesex(String account, String singlesex) {
		try {
			PreparedStatement ps = C3P0.getConnection().prepareStatement("UPDATE own SET singlesex=? WHERE account=?");
			ps.setString(1, singlesex);
			ps.setString(2, account);
			ps.execute();
			ps.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//修改标签
	public static boolean changeTags(String account, String tags) {
		try {
			PreparedStatement ps = C3P0.getConnection().prepareStatement("SELECT id FROM user WHERE account=?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			int id = rs.getInt(1);
			rs.close();
			ps.close();
			ps = C3P0.getConnection().prepareStatement("DELECT FROM tags WHERE id=?");
			ps.setInt(1, id);
			ps.execute();
			ps.close();
			ps = C3P0.getConnection().prepareStatement("UPDATE own SET tags=? WHERE id=?");
			ps.setString(1, tags);
			ps.setInt(2, id);
			ps.execute();
			ps.close();
			String[] tagsArr = tags.split("&");
			ps = C3P0.getConnection().prepareStatement("INSERT INTO tags(id,tag) VALUES(?,?)");
			ps.setInt(1, id);
			for(String tag : tagsArr) {
				ps.setString(2, tag);
				ps.execute();
			}
			ps.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
}

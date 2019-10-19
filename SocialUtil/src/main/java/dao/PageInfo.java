package dao;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.codec.binary.Base64;
import util.C3P0Util;

/**
 * pageinfo表
 * @author ylr
 *
 */
public class PageInfo {
	private PreparedStatement pstmt = null;
	
	private Integer id = null;		//标识
	private String url = null;		//头像位置
	
	public PageInfo(int id) {
		this.id = id;
		url = this.getClass().getResource("./").getPath() + "head/" + id + ".png";
	}
	
	/**
	 * 创建修改记录
	 * @param isCreate - 是否创建
	 * @param username - 昵称
	 * @param head - 头像
	 * @param signature - 个性签名
	 * @param birthday - 生日
	 * @param tags - 标签
	 * @param circleInfo - 个人圈信息
	 * @param circleImg - 个人圈图片
	 * @return 是否创建修改成功
	 */
	public boolean changeInfo(boolean isCreate, String username, String head, String signature, String birthday, String tags, String circleInfo, String circleImg) {
		try {
			if(isCreate) pstmt = C3P0Util.getConnection().prepareStatement("INSERT INTO pageinfo(id,account,username,head,signature,birthday,tags,circle_info,circle_img) values(?,?,?,?,?,?,?,?,?)");
			else pstmt = C3P0Util.getConnection().prepareStatement("UPDATE pageinfo SET id=?, account=?, username=?, head=?, signature=?, birthday=?, tags=?, circle_info=?, circle_img=? WHERE id=" + id);
			//头像
			if(!setPicture(head)) return false;
			pstmt.setInt(1, id);
			pstmt.setString(2, User.getAccount(id));
			pstmt.setString(3, username);
			pstmt.setString(4, url);
			pstmt.setString(5, signature);
			pstmt.setString(6, birthday);
			pstmt.setString(7, tags);
			pstmt.setString(8, circleInfo);
			pstmt.setString(9, circleImg);
			pstmt.execute();
			C3P0Util.release(pstmt);
			return true;
		} catch (SQLException e) {
			return false;
		}	
	}
	
	/**
	 * 获取记录
	 * @return 信息映射
	 */
	public Map<String, Object> getInfo() {
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			Statement stmt = C3P0Util.getConnection().createStatement();
			ResultSet rs = stmt.executeQuery("SELECT * FROM pageinfo WHERE id=" + id);
			rs.next();
			ResultSetMetaData rsmd = rs.getMetaData();
			for(int i = 1; i <= rsmd.getColumnCount(); i++) {
				map.put(rsmd.getColumnLabel(i), rs.getObject(i));
			}
			C3P0Util.release(rs);
			C3P0Util.release(stmt);
			map.put("head", getPicture());
			return map;
		} catch (SQLException e) {
			return null;
		}	
	}
	
	//设置头像
	private boolean setPicture(String base64) {
		String picture = base64.replaceAll("%2F", "/").replaceAll("%2B", "+");
		byte[] pictureByte = Base64.decodeBase64(picture);
		try {
			BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(url));
			out.write(pictureByte);
			out.close();
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
	//获取头像
	private String getPicture() {
		try {
			File f = new File(url);		//图片文件
			if(f.exists()) {		//图片存在
				BufferedInputStream in = new BufferedInputStream(new FileInputStream(f));
				byte[] picture = new byte[in.available()];
				in.read(picture);
				in.close();
				String base64 = Base64.encodeBase64String(picture);
				return base64;
			}
		} catch(Exception e) {
			return "";
		}
		return "";
	}
}

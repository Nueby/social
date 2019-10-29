package bean;

import java.net.URLDecoder;
import java.sql.*;
import util.C3P0Util;

/**
 * 
 * @author ylr
 *
 */
public class Own {
	private int id;
	private String info;
	private String picture;
	private String tags;
	private String fakename;
	private String birthday;
	private String head;
	private int good;
	private String friendid;
	private String singlesex;
	
	public Own(int id) {
		try {
			PreparedStatement ps = C3P0Util.getConnection().prepareStatement("SELECT * FROM own WHERE id=?");
			ps.setInt(1, id);
			ResultSet rs = ps.executeQuery();
			rs.beforeFirst();
			if(rs.next()) {
				setId(id);
				setInfo(URLDecoder.decode(rs.getString(2),"utf-8"));
				setPicture(rs.getString(3));
				setTags(URLDecoder.decode(rs.getString(4),"utf-8"));
				setFakename(URLDecoder.decode(rs.getString(5),"utf-8"));
				setBirthday(rs.getString(6));
				setHead(rs.getString(7));
				setGood(rs.getInt(8));
				setFriendid(rs.getString(9));
				setSinglesex(URLDecoder.decode(rs.getString(10),"utf-8"));
			} else {
				throw new Exception();
			}
			C3P0Util.release(rs);
			C3P0Util.release(ps);
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	private void setId(int id) {
		this.id = id;
	}
	
	public int getId() {
		return id;
	}
	
	public void setInfo(String info) {
		this.info = info;
	}
	
	public String getInfo() {
		return info;
	}
	
	private void setPicture(String picture) {
		this.picture = picture;
	}
	
	public String getPicture() {
		return picture;
	}
	
	public void setTags(String tags) {
		this.tags = tags;
	}
	
	public String getTags() {
		return tags;
	}
	
	public void setFakename(String fakename) {
		this.fakename = fakename;
	}
	
	public String getFakename() {
		return fakename;
	}
	
	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	
	public String getBirthday() {
		return birthday;
	}
	
	private void setHead(String head) {
		this.head = head;
	}
	
	public String getHead() {
		return head;
	}
	
	public void setGood(int good) {
		this.good = good;
	}
	
	public int getGood() {
		return good;
	}
	
	public void setFriendid(String friendid) {
		this.friendid = friendid;
	}
	
	public String getFriendid() {
		return friendid;
	}
	
	public void setSinglesex(String singlesex) {
		this.singlesex = singlesex;
	}
	
	public String getSinglesex() {
		return singlesex;
	}
	
	public boolean update() {
		try {
			PreparedStatement ps = C3P0Util.getConnection().prepareStatement("UPDATE own SET id=?, info=?, picture=?, tags=?, fakename=?, birthday=?, head=?, good=?, friendid=?, singlesex=? WHERE id=" + id);
			ps.setInt(1, id);
			ps.setString(2, info);
			ps.setString(3, picture);
			ps.setString(4, tags);
			ps.setString(5, fakename);
			ps.setString(6, birthday);
			ps.setString(7, head);
			ps.setInt(8, good);
			ps.setString(9, friendid);
			ps.setString(10, singlesex);
			ps.execute();
			C3P0Util.release(ps);
			return true;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}		
	}
}

package bean;

import java.net.URLDecoder;
import java.sql.*;
import util.C3P0Util;

/**
 * 
 * @author ylr
 *
 */
public class Chat {
	private int chatid;
	private String form;
	private String to;
	private String msg;
	private int state;
	private String date;
	private String illegal;
	
	public Chat(int chatid) {
		try {
			PreparedStatement ps = C3P0Util.getConnection().prepareStatement("SELECT * FROM chat WHERE chatid=?");
			ps.setInt(1, chatid);
			ResultSet rs = ps.executeQuery();
			rs.beforeFirst();
			if(rs.next()) {
				setChatid(chatid);
				setForm(rs.getString(2));
				setTo(rs.getString(3));
				setMsg(URLDecoder.decode(rs.getString(4),"utf-8"));
				setState(rs.getInt(5));
				setDate(rs.getString(6));
				setIllegal(rs.getString(7));
			} else {
				throw new Exception();
			}
			C3P0Util.release(rs);
			C3P0Util.release(ps);
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	public void setChatid(int chatid) {
		this.chatid = chatid;
	}
	
	public int getChatid() {
		return chatid;
	}
	
	public void setForm(String form) {
		this.form = form;
	}
	
	public String getForm() {
		return form;
	}
	
	public void setTo(String to) {
		this.to = to;
	}
	
	public String getTo() {
		return to;
	}
	
	public void setMsg(String msg) {
		this.msg = msg;
	}
	
	public String getMsg() {
		return msg;
	}
	
	public void setState(int state) {
		this.state = state;
	}
	
	public int getState() {
		return state;
	}
	
	public void setDate(String date) {
		this.date = date;
	}
	
	public String getDate() {
		return date;
	}
	
	public void setIllegal(String illegal) {
		this.illegal = illegal;
	}
	
	public String getIllegal() {
		return illegal;
	}
	
	public boolean update() {
		try {
			PreparedStatement ps = C3P0Util.getConnection().prepareStatement("UPDATE chat SET chatid=?, form=?, to=?, msg=?, state=? WHERE chatid=" + chatid);
			ps.setInt(1, chatid);
			ps.setString(2, form);
			ps.setString(3, to);
			ps.setString(4, msg);
			ps.setInt(5, state);
			ps.setString(6, date);
			ps.setString(7, illegal);
			ps.execute();
			C3P0Util.release(ps);
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
}

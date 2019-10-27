package bean;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import util.C3P0Util;

/**
 * 
 * @author ylr
 *
 */
public class User {
	private int id;
	private String account;
	private String password;
	private String edupassword;
	
	public User(int id) {
		try {
			PreparedStatement ps = C3P0Util.getConnection().prepareStatement("SELECT * FROM user WHERE id=?");
			ps.setInt(1, id);
			ResultSet rs = ps.executeQuery();
			rs.beforeFirst();
			if(rs.next()) {
				setId(id);
				setAccount(rs.getString(2));
				setPassword(rs.getString(3));
				setEdupassword(rs.getString(4));
			} else {
				throw new Exception();
			}
			C3P0Util.release(rs);
			C3P0Util.release(ps);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public User(String account) {
		try {
			PreparedStatement ps = C3P0Util.getConnection().prepareStatement("SELECT * FROM user WHERE account=?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.beforeFirst();
			if(rs.next()) {
				setId(rs.getInt(1));
				setAccount(account);
				setPassword(rs.getString(3));
				setEdupassword(rs.getString(4));
			} else {
				throw new Exception();
			}
			C3P0Util.release(rs);
			C3P0Util.release(ps);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public int getId() {
		return id;
	}
	
	public void setAccount(String account) {
		this.account = account;
	}
	
	public String getAccount() {
		return account;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setEdupassword(String edupassword) {
		this.edupassword = edupassword;
	}
	
	public String getEdupassword() {
		return edupassword;
	}
	
	public boolean update() {
		try {
			PreparedStatement ps = C3P0Util.getConnection().prepareStatement("UPDATE user SET id=?, account=?, password=?, edupassword=? WHERE id=" + id);
			ps.setInt(1, id);
			ps.setString(2, account);
			ps.setString(3, password);
			ps.setString(4, edupassword);
			ps.execute();
			C3P0Util.release(ps);
			return true;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}		
	}
}

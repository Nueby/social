package bean;

import java.net.URLDecoder;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import util.C3P0Util;

/**
 * 
 * @author ylr
 *
 */
public class School {
	private int id;
	private String school;
	private String college;
	private String major;
	private String account;
	private String email;
	private String phone;
	private String sex;
	private String name;
	
	public School(int id) {
		try {
			PreparedStatement ps = C3P0Util.getConnection().prepareStatement("SELECT * FROM school WHERE id=?");
			ps.setInt(1, id);
			ResultSet rs = ps.executeQuery();
			rs.beforeFirst();
			if(rs.next()) {
				setId(id);
				setSchool(URLDecoder.decode(rs.getString(2),"utf-8"));
				setCollege(URLDecoder.decode(rs.getString(3),"utf-8"));
				setMajor(URLDecoder.decode(rs.getString(4),"utf-8"));
				setAccount(rs.getString(5));
				setEmail(rs.getString(6));
				setPhone(rs.getString(7));
				setSex(rs.getString(8));
				setName(URLDecoder.decode(rs.getString(9),"utf-8"));
			} else {
				throw new Exception();
			}
			C3P0Util.release(rs);
			C3P0Util.release(ps);
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	public School(String account) {
		try {
			PreparedStatement ps = C3P0Util.getConnection().prepareStatement("SELECT * FROM school WHERE account=?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.beforeFirst();
			if(rs.next()) {
				setId(rs.getInt(1));
				setSchool(URLDecoder.decode(rs.getString(2),"utf-8"));
				setCollege(URLDecoder.decode(rs.getString(3),"utf-8"));
				setMajor(URLDecoder.decode(rs.getString(4),"utf-8"));
				setAccount(account);
				setEmail(rs.getString(6));
				setPhone(rs.getString(7));
				setSex(rs.getString(8));
				setName(URLDecoder.decode(rs.getString(9),"utf-8"));
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
	
	public void setSchool(String school) {
		this.school = school;
	}
	
	public String getSchool() {
		return school;
	}
	
	public void setCollege(String college) {
		this.college = college;
	}
	
	public String getCollege() {
		return college;
	}
	
	public void setMajor(String major) {
		this.major = major;
	}
	
	public String getMajor() {
		return major;
	}
	
	private void setAccount(String account) {
		this.account = account;
	}
	
	public String getAccount() {
		return account;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getEmail() {
		return email;
	}
	
	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	public String getPhone() {
		return phone;
	}
	
	public void setSex(String sex) {
		this.sex = sex;
	}
	
	public String getSex() {
		return sex;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}
	
	public boolean update() {
		try {
			PreparedStatement ps = C3P0Util.getConnection().prepareStatement("UPDATE school SET id=?, school=?, college=?, major=?, account=?, email=?, phone=?, sex=?, name=? WHERE id=" + id);
			ps.setInt(1, id);
			ps.setString(2, school);
			ps.setString(3, college);
			ps.setString(4, major);
			ps.setString(5, account);
			ps.setString(6, email);
			ps.setString(7, phone);
			ps.setString(8, sex);
			ps.setString(9, name);
			ps.execute();
			C3P0Util.release(ps);
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
}

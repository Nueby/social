package dao;

import java.security.NoSuchAlgorithmException;
import java.sql.*;
import util.C3P0Util;
import util.MD5;

/**
 * 
 * @author ylr
 * user表
 *
 */
public class User {
	private PreparedStatement pstmt = null;
	
	private static int totalId = 0;
	static{
		try {
			Statement stmt = C3P0Util.getConnection().createStatement();
			ResultSet rs = stmt.executeQuery("SELECT * FROM user");
			rs.beforeFirst();
			while(rs.next()) {
				totalId = rs.getInt(1) + 1;
			};
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	//用户属性
	private String account = null;
	private String loginPassword = null;
	private String eduPassword = null;
	private String email = null;
	
	public static int getTotalId() {
		return totalId;
	}
	
	/**
	 * 
	 * @param account - 账号
	 */
	public User(String account) {
		this.account = account;
	}
	
	/**
	 * 
	 * @param account - 账号
	 * @param email - 邮箱
	 */
	public User(String account, String email) {
		this(account);
		this.email = email;
	}
	
	/**
	 * 获取id
	 * @return id
	 * @throws SQLException 获取id失败
	 */
	public int getId() throws SQLException {
		Statement stmt = C3P0Util.getConnection().createStatement();
		ResultSet rs = stmt.executeQuery("SELECT id FROM user where account=" + account);
		rs.beforeFirst();
		rs.next();
		int id = rs.getInt(1);
		C3P0Util.release(rs);
		C3P0Util.release(stmt);
		return id;
	}
	
	/**
	 * 获取账号
	 * @param id - 标识
	 * @return 用户账号
	 * @throws SQLException  获取用户失败
	 */
	public static String getAccount(int id) throws SQLException {
		Statement stmt = C3P0Util.getConnection().createStatement();
		ResultSet rs = stmt.executeQuery("SELECT account FROM user where id=" + id);
		rs.beforeFirst();
		rs.next();
		String account = rs.getString(1);
		C3P0Util.release(rs);
		C3P0Util.release(stmt);
		return account;
	}
	
	/**
	 * 设置登录密码
	 * @param password - 登录密码
	 * @throws NoSuchAlgorithmException MD5加密失败
	 */
	public void setLoginPassword(String password) throws NoSuchAlgorithmException {
		loginPassword = MD5.getMD5(password);
	}
	
	/**
	 * 
	 * @param password - 教务系统密码
	 * @throws NoSuchAlgorithmException MD5加密失败
	 */
	public void setEduPassword(String password) throws NoSuchAlgorithmException {
		eduPassword = MD5.getMD5(password);
	}
	
	/**
	 * 创建账号
	 * @param loginPassword - 登录密码
	 * @param eduPassword - 教务系统密码
	 * @return 是否注册成功
	 */
	public boolean createAccount(String loginPassword, String eduPassword) {
		try {
			setLoginPassword(loginPassword);
			setEduPassword(eduPassword);
			pstmt = C3P0Util.getConnection().prepareStatement("INSERT INTO user(id, account, login_password, edu_password) values(?,?,?,?)");
			pstmt.setInt(1, totalId);
			pstmt.setString(2, account);
			pstmt.setString(3, this.loginPassword);
			pstmt.setString(4, this.eduPassword);
			pstmt.execute();
			C3P0Util.release(pstmt);
			totalId++;
			return true;
		} catch(Exception e) {
			return false;
		}
	}
	
	/**
	 * 
	 * @param password - 密码
	 * @return 密码是否正确
	 */
	public boolean judgePassword(String password) {
		try {
			String md5p = MD5.getMD5(password);
			Statement stmt = C3P0Util.getConnection().createStatement();
			ResultSet rs = stmt.executeQuery("SELECT login_password FROM user where account=" + account);
			rs.beforeFirst();
			rs.next();
			if(!md5p.equals(rs.getString(1))) {
				C3P0Util.release(rs);
				C3P0Util.release(stmt);
				return false;
			}
			C3P0Util.release(rs);
			C3P0Util.release(stmt);
			return true;
		} catch(Exception e) {
			return false;
		}
	}
	
	/**
	 * 更改登录密码
	 * @param oPassword - 旧密码
	 * @param password - 新密码
	 * @param email - 邮箱
	 * @return 是否更改成功
	 */
	public boolean changeLoginPassword(String oPassword, String password, String email) {
		try {
			if(!judgePassword(oPassword)) return false;
			if(!email.equals(this.email)) return false;
			setLoginPassword(password);
			pstmt = C3P0Util.getConnection().prepareStatement("UPDATE user SET login_password=? WHERE account=" + account);
			pstmt.setString(1, loginPassword);
			pstmt.execute();
			C3P0Util.release(pstmt);
			return true;
		} catch(Exception e) {
			return false;
		}
	}
	
	/**
	 * 更改教务系统密码
	 * @param password - 新密码
	 * @return 是否更改成功
	 */
	public boolean changeEduPassword(String password) {
		try {
			setEduPassword(password);
			pstmt = C3P0Util.getConnection().prepareStatement("UPDATE user SET edu_password=? WHERE account=" + account);
			pstmt.setString(1, eduPassword);
			pstmt.execute();
			C3P0Util.release(pstmt);
			return true;
		} catch(Exception e) {
			return false;
		}
	}
	
	/**
	 * 
	 * @param account - 账号
	 * @return 是否存在
	 */
	public static boolean isExist(String account) {
		try {
			Statement stmt = C3P0Util.getConnection().createStatement();
			ResultSet rs = stmt.executeQuery("SELECT account FROM user");
			rs.beforeFirst();
			while(rs.next()) {
				if(rs.getString(1).equals(account))	{
					C3P0Util.release(rs);
					C3P0Util.release(stmt);
					return true;
				}
			}
			C3P0Util.release(rs);
			C3P0Util.release(stmt);
			return false;
		} catch (SQLException e) {
			return false;
		}
	}
}

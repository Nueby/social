package dao;

import java.io.File;
import java.security.NoSuchAlgorithmException;
import java.sql.*;
import function.C3P0Util;
import function.MD5;

/**
 * 
 * @author ylr
 * user表
 *
 */
public class UserDao {
	private PreparedStatement pstmt = null;
	
	private static int totalId = 0;
	
	//用户属性
	private Integer id = null;
	private Integer account = null;
	private String password = null;
	private Integer phone = null;
	private String email = null;
	private String sex = null;
	private String position = null;
	private Integer age = null;
	private String hobby = null;
	private String head = null;
	private String tags = null;
	
	//是否是新账号
	private boolean isNew = true;
	
	//是否已经装载数据
	private boolean isLoad = false;
	
	/**
	 * 创建user表封装对象
	 * @param account - 账号
	 * @param isNew	- 是否新账号
	 */
	public UserDao(int account, boolean isNew) {
		this.account = account;
		this.isNew = isNew;
	}
	
	/**
	 * 设置新账号信息
	 * @param password - 密码
	 * @throws NoSuchAlgorithmException MD5加密失败
	 * @throws UnsupportedOperationException 老用户不支持操作
	 */
	public void setCreateInfo(String password) throws NoSuchAlgorithmException, UnsupportedOperationException {
		if(isNew) {
			totalId++;
			id = totalId;		//用户id
			this.password = MD5.getMD5(password);		//密码MD5加密
		} else {
			throw new UnsupportedOperationException();
		}
	}
	
	/**
	 * 设置新账号信息
	 * @param password - 密码
	 * @param email - 邮箱
	 * @param sex - 性别
	 * @param phone - 电话
	 * @param position - 位置
	 * @param age - 年龄
	 * @param hobby - 爱好
	 * @throws NoSuchAlgorithmException MD5加密失败
	 * @throws UnsupportedOperationException 老用户不支持操作
	 */
	public void setCreateInfo(String password, String email, String sex, int phone, String position, int age, String hobby, String tags) throws NoSuchAlgorithmException, UnsupportedOperationException {
		setCreateInfo(password);
		this.email = email;
		if(sex.equals("男")) {		//将性别男女转成mf
			this.sex = "m";
		} else {
			this.sex = "f";
		}
		this.phone = phone;
		this.position = position;
		this.age = age;
		this.hobby = hobby;
		this.tags = tags;
	}
	
	/**
	 * 确定创建用户
	 * @throws SQLException 数据库连接失败
	 * @throws UnsupportedOperationException 老用户不支持操作或新用户未设置用户信息
	 */
	public void sureCreate() throws SQLException, UnsupportedOperationException {
		if(isSettedInfo() && isNew) {		//是新用户且设置了相关信息
			isNew = false;
			String url = UserDao.class.getClassLoader().getResource("./").getPath() + "head";		//获取存图路径
			url.replace("\\", "/");		//将反斜杠转成斜杠使之可存入数据库中
			File file = new File(url);
			if(!file.exists()) {
				file.mkdir();		//头像文件夹不存在时创建
			}
			head = url + "/" + account + ".png";
			pstmt = C3P0Util.getConnection().prepareStatement("INSERT INTO user(id,account,password,phone,email,sex,position,age,hobby,head,tags) values(?,?,?,?,?,?,?,?,?,?,?)");
			pstmt.setInt(1, id);
			pstmt.setInt(2, account);
			pstmt.setString(3, password);
			pstmt.setInt(4, phone);
			pstmt.setString(5, email);
			pstmt.setString(6, sex);
			pstmt.setString(7, position);
			pstmt.setInt(8, age);
			pstmt.setString(9, hobby);
			pstmt.setString(10, head);
			pstmt.setString(11, tags);
			pstmt.execute();
			C3P0Util.release(pstmt);
		} else {
			throw new UnsupportedOperationException();
		}
	}
	
	//新账号是否设置了信息
	private boolean isSettedInfo() {
		return (password != null && email != null && sex != null);
	}
	
	/**
	 * 装载数据
	 * @throws SQLException	连接数据库失败
	 * @throws UnsupportedOperationException 新用户不支持操作
	 */
	public void loadInfo() throws SQLException, UnsupportedOperationException {
		if(isNew) {
			throw new UnsupportedOperationException();
		} else {
			pstmt = C3P0Util.getConnection().prepareStatement("SELECT * FROM user WHERE account=" + account);
			ResultSet rs = pstmt.executeQuery();
			id = rs.getInt(1);
			account = rs.getInt(2);
			phone = rs.getInt(4);
			email = rs.getString(5);
			sex = rs.getString(6);
			position = rs.getString(7);
			age = rs.getInt(8);
			hobby = rs.getString(9);
			head = rs.getString(10);
			C3P0Util.release(rs);
			C3P0Util.release(pstmt);
			isLoad = true;
		}
	}
	
	public Integer getId() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
		} catch(UnsupportedOperationException e) {
			System.out.println("未加载信息");
		}
		return id;
	}
	
	public Integer getAccount() {
		return account;
	}
	
	public void setPassword(String password) {
		try {
			this.password = MD5.getMD5(password);
		} catch (NoSuchAlgorithmException e) {
			System.out.println("MD5加密失败");
		}
	}
	
	public void setPhone(Integer phone) {
		this.phone = phone;
	}
	
	public Integer getPhone() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
		} catch(UnsupportedOperationException e) {
			System.out.println("未加载信息");
		}
		return phone;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getEmail() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
		} catch(UnsupportedOperationException e) {
			System.out.println("未加载信息");
		}
		return email;
	}
	
	public void setSex(String sex) {
		if(sex.equals("男")) {
			this.sex = "m";
		} else {
			this.sex = "f";
		}
	}
	
	public String getSex() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
		} catch(UnsupportedOperationException e) {
			System.out.println("未加载信息");
		}
		if(sex.equals("m")) {
			return "男";
		} else {
			return "女";
		}
	}
	
	public void setPosition(String position) {
		this.position = position;
	}
	
	public String getPosition() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
		} catch(UnsupportedOperationException e) {
			System.out.println("未加载信息");
		}
		return position;
	}
	
	public void setAge(Integer age) {
		this.age = age;
	}
	
	public Integer getAge() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
		} catch(UnsupportedOperationException e) {
			System.out.println("未加载信息");
		}
		return age;
	}
	
	public void setHobby(String hobby) {
		this.hobby = hobby;
	}
	
	public String getHobby() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
		} catch(UnsupportedOperationException e) {
			System.out.println("未加载信息");
		}
		return hobby;
	}
	
	public String getHead() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
		} catch(UnsupportedOperationException e) {
			System.out.println("未加载信息");
		}
		return head;
	}
	
	public void setTags(String tags) {
		this.tags = tags;
	}
	
	public String getTags() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
		} catch(UnsupportedOperationException e) {
			System.out.println("未加载信息");
		}
		return tags;
	}
	
	/**
	 * 更新用户数据
	 */
	public void updateInfo() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
			pstmt = function.C3P0Util.getConnection().prepareStatement("UPDATE user SET phone=?, email=?, sex=?, position=?, age=?, hobby=?, tags=? WHERE account=" + account);
		} catch(UnsupportedOperationException e) {
			System.out.println("未加载信息");
		} catch(SQLException e) {
			System.out.println("连接数据库失败");
		}
	}
}

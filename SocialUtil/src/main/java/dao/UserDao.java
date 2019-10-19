package dao;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.sql.*;
import java.util.logging.ConsoleHandler;
import java.util.logging.Formatter;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;
import util.C3P0Util;
import util.MD5;
import org.apache.commons.codec.binary.Base64;

/**
 * 
 * @author ylr
 * user表
 *
 */
@Deprecated
public class UserDao {
	private PreparedStatement pstmt = null;
	
	private static int totalId = 0;
	
	//用户属性
	private Integer id = null;
	private String account = null;
	private String password = null;
	private Integer phone = null;
	private String email = null;
	private String sex = null;
	private String position = null;
	private Integer age = null;
	private String hobby = null;
	private String head = null;
	private String tags = null;
	
	//日志
	private Logger log = null;
	private ConsoleHandler consoleHandler = null;
	
	//是否是新账号
	private boolean isNew = true;
	
	//是否已经装载数据
	private boolean isLoad = false;
	
	/**
	 * 创建user表封装对象
	 * @param account - 账号
	 * @param isNew	- 是否新账号
	 */
	public UserDao(String account, boolean isNew) {
		this.account = account;
		this.isNew = isNew;
		//日志设置
		log = Logger.getLogger("social");
		consoleHandler = new ConsoleHandler();
		consoleHandler.setLevel(Level.INFO);
		consoleHandler.setFormatter(new Formatter() {
			@Override
			public String format(LogRecord record) {
				return record.getLevel() + ":" + record.getMessage() + "\n";
			}
		});
		log.addHandler(consoleHandler);
	}
	
	/**
	 * 设置新账号信息
	 * @param password - 密码
	 */
	public void setCreateInfo(String password) {
		try {
			if(isNew) {
				totalId++;
				id = totalId;		//用户id
				this.password = MD5.getMD5(password);		//密码MD5加密
			} else {
				throw new UnsupportedOperationException();
			}
		} catch(NoSuchAlgorithmException e) {
			log.severe("MD5加密失败" + "\n");
			e.getStackTrace();
		} catch(UnsupportedOperationException e) {
			log.severe("老用户不支持操作" + "\n");
			e.getStackTrace();
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
	 */
	public void setCreateInfo(String password, String email, String sex, int phone, String position, int age, String hobby, String tags) {
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
	 */
	public void sureCreate() {
		try {
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
				//pstmt = MySQLConnect.conn.prepareStatement("INSERT INTO user(id,account,password,phone,email,sex,position,age,hobby,head,tags) values(?,?,?,?,?,?,?,?,?,?,?)");
				pstmt.setInt(1, id);
				pstmt.setString(2, account);
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
				//pstmt.close();
				log.info("用户 " + account + " 创建成功" + "\n");
			} else {
				throw new UnsupportedOperationException();
			}
		} catch(SQLException e) {
			log.severe("数据库连接失败" + "\n");
			e.getStackTrace();
		} catch(UnsupportedOperationException e) {
			log.severe("老用户不支持或新用户未设置相关信息");
			e.getStackTrace();
		}
	}
	
	//新账号是否设置了信息
	private boolean isSettedInfo() {
		return (password != null && email != null);
	}
	
	/**
	 * 装载数据
	 */
	public void loadInfo() {
		try {
			if(isNew) {
				throw new UnsupportedOperationException();
			} else {
				pstmt = C3P0Util.getConnection().prepareStatement("SELECT * FROM user WHERE account=" + account);
				ResultSet rs = pstmt.executeQuery();
				id = rs.getInt(1);
				account = rs.getString(2);
				password = rs.getString(3);
				phone = rs.getInt(4);
				email = rs.getString(5);
				sex = rs.getString(6);
				position = rs.getString(7);
				age = rs.getInt(8);
				hobby = rs.getString(9);
				head = rs.getString(10);
				C3P0Util.release(rs);
				C3P0Util.release(pstmt);
				//rs.close();
				//pstmt.close();
				isLoad = true;
			}
		} catch(SQLException e) {
			log.severe("数据库连接失败" + "\n");
			e.getStackTrace();
		} catch(UnsupportedOperationException e) {
			log.severe("新用户不支持操作");
			e.getStackTrace();
		}
	}
	
	public Integer getId() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
		} catch(UnsupportedOperationException e) {
			log.severe("未装载信息" + "\n");
			e.getStackTrace();
		}
		return id;
	}
	
	public String getAccount() {
		return account;
	}
	
	public void setPassword(String password) {
		try {
			this.password = MD5.getMD5(password);
		} catch (NoSuchAlgorithmException e) {
			log.severe("MD5加密失败" + "\n");
			e.getStackTrace();
		}
	}
	
	public String getPassword() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
		} catch(UnsupportedOperationException e) {
			log.severe("未装载信息" + "\n");
			e.getStackTrace();
		}
		return password;
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
			log.severe("未装载信息" + "\n");
			e.getStackTrace();
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
			log.severe("未装载信息" + "\n");
			e.getStackTrace();
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
			log.severe("未装载信息" + "\n");
			e.getStackTrace();
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
			log.severe("未装载信息" + "\n");
			e.getStackTrace();
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
			log.severe("未装载信息" + "\n");
			e.getStackTrace();
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
			log.severe("未装载信息" + "\n");
			e.getStackTrace();
		}
		return hobby;
	}
	
	public String getHead() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
		} catch(UnsupportedOperationException e) {
			log.severe("未装载信息" + "\n");
			e.getStackTrace();
		}
		return head;
	}
	
	public void setPicture(String base64) {
		String picture = base64.replaceAll("%2F", "/").replaceAll("%2B", "+");
		byte[] pictureByte = Base64.decodeBase64(picture);
		try {
			BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(head));
			out.write(pictureByte);
			out.close();
		} catch (FileNotFoundException e) {
			log.severe("未找到文件" + "\n");
			e.getStackTrace();
		} catch (IOException e) {
			log.severe("输入输出异常" + "\n");
			e.getStackTrace();
		}
	}
	
	public String getPicture() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
			File f = new File(head);		//图片文件
			if(f.exists()) {		//图片存在
				BufferedInputStream in = new BufferedInputStream(new FileInputStream(f));
				byte[] picture = new byte[in.available()];
				in.read(picture);
				in.close();
				String base64 = Base64.encodeBase64String(picture);
				return base64;
			}
		} catch(UnsupportedOperationException e) {
			log.severe("未装载信息" + "\n");
			e.getStackTrace();
		} catch(FileNotFoundException e) {
			log.severe("未找到文件" + "\n");
			e.getStackTrace();
		} catch(IOException e) {
			log.severe("输入输出异常" + "\n");
			e.getStackTrace();
		}
		return "";
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
			log.severe("未装载信息" + "\n");
			e.getStackTrace();
		}
		return tags;
	}
	
	/**
	 * 更改用户信息
	 */
	public void changeInfo(Integer phone, String email, String sex, String position, Integer age, String hobby, String tags) {
		setPhone(phone);
		setEmail(email);
		setSex(sex);
		setPosition(position);
		setAge(age);
		setHobby(hobby);
		setTags(tags);
	}
	
	/**
	 * 更新用户数据
	 */
	public void updateInfo() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
			pstmt = util.C3P0Util.getConnection().prepareStatement("UPDATE user SET phone=?, email=?, sex=?, position=?, age=?, hobby=?, tags=? password=? WHERE account=" + account);
			pstmt.setInt(1, phone);
			pstmt.setString(2, email);
			pstmt.setString(3, sex);
			pstmt.setString(4, position);
			pstmt.setInt(5, age);
			pstmt.setString(6, hobby);
			pstmt.setString(7, tags);
			pstmt.setString(8, password);
			pstmt.execute();
			C3P0Util.release(pstmt);
			log.info("用户 " + account + " 修改信息成功");
		} catch(UnsupportedOperationException e) {
			log.severe("未装载信息" + "\n" + e.getStackTrace());
		} catch(SQLException e) {
			log.severe("数据库连接失败" + "\n" + e.getStackTrace());
		}
	}
	
	/**
	 * 
	 * @param oPassword - 旧密码
	 * @return - 是否一致
	 */
	public boolean judgePassword(String oPassword) {
		try {
			return MD5.getMD5(oPassword).equals(password);
		} catch (NoSuchAlgorithmException e) {
			log.severe("MD5加密失败" + "\n");
			e.getStackTrace();
		}
		return false;
	}
	
	/**
	 * 
	 * @return - 是否注册过
	 */
	public boolean isHave() {
		boolean result = false;
		try {
			Statement stmt = C3P0Util.getConnection().createStatement();
			ResultSet rs = stmt.executeQuery("SELECT * FROM user");
			rs.beforeFirst();
			while(rs.next()) {
				if(account.equals(rs.getString(2))) {
					result = true;
					break;
				}
			}
			C3P0Util.release(rs);
			C3P0Util.release(stmt);
		} catch (SQLException e) {
			log.severe("数据库连接失败" + "\n");
			e.getStackTrace();
		}
		return result;
	}
}

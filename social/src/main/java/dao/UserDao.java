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
import function.C3P0Util;
import function.MD5;
import org.apache.commons.codec.binary.Base64;

/**
 * 
 * @author ylr
 * user��
 *
 */
public class UserDao {
	private PreparedStatement pstmt = null;
	
	private static int totalId = 0;
	
	//�û�����
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
	
	//��־
	private Logger log = null;
	private ConsoleHandler consoleHandler = null;
	
	//�Ƿ������˺�
	private boolean isNew = true;
	
	//�Ƿ��Ѿ�װ������
	private boolean isLoad = false;
	
	/**
	 * ����user���װ����
	 * @param account - �˺�
	 * @param isNew	- �Ƿ����˺�
	 */
	public UserDao(int account, boolean isNew) {
		this.account = account;
		this.isNew = isNew;
		//��־����
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
	 * �������˺���Ϣ
	 * @param password - ����
	 */
	public void setCreateInfo(String password) {
		try {
			if(isNew) {
				totalId++;
				id = totalId;		//�û�id
				this.password = MD5.getMD5(password);		//����MD5����
			} else {
				throw new UnsupportedOperationException();
			}
		} catch(NoSuchAlgorithmException e) {
			log.severe("MD5����ʧ��" + "\n" + e.getStackTrace());
		} catch(UnsupportedOperationException e) {
			log.severe("���û���֧�ֲ���" + "\n" + e.getStackTrace());
		}
	}
	
	/**
	 * �������˺���Ϣ
	 * @param password - ����
	 * @param email - ����
	 * @param sex - �Ա�
	 * @param phone - �绰
	 * @param position - λ��
	 * @param age - ����
	 * @param hobby - ����
	 */
	public void setCreateInfo(String password, String email, String sex, int phone, String position, int age, String hobby, String tags) {
		setCreateInfo(password);
		this.email = email;
		if(sex.equals("��")) {		//���Ա���Ůת��mf
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
	 * ȷ�������û�
	 */
	public void sureCreate() {
		try {
			if(isSettedInfo() && isNew) {		//�����û��������������Ϣ
				isNew = false;
				String url = UserDao.class.getClassLoader().getResource("./").getPath() + "head";		//��ȡ��ͼ·��
				url.replace("\\", "/");		//����б��ת��б��ʹ֮�ɴ������ݿ���
				File file = new File(url);
				if(!file.exists()) {
					file.mkdir();		//ͷ���ļ��в�����ʱ����
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
				log.info("�û� " + account + " �����ɹ�" + "\n");
			} else {
				throw new UnsupportedOperationException();
			}
		} catch(SQLException e) {
			log.severe("���ݿ�����ʧ��" + "\n" + e.getStackTrace());
		} catch(UnsupportedOperationException e) {
			log.severe("���û���֧�ֻ����û�δ���������Ϣ" + e.getStackTrace());
		}
	}
	
	//���˺��Ƿ���������Ϣ
	private boolean isSettedInfo() {
		return (password != null && email != null);
	}
	
	/**
	 * װ������
	 */
	public void loadInfo() {
		try {
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
		} catch(SQLException e) {
			log.severe("���ݿ�����ʧ��" + "\n" + e.getStackTrace());
		} catch(UnsupportedOperationException e) {
			log.severe("���û���֧�ֲ���" + e.getStackTrace());
		}
	}
	
	public Integer getId() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
		} catch(UnsupportedOperationException e) {
			log.severe("δװ����Ϣ" + "\n" + e.getStackTrace());
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
			log.severe("MD5����ʧ��" + "\n" + e.getStackTrace());
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
			log.severe("δװ����Ϣ" + "\n" + e.getStackTrace());
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
			log.severe("δװ����Ϣ" + "\n" + e.getStackTrace());
		}
		return email;
	}
	
	public void setSex(String sex) {
		if(sex.equals("��")) {
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
			log.severe("δװ����Ϣ" + "\n" + e.getStackTrace());
		}
		if(sex.equals("m")) {
			return "��";
		} else {
			return "Ů";
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
			log.severe("δװ����Ϣ" + "\n" + e.getStackTrace());
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
			log.severe("δװ����Ϣ" + "\n" + e.getStackTrace());
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
			log.severe("δװ����Ϣ" + "\n" + e.getStackTrace());
		}
		return hobby;
	}
	
	public String getHead() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
		} catch(UnsupportedOperationException e) {
			log.severe("δװ����Ϣ" + "\n" + e.getStackTrace());
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
			log.severe("δ�ҵ��ļ�" + "\n" + e.getStackTrace());
		} catch (IOException e) {
			log.severe("��������쳣" + "\n" + e.getStackTrace());
		}
	}
	
	public String getPicture() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
			File f = new File(head);		//ͼƬ�ļ�
			if(f.exists()) {		//ͼƬ����
				BufferedInputStream in = new BufferedInputStream(new FileInputStream(f));
				byte[] picture = new byte[in.available()];
				in.read(picture);
				in.close();
				String base64 = Base64.encodeBase64String(picture);
				return base64;
			}
		} catch(UnsupportedOperationException e) {
			log.severe("δװ����Ϣ" + "\n" + e.getStackTrace());
		} catch(FileNotFoundException e) {
			log.severe("δ�ҵ��ļ�" + "\n" + e.getStackTrace());
		} catch(IOException e) {
			log.severe("��������쳣" + "\n" + e.getStackTrace());
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
			log.severe("δװ����Ϣ" + "\n" + e.getStackTrace());
		}
		return tags;
	}
	
	/**
	 * �����û���Ϣ
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
	 * �����û�����
	 */
	public void updateInfo() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
			pstmt = function.C3P0Util.getConnection().prepareStatement("UPDATE user SET phone=?, email=?, sex=?, position=?, age=?, hobby=?, tags=? WHERE account=" + account);
			log.info("�û� " + account + " �޸���Ϣ�ɹ�");
		} catch(UnsupportedOperationException e) {
			log.severe("δװ����Ϣ" + "\n" + e.getStackTrace());
		} catch(SQLException e) {
			log.severe("���ݿ�����ʧ��" + "\n" + e.getStackTrace());
		}
	}
}

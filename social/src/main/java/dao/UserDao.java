package dao;

import java.io.File;
import java.security.NoSuchAlgorithmException;
import java.sql.*;
import function.C3P0Util;
import function.MD5;

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
	}
	
	/**
	 * �������˺���Ϣ
	 * @param password - ����
	 * @throws NoSuchAlgorithmException MD5����ʧ��
	 * @throws UnsupportedOperationException ���û���֧�ֲ���
	 */
	public void setCreateInfo(String password) throws NoSuchAlgorithmException, UnsupportedOperationException {
		if(isNew) {
			totalId++;
			id = totalId;		//�û�id
			this.password = MD5.getMD5(password);		//����MD5����
		} else {
			throw new UnsupportedOperationException();
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
	 * @throws NoSuchAlgorithmException MD5����ʧ��
	 * @throws UnsupportedOperationException ���û���֧�ֲ���
	 */
	public void setCreateInfo(String password, String email, String sex, int phone, String position, int age, String hobby, String tags) throws NoSuchAlgorithmException, UnsupportedOperationException {
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
	 * @throws SQLException ���ݿ�����ʧ��
	 * @throws UnsupportedOperationException ���û���֧�ֲ��������û�δ�����û���Ϣ
	 */
	public void sureCreate() throws SQLException, UnsupportedOperationException {
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
		} else {
			throw new UnsupportedOperationException();
		}
	}
	
	//���˺��Ƿ���������Ϣ
	private boolean isSettedInfo() {
		return (password != null && email != null && sex != null);
	}
	
	/**
	 * װ������
	 * @throws SQLException	�������ݿ�ʧ��
	 * @throws UnsupportedOperationException ���û���֧�ֲ���
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
			System.out.println("δ������Ϣ");
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
			System.out.println("MD5����ʧ��");
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
			System.out.println("δ������Ϣ");
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
			System.out.println("δ������Ϣ");
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
			System.out.println("δ������Ϣ");
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
			System.out.println("δ������Ϣ");
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
			System.out.println("δ������Ϣ");
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
			System.out.println("δ������Ϣ");
		}
		return hobby;
	}
	
	public String getHead() {
		try {
			if(!isLoad) {
				throw new UnsupportedOperationException();
			}
		} catch(UnsupportedOperationException e) {
			System.out.println("δ������Ϣ");
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
			System.out.println("δ������Ϣ");
		}
		return tags;
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
		} catch(UnsupportedOperationException e) {
			System.out.println("δ������Ϣ");
		} catch(SQLException e) {
			System.out.println("�������ݿ�ʧ��");
		}
	}
}

package dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import util.C3P0Util;

/**
 * school表
 * @author ylr
 *
 */
public class School {
	private PreparedStatement pstmt = null;
	
	private Integer id = null;		//标识
	
	public School(int id) {
		this.id = id;
	}
	
	/**
	 * 创建修改记录
	 * @param isCreate - 是否创建
	 * @param school - 学校
	 * @param college - 学院
	 * @param profession - 专业
	 * @param grade - 入学年份
	 * @param email - 邮箱
	 * @param sex - 性别
	 * @param age - 年龄
	 * @return 是否创建修改成功
	 */
	public boolean changeInfo(boolean isCreate, String school, String college, String profession, Integer grade, String email, String sex, Integer age) {
		try {
			if(isCreate) pstmt = C3P0Util.getConnection().prepareStatement("INSERT INTO school(id,account,school,college,profession,grade,email,sex,age) values(?,?,?,?,?,?,?,?,?)");
			else pstmt = C3P0Util.getConnection().prepareStatement("UPDATE school SET account=?, school=?, college=?, profession=?, grade=?, email=?, sex=?, age=? WHERE id=" + id);
			pstmt.setInt(1, id);
			pstmt.setString(2, User.getAccount(id));
			pstmt.setString(3, school);
			pstmt.setString(4, college);
			pstmt.setString(5, profession);
			pstmt.setInt(6, grade);
			pstmt.setString(7, email);
			if(sex.equals("男")) pstmt.setString(8, "m");
			else pstmt.setString(8, "f");
			pstmt.setInt(9, age);
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
			ResultSet rs = stmt.executeQuery("SELECT * FROM school WHERE id=" + id);
			rs.beforeFirst();
			rs.next();
			ResultSetMetaData rsmd = rs.getMetaData();
			for(int i = 1; i <= rsmd.getColumnCount(); i++) {
				map.put(rsmd.getColumnLabel(i), rs.getObject(i));
			}
			C3P0Util.release(rs);
			C3P0Util.release(stmt);
			return map;
		} catch (SQLException e) {
			return null;
		}	
	}
}

package util;

import java.sql.*;

/**
 * 
 * @author ylr
 * 无c3p0连接
 *
 */
public class MySQLConnect {
	//禁止创建对象
	private MySQLConnect() {};
	
	public static Connection conn;
	
	static {
		try {
			//加载JDBC驱动
			Class.forName("com.mysql.cj.jdbc.Driver");
			//连接数据库
			conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/socialdb?serverTimezone=GMT&user=root&password=181549144");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
} 

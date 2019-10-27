package util;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import java.sql.*;

/**
 * 
 * @author ylr
 * c3p0连接池
 *
 */
public class C3P0Util {
	public static ComboPooledDataSource dataSource = null;
	static {
		dataSource = new ComboPooledDataSource();
	}
	
	private C3P0Util() {};
	
	/**
	 * 获取Connect连接
	 * @return	Connect对象
	 * @throws SQLException
	 */
	public static Connection getConnection() throws SQLException {
		return dataSource.getConnection();
	}
	
	public static void release(PreparedStatement ps) throws SQLException {
		ps.close();
	}
	
	public static void release(ResultSet rs) throws SQLException {
		rs.close();
	}
	
	public static void release(Connection conn) throws SQLException {
		conn.close();
	}
	
	public static void release(Statement stmt) throws SQLException {
		stmt.close();
	}
}

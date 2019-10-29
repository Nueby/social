package util;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import java.sql.*;

/**
 * 
 * @author ylr
 *
 */
public class C3P0 {
	public static ComboPooledDataSource dataSource = null;
	
	static {
		dataSource = new ComboPooledDataSource();
	}
	
	private C3P0() {};
	
	public static Connection getConnection() throws SQLException {
		return dataSource.getConnection();
	}
}

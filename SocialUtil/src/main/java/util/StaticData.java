package util;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * 
 * @author ylr
 *
 */
public class StaticData {
	/**
	 * 
	 * @return 获取下一个id
	 */
	public static int getNextId() {
		try {
			PreparedStatement ps = C3P0Util.getConnection().prepareStatement("SELECT * FROM user");
			ResultSet rs = ps.executeQuery();
			rs.beforeFirst();
			if(rs.next()) {
				rs.last();
				return rs.getInt(1) + 1;
			} else {
				return 0;
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return 0;
	}
	
	public static int getNextChatId() {
		try {
			PreparedStatement ps = C3P0Util.getConnection().prepareStatement("SELECT * FROM chat");
			ResultSet rs = ps.executeQuery();
			rs.beforeFirst();
			if(rs.next()) {
				rs.last();
				return rs.getInt(1) + 1;
			} else {
				return 0;
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return 0;
	}
}

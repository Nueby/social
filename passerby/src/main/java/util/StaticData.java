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
	 * @param table - 0用户id  1聊天id
	 * @return id
	 */
	public static int getNextId(int table) {
		try {
			PreparedStatement ps = null;
			switch(table) {	
			case 0:
				ps = C3P0.getConnection().prepareStatement("SELECT * FROM user");
				break;
			case 1:
				ps = C3P0.getConnection().prepareStatement("SELECT * FROM chat");
				break;
			}
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

package dao;

import java.sql.PreparedStatement;

import util.C3P0;

/**
 * 
 * @author ylr
 *
 */
public class ChatDao {
	//聊天举报
	public static boolean illegal(String account, String date, String illegal) {
		try {
			PreparedStatement ps = C3P0.getConnection().prepareStatement("UPDATE chat SET illegal=?, state=1 WHERE from=? AND date=?");
			ps.setString(1, illegal);
			ps.setString(2, account);
			ps.setString(3, date);
			ps.execute();
			ps.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	
}

package bean;

import java.sql.PreparedStatement;
import util.C3P0Util;

public class Tags {
	private int id;
	private String tag;
	
	public Tags(int id, String tag) {
		this.id = id;
		this.tag = tag;
	}
	
	public void insert() {
		try {
			PreparedStatement ps = C3P0Util.getConnection().prepareStatement("INSERT INTO tags(id,tag) VALUES(?,?)");
			ps.setInt(1, id);
			ps.setString(2, tag);
			ps.execute();
			C3P0Util.release(ps);
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
}

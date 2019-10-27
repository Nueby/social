package controller;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import javax.websocket.*;
import javax.websocket.server.*;
import util.C3P0Util;
import util.StaticData;

/**
 * 
 * @author ylr
 *
 */
@ServerEndpoint(value = "/Chat/{account}")
public class Chat {
	//连接数
	private static long onlineCount = 0;
	//记录用户对应的对象
	private static Map<String, Chat> clients = new ConcurrentHashMap<String, Chat>();
	//账号
	private String account;
	//会话
	private Session session;
	//是否在线
	boolean online = true;
	
	@OnOpen
	public void onOpen(Session session, @PathParam("account") String account) throws IOException, SQLException {
		this.session = session;
		this.account = account;
		onlineCount++;
		clients.put(account, this);
		PreparedStatement ps = C3P0Util.getConnection().prepareStatement("SELECT * FROM chat WHERE to=? AND state=?");
		ps.setString(1, account);
		ps.setInt(2, 3);	//3表示未发送的消息
		ResultSet rs = ps.executeQuery();
		rs.beforeFirst();
		while(rs.next()) {
			this.session.getBasicRemote().sendText(rs.getString(6) + "," + rs.getString(2) + "," + rs.getString(3) + "," + rs.getString(4));
		}
	}
	
	@OnClose
	public void onClose() {
		online = false;
		clients.remove(account);
	}
	
	@OnMessage
	public void onMessage(String message) throws IOException, SQLException {
		//发送信息   from,to,msg
		PreparedStatement ps = C3P0Util.getConnection().prepareStatement("INSERT INTO chat(chatid,from,to,msg,state,date) VALUES(?,?,?,?,?,?)");
		ps.setInt(1, StaticData.getNextChatId());
		String[] msgs = message.split(",",3);
		String from = msgs[0];
		String to = msgs[1];
		String msg = msgs[2];
		ps.setString(2, from);
		ps.setString(3, to);
		ps.setString(4, msg);
		Date date = new Date();
		DateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
		ps.setString(6, format.format(date));
		Chat client = clients.get(to);		//目标
		if(client == null) ps.setInt(5, 3);
		else {
			ps.setInt(5, 0);
			client.session.getBasicRemote().sendText(date+","+message);
		}
		this.session.getBasicRemote().sendText(date+","+message);
		ps.execute();
		C3P0Util.release(ps);
	}
	
	@OnError
	public void onError(Session session, Throwable error) {
		error.printStackTrace();
	}
}

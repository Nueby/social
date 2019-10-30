package controller;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.alibaba.fastjson.JSONObject;
import dao.UserDao;

/**
 * 
 * @author ylr
 *
 */
public class UserController extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public UserController() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		JSONObject json = new JSONObject();
		//执行操作
		int behaviour = reqJson.getInteger("behaviour");
		switch(behaviour) {
		//检查账号是否存在
		case 0:
			json.put("result", UserDao.isExist(reqJson.getString("account")));
			break;
		//获取信息
		case 1:
			json = UserDao.getInfo(reqJson.getString("account"));
			break;
		//获取个人圈图片
		case 2:
			json = UserDao.getOwnPic(reqJson.getString("account"));
			break;
		//筛选
		case 3:
			json = UserDao.reacher(reqJson.getString("account"), reqJson.getString("tags"),reqJson.getString("sex"),reqJson.getString("school"),reqJson.getString("college"));
			break;
		//密码验证
		case 4:
			json.put("result", UserDao.passwordConfirm(reqJson.getString("account"), reqJson.getString("password")));
			break;
		PrintWriter out = response.getWriter();
		out.write(json.toString());
		out.close();
		//获取好友信息
		case 5:
			json = UserDao.getfriend(reqJson.getString("account"));
			break;
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		JSONObject json = new JSONObject();
		//执行操作
		int behaviour = reqJson.getInteger("behaviour");
		switch(behaviour) {
		//忘记密码
		case 0:
			json = UserDao.forgetPassowrd(reqJson.getString("account"), reqJson.getString("email"), reqJson.getString("password"));
			break;
		//更改头像
		case 1:
			json.put("result", UserDao.changeHead(reqJson.getString("account"), reqJson.getString("head")));
			break;
		//更改个人圈图片和个人圈信息
		case 2:
			json.put("result", UserDao.changeOwn(reqJson.getString("account"), reqJson.getString("picture"), reqJson.getInteger("ify"), reqJson.getString("info")));
			break;
		//修改个人信息
		case 3:
			json.put("result", UserDao.changePersonal(reqJson.getString("account"), reqJson.getString("sex"), reqJson.getString("fakename"), reqJson.getString("birthday")));
			break;
		//修改邮箱
		case 4:
			json.put("result", UserDao.changeEmail(reqJson.getString("account"), reqJson.getString("email")));
			break;
		//修改密码
		case 5:
			json.put("result", UserDao.changePassword(reqJson.getString("account"), reqJson.getString("password"), reqJson.getString("oldpassword")));
			break;
		//修改个性签名
		case 6:
			json.put("result", UserDao.changeSinglesex(reqJson.getString("account"), reqJson.getString("singlesex")));
			break;
		//修改标签
		case 7:
			json.put("result", UserDao.changeTags(reqJson.getString("account"), reqJson.getString("tags")));
			break;
		//账号邮箱匹配
		case 8:
			json.put("result", UserDao.change(reqJson.getString("account"), reqJson.getString("email")));
			break;
		//添加好友发送好友请求
		case 9:
			json.put("result", UserDao.addFriend(reqJson.getString("account"), reqJson.getString("friendaccount")));
			break;
		
		}
		//添加好友接受好友请求
				case 10:
					json.put("result", UserDao.addFriend(reqJson.getString("account"), reqJson.getString("friendaccount")));
					break;
				
		}
		
	}
		
		PrintWriter out = response.getWriter();
		out.write(json.toString());
		out.close();
	}

}

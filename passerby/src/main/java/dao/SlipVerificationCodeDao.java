package dao;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import javax.imageio.ImageIO;
import org.apache.commons.codec.binary.Base64;
import com.alibaba.fastjson.JSONObject;

/**
 * 
 * @author ylr
 *
 */
public class SlipVerificationCodeDao {
	private int smallWidth = 60;		//小图片宽度
	private int smallHeight = 60;		//小图片高度
	private int bigWidth = 300;			//大图片宽度
	private int bigHeight = 205;		//大图片高度
	private int circleR = 14;		//小圆半径
	private int good = 10;		//成功范围
	private int randX = 0;		//抠图x坐标
	private int randY = 0;		//抠图y坐标
	private String url = SlipVerificationCodeDao.class.getClassLoader().getResource("./").getPath();		//文件夹路径
	
	//获取小图片样式
	private int[][] getSmallData() {
		int[][] smallData = new int[smallWidth][smallHeight];		//0表示无颜色，1表示有颜色
		int x = smallWidth - circleR;		//矩形宽度
		int y = smallHeight - circleR;		//矩形高度
		int r2 = circleR * circleR;		//半径的二次方
		Random rand = new Random();
		int oX = rand.nextInt(2) == 1 ? circleR : x;		//圆心随机左右
		int oY = rand.nextInt(2) == 1 ? circleR : y;		//圆心随机上下
		int oYx, oXy;		//y圆心的x坐标，x圆心的y坐标
		if(oX == circleR) oYx = circleR + x / 2;
		else oYx = x / 2;
		if(oY == circleR) oXy = circleR + y / 2;
		else oXy = y / 2;
		boolean lu = (oX == circleR) && (oY == circleR);		//左上
		boolean ld = (oX == circleR) && (oY == y);		//左下
		boolean ru = (oX == x) && (oY == circleR);		//右上
		boolean rd = (oX == x) && (oY == y);		//右下
		int inout = rand.nextInt(4);		//随机凹凸
		for(int i = 0; i < smallWidth; i++) {		//记录坐标点是否含有颜色
			for(int j = 0; j < smallHeight; j++) {
				int dX = (i - oX) * (i - oX) + (j - oXy) * (j - oXy);
				int dY = (i - oYx) * (i - oYx) + (j - oY) * (j - oY);
				switch(inout) {
				case 0:		//x,y均为凹
					if(lu) {
						if(i <= oX || j <= oY || dX <= r2 || dY <= r2) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					} else if(ld) {
						if(i <= oX || j >= oY || dX <= r2 || dY <= r2) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					} else if(ru) {
						if(i >= oX || j <= oY || dX <= r2 || dY <= r2) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					} else {
						if(i >= oX || j >= oY || dX <= r2 || dY <= r2) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					}
					break;
				case 1:		//x凹y凸
					if(lu) {
						if(i <= oX || j <= oY - circleR || dX < r2 || (dY > r2 && j > oY - circleR && j < oY)) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					} else if(ld) {
						if(i <= oX || j >= oY + circleR || dX < r2 || (dY > r2 && j > oY  && j < oY + circleR)) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					} else if(ru) {
						if(i >= oX || j <= oY - circleR || dX < r2 || (dY > r2 && j > oY - circleR && j < oY)) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					} else {
						if(i >= oX || j >= oY + circleR || dX < r2 || (dY > r2 && j > oY  && j < oY + circleR)) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					}
					break;
				case 2:		//x凸y凹
					if(lu) {
						if(i <= oX - circleR || j <= oY ||  (dX > r2 && i > oX - circleR && i < oX) || dY < r2) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					} else if(ld) {
						if(i <= oX - circleR || j >= oY || (dX > r2 && i > oX - circleR && i < oX) || dY < r2) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					} else if(ru) {
						if(i >= oX + circleR || j <= oY || (dX > r2 && i > oX && i < oX + circleR) || dY < r2) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					} else {
						if(i >= oX + circleR || j >= oY || (dX > r2 && i > oX && i < oX + circleR) || dY < r2) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					}
					break;
				case 3:		//x,y均为凸
					if(lu) {
						if(i <= oX - circleR || j <= oY - circleR || (dX > r2 && i > oX - circleR && i < oX) || (dY > r2 && j > oY - circleR && j < oY)) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					} else if(ld) {
						if(i <= oX - circleR || j >= oY + circleR || (dX > r2 && i > oX - circleR && i < oX) || (dY > r2 && j > oY && j < oY + circleR)) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					} else if(ru) {
						if(i >= oX + circleR || j <= oY - circleR || (dX > r2 && i > oX && i < oX + circleR) || (dY > r2 && j > oY - circleR && j < oY)) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					} else {
						if(i >= oX + circleR || j >= oY + circleR || (dX > r2 && i > oX && i < oX + circleR) || (dY > r2 && j > oY && j < oY + circleR)) {
							smallData[i][j] = 0;
						} else {
							smallData[i][j] = 1;
						}
					}
					break;	
				}
			}
		}
		return smallData;
	}
	
	//获取缩放后的大图BufferedImage
	private BufferedImage getBigPicture() {
		//随机获取图片
		Random rand = new Random();
		int picture = rand.nextInt(4);
		String bURL = (url + "picture/" + "code" + picture + ".png").replace("\\", "/");
		File f = new File(bURL);
		BufferedImage nBuff = null;		//缩放后的BufferedImage
		BufferedImage buff = null;
		try {
			buff = ImageIO.read(f);
			nBuff = new BufferedImage(bigWidth,bigHeight,BufferedImage.TYPE_4BYTE_ABGR);
			Graphics2D g = nBuff.createGraphics();
			g.drawImage(buff, 0, 0, bigWidth,bigHeight,null);
			g.dispose();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return nBuff;
	}
	
	//挖图
	private String[] cutPicture(BufferedImage obig, BufferedImage small, int[][] smallData) {
		//左上角随机
		Random rand = new Random();
		randX = rand.nextInt(bigWidth - smallWidth - 15);
		randY = rand.nextInt(bigHeight - smallHeight);
		BufferedImage big = new BufferedImage(bigWidth,bigHeight,BufferedImage.TYPE_4BYTE_ABGR);
		for(int i = 0; i < bigWidth; i++) {
			for(int j = 0; j < bigHeight; j++) {
				big.setRGB(i, j, obig.getRGB(i, j));
				if(i - randX >= 0 && j - randY >= 0 && i - randX < smallWidth && j - randY < smallHeight) {
					if(smallData[i - randX][j - randY] == 1) {
						big.setRGB(i, j, 0xAA000000);
						small.setRGB(i - randX, j - randY, obig.getRGB(i, j));
					} else {
						small.setRGB(i - randX, j - randY, 0x00FFFFFF);
					}
				}
			}
		}
		String[] image = null;
		try {
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			ImageIO.write(big, "png", bos);
			String bigBase64 = Base64.encodeBase64String(bos.toByteArray());		//大图base64
			bos = new ByteArrayOutputStream();
			ImageIO.write(small,"png",bos);
			String smallBase64 = Base64.encodeBase64String(bos.toByteArray());
			image = new String[] {bigBase64, smallBase64};		//小图base64
		} catch(Exception e) {
			e.printStackTrace();
		}
		return image;
	}
	
	/**
	 * 
	 * @return - String[0]为大图base64,String[1]为小图base64
	 */
	public String[] getSlipPicture() {
		String[] image = cutPicture(getBigPicture(),new BufferedImage(smallWidth,smallHeight,BufferedImage.TYPE_4BYTE_ABGR),getSmallData());
		return image;
	}
	
	/**
	 * 
	 * @return - int[0]表示x，int[1]表示y
	 */
	public int[] getSlipXY() {
		int[] imageXY = {randX, randY};
		return imageXY;
	}
	
	/**
	 * 
	 * @param d - 距离
	 * @return - 是否成功
	 */
	public boolean verificationSuccess(int d) {
		return d >= randX - good && d <= randX + good;
	}
	
	/**
	 * 获取图片
	 * @return json数据
	 */
	public Map<String, Object> getPic() {
		String[] image = getSlipPicture();
		int[] pos = getSlipXY();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("big", image[0]);
		map.put("small", image[1]);
		map.put("posY", pos[1]);
		return map;
	}
	
	/**
	 * @param json - 请求json数据
	 * @return 是否成功
	 */
	public boolean check(JSONObject json) {
		int d = json.getInteger("distance");
		return verificationSuccess(d);
	}
}

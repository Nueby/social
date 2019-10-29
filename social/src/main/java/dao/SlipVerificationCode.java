package dao;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Random;
import javax.imageio.ImageIO;

/**
 * 
 * @author ylr
 *
 */
public class SlipVerificationCode {
	private int smallWidth = 60;		//小图片宽度
	private int smallHeight = 60;		//小图片高度
	private int bigWidth = 400;			//大图片宽度
	private int bigHeight = 280;		//大图片高度
	private int circleR = 20;		//小圆半径
	private int good = 4;		//成功范围
	private String url = SlipVerificationCode.class.getClassLoader().getResource("./").getPath();		//文件夹路径
	
	/**
	 * 
	 * @return - 获取小图片样式
	 */
	public int[][] getSmallData() {
		int[][] smallData = new int[smallWidth][smallHeight];		//0表示无颜色，1表示有颜色
		int x = smallWidth - circleR;		//矩形宽度
		int y = smallHeight - circleR;		//矩形高度
		int r2 = circleR * circleR;		//半径的二次方
		Random rand = new Random();
		int oX = rand.nextInt(2) == 1 ? circleR : x;		//圆心随机左右
		int oY = rand.nextInt(2) == 1 ? circleR : y;		//圆心随机上下
		boolean lu = (oX == circleR) && (oY == circleR);		//左上
		boolean ld = (oX == circleR) && (oY == y);		//左下
		boolean ru = (oX == x) && (oY == circleR);		//右上
		boolean rd = (oX == x) && (oY == y);		//右下
		int inout = rand.nextInt(4);		//随机凹凸
		boolean temp = false;
		for(int i = 0; i < smallWidth; i++) {		//记录坐标点是否含有颜色
			for(int j = 0; j < smallHeight; j++) {
				int dX = (i - oX) * (i - oX) + (j - y / 2) * (j - y / 2);
				int dY = (i - x / 2) * (i - x / 2) + (j - oY) * (j - oY);
				switch(inout) {
				case 0:		//x,y均为凹
					temp = (dX <= r2 || dY <= r2);
					setSmallData(lu, ld, ru, rd, temp, i, j, smallData, oX, oY);
					break;
				case 1:		//x凹y凸
					temp = (dX <= r2 || dY >= r2);
					setSmallData(lu, ld, ru, rd, temp, i, j, smallData, oX, oY);
					break;
				case 2:		//x凸y凹
					temp = (dX >= r2 || dY <= r2);
					setSmallData(lu, ld, ru, rd, temp, i, j, smallData, oX, oY);
					break;
				case 3:		//x,y均为凸
					temp = (dX >= r2 || dY >= r2);
					setSmallData(lu, ld, ru, rd, temp, i, j, smallData, oX, oY);
					break;	
				}
			}
		}
		return smallData;
	}
	
	private void setSmallData(boolean lu, boolean ld, boolean ru, boolean rd, boolean temp, int i, int j, int[][] smallData, int oX, int oY) {
		if(lu) {
			if(i <= oX || j <= oY || temp) {
				smallData[i][j] = 0;
			} else {
				smallData[i][j] = 1;
			}
		} else if(ld) {
			if(i <= oX || j >= oY || temp) {
				smallData[i][j] = 0;
			} else {
				smallData[i][j] = 1;
			}
		} else if(ru) {
			if(i >= oX || j <= oY || temp) {
				smallData[i][j] = 0;
			} else {
				smallData[i][j] = 1;
			}
		} else {
			if(i >= oX || j >= oY || temp) {
				smallData[i][j] = 0;
			} else {
				smallData[i][j] = 1;
			}
		}
	}
	
	/**
	 * 
	 * @return	获取缩放后的大图BufferedImage
	 */
	public BufferedImage getBigPicture() {
		//随机获取图片
		Random rand = new Random();
		int picture = rand.nextInt(5);
		String bURL = url + "code" + picture + ".png";
		File f = new File(bURL);
		BufferedImage nBuff = null;		//缩放后的BufferedImage
		try {
			BufferedImage buff = ImageIO.read(f);
			nBuff = new BufferedImage(bigWidth,bigHeight,BufferedImage.TYPE_4BYTE_ABGR);
			Graphics2D g = nBuff.createGraphics();
			g.drawImage(buff,bigWidth,bigHeight,null);
			g.dispose();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return nBuff;
	}
	
	
}

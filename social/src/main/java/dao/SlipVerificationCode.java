package dao;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.Random;
import javax.imageio.ImageIO;

import org.apache.commons.codec.binary.Base64;

/**
 * 
 * @author ylr
 *
 */
public class SlipVerificationCode {
	private int smallWidth = 60;		//СͼƬ���
	private int smallHeight = 60;		//СͼƬ�߶�
	private int bigWidth = 400;			//��ͼƬ���
	private int bigHeight = 280;		//��ͼƬ�߶�
	private int circleR = 20;		//СԲ�뾶
	private int good = 4;		//�ɹ���Χ
	//private String url = SlipVerificationCode.class.getClassLoader().getResource("./").getPath();		//�ļ���·��
	private String url = "D:/test/";
	
	//��ȡСͼƬ��ʽ
	private int[][] getSmallData() {
		int[][] smallData = new int[smallWidth][smallHeight];		//0��ʾ����ɫ��1��ʾ����ɫ
		int x = smallWidth - circleR;		//���ο��
		int y = smallHeight - circleR;		//���θ߶�
		int r2 = circleR * circleR;		//�뾶�Ķ��η�
		Random rand = new Random();
		int oX = rand.nextInt(2) == 1 ? circleR : x;		//Բ���������
		int oY = rand.nextInt(2) == 1 ? circleR : y;		//Բ���������
		boolean lu = (oX == circleR) && (oY == circleR);		//����
		boolean ld = (oX == circleR) && (oY == y);		//����
		boolean ru = (oX == x) && (oY == circleR);		//����
		boolean rd = (oX == x) && (oY == y);		//����
		int inout = rand.nextInt(4);		//�����͹
		boolean temp = false;
		for(int i = 0; i < smallWidth; i++) {		//��¼������Ƿ�����ɫ
			for(int j = 0; j < smallHeight; j++) {
				int dX = (i - oX) * (i - oX) + (j - y / 2) * (j - y / 2);
				int dY = (i - x / 2) * (i - x / 2) + (j - oY) * (j - oY);
				switch(inout) {
				case 0:		//x,y��Ϊ��
					temp = (dX <= r2 || dY <= r2);
					setSmallData(lu, ld, ru, rd, temp, i, j, smallData, oX, oY);
					break;
				case 1:		//x��y͹
					temp = (dX <= r2 || dY >= r2);
					setSmallData(lu, ld, ru, rd, temp, i, j, smallData, oX, oY);
					break;
				case 2:		//x͹y��
					temp = (dX >= r2 || dY <= r2);
					setSmallData(lu, ld, ru, rd, temp, i, j, smallData, oX, oY);
					break;
				case 3:		//x,y��Ϊ͹
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
	
	//��ȡ���ź�Ĵ�ͼBufferedImage
	private BufferedImage getBigPicture() {
		//�����ȡͼƬ
		Random rand = new Random();
		int picture = rand.nextInt(4);
		String bURL = url + "code" + picture + ".png";
		File f = new File(bURL);
		BufferedImage nBuff = null;		//���ź��BufferedImage
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
	
	//��ͼ
	private String[] cutPicture(BufferedImage obig, BufferedImage small, int[][] smallData) {
		//���Ͻ����
		Random rand = new Random();
		int randX = rand.nextInt(bigWidth - smallWidth);
		int randY = rand.nextInt(bigHeight - smallHeight);
		BufferedImage big = new BufferedImage(bigWidth,bigHeight,BufferedImage.TYPE_4BYTE_ABGR);
		for(int i = 0; i < bigWidth; i++) {
			for(int j = 0; j < bigHeight; j++) {
				if(smallData[i - randX][j - randY] == 1) {
					big.setRGB(i, j, 0xAA000000);
					small.setRGB(i - randX, j - randY, obig.getRGB(i, j));
				} else {
					if(i - randX >= 0 && j - randY >= 0) {
						small.setRGB(i - randX, j - randY, 0x00FFFFFF);
					}
					big.setRGB(i, j, obig.getRGB(i, j));
				}
			}
		}
		String[] image = null;
		try {
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			ImageIO.write(big, "png", bos);
			String bigBase64 = Base64.encodeBase64String(bos.toByteArray());		//��ͼbase64
			bos = new ByteArrayOutputStream();
			ImageIO.write(small,"png",bos);
			String smallBase64 = Base64.encodeBase64String(bos.toByteArray());
			image = new String[] {bigBase64, smallBase64};		//Сͼbase64
		} catch(Exception e) {
			e.printStackTrace();
		}
		return image;
	}
	
	/**
	 * 
	 * @return - String[0]Ϊ��ͼbase64,String[1]ΪСͼbase64
	 */
	public String[] getSlipPicture() {
		String[] image = cutPicture(getBigPicture(),new BufferedImage(smallWidth,smallHeight,BufferedImage.TYPE_4BYTE_ABGR),getSmallData());
		return image;
	}
}

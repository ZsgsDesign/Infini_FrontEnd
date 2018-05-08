package org.docharity.infini.apicloud;

import org.json.JSONObject;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.DialogInterface.OnClickListener;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.widget.TextView;

import com.uzmap.pkg.openapi.ExternalActivity;
import com.uzmap.pkg.openapi.Html5EventListener;
import com.uzmap.pkg.openapi.WebViewProvider;
import com.uzmap.pkg.uzcore.uzmodule.UZModuleContext;
import android.content.Intent;

/**
 * 
 * 使用SuperWebview的Activity，需继承自ExternalActivity
 * @author dexing.li
 *
 */
public class WebPageModule extends ExternalActivity {

	private TextView mProgress;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		mProgress = new TextView(this);
		mProgress.setTextColor(0xFFFF0000);
		mProgress.setTextSize(20);
		mProgress.setVisibility(View.GONE);
		addContentView(mProgress, new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT));
	}

	/**
	 * 重写该函数，可实现处理收到来自Html5页面的操作请求，处理完毕后异步回调至Html5
	 */
	@Override
	protected boolean onHtml5AccessRequest(WebViewProvider provider, UZModuleContext moduleContext) {
		String name = moduleContext.optString("name");
		//"requestEvent"与assets/widget/html/wind.html页面的发送请求相匹配
            if("requestEvent".equals(name)){
			JSONObject extra = new JSONObject();
			try{
				extra.put("value", "哈哈哈，我是来自Native的事件");
			}catch(Exception e){
				;
			}
			//"fromNative"与assets/widget/html/wind.html页面的apiready中注册的监听相对应
			sendEventToHtml5("fromNative", extra);
			return true;
		}
		defaultHandleHtml5AccessRequest(moduleContext);
		return true;
	}
	
	//默认处理收到收到来自Html5页面的操作请求，并通过UZModuleContext给予JS回调
	private void defaultHandleHtml5AccessRequest(final UZModuleContext moduleContext){
		String name = moduleContext.optString("name");
		Object extra = moduleContext.optObject("extra");
		if (name.equals("exit")) {
			/** Intended to back to launcher, HOWEVER, that may not be wise **/
            /*
                Intent home = new Intent(Intent.ACTION_MAIN);
                home.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                home.addCategory(Intent.CATEGORY_HOME);
                startActivity(home);
			*/
            //finish();
            System.exit(0);
		}
	}
}

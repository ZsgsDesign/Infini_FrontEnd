package org.docharity.infini;

import android.app.Application;
import com.uzmap.pkg.openapi.APICloud;

/**
 * WORDS TO SAY AT FIRST
 *
 * I write this program as the last piece of work of mine ever started project
 * that using such method called Hybrid App.
 *
 * Hybrid do have many benefits, it makes rapid development possible, helping
 * hundreds of thousands of programmers, even without an app-develop foundation,
 * to complete sophisticated systematic mobile applications project in days.
 *
 * And it's deflection is almost as bright as it's edges, poor performance, limited
 * functions and customize-incapable all contributes to one thing, it's good for
 * rapid development, but not suitable for us to learn new technologies and make
 * ourselves better.
 *
 * However, if you are an frontend programmer, never mind.
 */

public class MyApplication extends Application{
	@Override
	public void onCreate() {
		super.onCreate();
		APICloud.initialize(this);
	}
}

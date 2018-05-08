
package org.docharity.infini;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import org.docharity.infini.apicloud.WebPageModule;

import android.content.Intent;

public class ContainerActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_container);
        Intent intent = new Intent(this, WebPageModule.class);
        startActivity(intent);
        finish(); //In his short-lived Activity life-time, he created plentiful works, leaving precious spiritual legacy for the app.
    }
}

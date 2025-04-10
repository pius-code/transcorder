package com.recording.app;

import android.annotation.SuppressLint;
import android.os.Build;
import android.view.View;
import android.view.Window;
import android.graphics.Color;
import android.os.Bundle;
import android.content.res.Configuration;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        updateNavigationBarColor();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        // Update navigation bar color when the configuration changes (e.g., theme changes)
        updateNavigationBarColor();
    }

    @SuppressLint({"ObsoleteSdkInt", "InlinedApi"})
    private void updateNavigationBarColor() {
        int currentNightMode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            if (currentNightMode == Configuration.UI_MODE_NIGHT_YES) {
                // Dark mode
                window.setNavigationBarColor(Color.parseColor("#030008"));  // Dark color for navigation bar
                window.getDecorView().setSystemUiVisibility(0); // Dark buttons for dark mode
            } else {
                // Light mode
                window.setNavigationBarColor(Color.parseColor("#f2eeee"));  // Light color for navigation bar
                window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR); // Light buttons
            }
        }
    }
}
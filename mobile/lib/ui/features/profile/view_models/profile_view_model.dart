import 'package:flutter/material.dart';

class ProfileViewModel extends ChangeNotifier {
  String userName = 'Daniel Mensah';
  String userEmail = 'daniel.mensah@st.ug.edu.gh';
  String studentId = 'UG/10934821';
  
  bool isDarkMode = false;
  bool notificationsEnabled = true;
  bool soundEnabled = true;

  List<String> favoriteStopIds = [];
  List<String> favoriteRouteIds = [];

  void toggleDarkMode() {
    isDarkMode = !isDarkMode;
    notifyListeners();
  }

  void toggleNotifications() {
    notificationsEnabled = !notificationsEnabled;
    notifyListeners();
  }

  void toggleSound() {
    soundEnabled = !soundEnabled;
    notifyListeners();
  }
}

import 'package:flutter/material.dart';

class LostFoundViewModel extends ChangeNotifier {
  String itemName = '';
  String description = '';
  String lastSeenLocation = '';
  DateTime? dateLost;
  
  bool isSubmitting = false;
  bool isSubmitted = false;
  String? error;

  List<String> locationOptions = [
    'Main Gate Stop',
    'Library Stop',
    'JQB Stop',
    'Night Market Stop',
    'Pentagon Stop',
    'Diaspora Stop',
    'Banking Square Stop',
    'Evandy Stop',
  ];

  void setItemName(String v) {
    itemName = v;
    notifyListeners();
  }

  void setDescription(String v) {
    description = v;
    notifyListeners();
  }

  void setLocation(String v) {
    lastSeenLocation = v;
    notifyListeners();
  }

  void setDateLost(DateTime v) {
    dateLost = v;
    notifyListeners();
  }

  Future<void> submitReport() async {
    if (!isValid) return;
    
    isSubmitting = true;
    error = null;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 1500));
    
    isSubmitting = false;
    isSubmitted = true;
    notifyListeners();
  }

  void reset() {
    itemName = '';
    description = '';
    lastSeenLocation = '';
    dateLost = null;
    isSubmitting = false;
    isSubmitted = false;
    error = null;
    notifyListeners();
  }

  bool get isValid => itemName.isNotEmpty && description.isNotEmpty && lastSeenLocation.isNotEmpty && dateLost != null;
}

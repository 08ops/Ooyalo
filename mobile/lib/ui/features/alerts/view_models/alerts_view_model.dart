import 'package:flutter/material.dart';
import 'package:ooyalo_app/data/models/alert_model.dart';
import 'package:ooyalo_app/data/repositories/alert_repository.dart';

class AlertsViewModel extends ChangeNotifier {
  final AlertRepository _alertRepo;

  AlertsViewModel(this._alertRepo);

  List<AlertModel> alerts = [];
  String selectedCategory = 'all'; 
  bool isLoading = true;

  Future<void> loadAlerts() async {
    isLoading = true;
    notifyListeners();

    alerts = await _alertRepo.getAlerts();
    
    isLoading = false;
    notifyListeners();
  }

  List<AlertModel> get filteredAlerts {
    if (selectedCategory == 'all') return alerts;
    return alerts.where((a) => a.category.toLowerCase() == selectedCategory.toLowerCase()).toList();
  }

  void setCategory(String category) {
    selectedCategory = category;
    notifyListeners();
  }

  void dismissAlert(String id) {
    alerts.removeWhere((a) => a.id == id);
    notifyListeners();
  }

  int get unreadCount {
    return alerts.length;
  }
}

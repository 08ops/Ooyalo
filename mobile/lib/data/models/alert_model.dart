class AlertModel {
  final String id;
  final String title;
  final String message;
  final String severity;
  final String timestamp;
  final bool active;
  final String? category;

  AlertModel({
    required this.id,
    required this.title,
    required this.message,
    required this.severity,
    required this.timestamp,
    required this.active,
    this.category,
  });

  factory AlertModel.fromJson(Map<String, dynamic> json) {
    return AlertModel(
      id: json['id'] as String,
      title: json['title'] as String,
      message: json['message'] as String,
      severity: json['severity'] as String,
      timestamp: json['timestamp'] as String,
      active: json['active'] as bool,
      category: json['category'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'message': message,
      'severity': severity,
      'timestamp': timestamp,
      'active': active,
      if (category != null) 'category': category,
    };
  }
}

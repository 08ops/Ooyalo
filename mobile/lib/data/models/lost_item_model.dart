class LostItemModel {
  final String? id;
  final String itemName;
  final String description;
  final String lastSeenLocation;
  final DateTime dateLost;
  final String? imageUrl;
  final String status;

  LostItemModel({
    this.id,
    required this.itemName,
    required this.description,
    required this.lastSeenLocation,
    required this.dateLost,
    this.imageUrl,
    required this.status,
  });

  factory LostItemModel.fromJson(Map<String, dynamic> json) {
    return LostItemModel(
      id: json['id'] as String?,
      itemName: json['itemName'] as String,
      description: json['description'] as String,
      lastSeenLocation: json['lastSeenLocation'] as String,
      dateLost: DateTime.parse(json['dateLost'] as String),
      imageUrl: json['imageUrl'] as String?,
      status: json['status'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'itemName': itemName,
      'description': description,
      'lastSeenLocation': lastSeenLocation,
      'dateLost': dateLost.toIso8601String(),
      if (imageUrl != null) 'imageUrl': imageUrl,
      'status': status,
    };
  }
}

import 'package:intl/intl.dart';

class TimeFormatUtils {
  static String getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }

  static String formatEta(int seconds) {
    if (seconds < 60) {
      return 'Less than 1 min';
    }
    
    final int minutes = (seconds / 60).round();
    if (minutes < 60) {
      return '$minutes min';
    }
    
    final int hours = minutes ~/ 60;
    final int remainingMinutes = minutes % 60;
    
    if (remainingMinutes == 0) {
      return '$hours hr${hours > 1 ? 's' : ''}';
    }
    
    return '$hours hr${hours > 1 ? 's' : ''} $remainingMinutes min';
  }

  static String formatTimeAgo(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inSeconds < 60) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes} min ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} hr${difference.inHours > 1 ? 's' : ''} ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} day${difference.inDays > 1 ? 's' : ''} ago';
    } else {
      final formatter = DateFormat('MMM d, yyyy');
      return formatter.format(timestamp);
    }
  }

  static String formatOperatingHours(String hours) {
    // Example basic formatting. Assuming format "07:00-18:00"
    if (hours.isEmpty) return 'No hours specified';
    final parts = hours.split('-');
    if (parts.length != 2) return hours;
    
    try {
      final startTime = DateFormat("HH:mm").parse(parts[0].trim());
      final endTime = DateFormat("HH:mm").parse(parts[1].trim());
      final format = DateFormat("h:mm a");
      return '${format.format(startTime)} - ${format.format(endTime)}';
    } catch (e) {
      return hours;
    }
  }
}

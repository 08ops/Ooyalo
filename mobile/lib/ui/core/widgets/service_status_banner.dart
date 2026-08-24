import 'package:flutter/material.dart';

class ServiceStatusBanner extends StatelessWidget {
  final String status;
  final String? message;

  const ServiceStatusBanner({
    super.key,
    required this.status,
    this.message,
  });

  @override
  Widget build(BuildContext context) {
    Color bgColor;
    IconData icon;
    String title;

    switch (status.toLowerCase()) {
      case 'delayed':
        bgColor = const Color(0xFFFFC107);
        icon = Icons.warning_amber_rounded;
        title = 'Delays Expected';
        break;
      case 'disrupted':
        bgColor = const Color(0xFFE53935);
        icon = Icons.error_outline;
        title = 'Service Disruption';
        break;
      case 'operating':
      default:
        bgColor = const Color(0xFF00A86B);
        icon = Icons.check_circle_outline;
        title = 'All Services Running Normally';
        break;
    }

    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 300),
      child: Container(
        key: ValueKey(status),
        width: double.infinity,
        margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
        padding: const EdgeInsets.all(12.0),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Icon(icon, color: Colors.white, size: 24),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  if (message != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      message!,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

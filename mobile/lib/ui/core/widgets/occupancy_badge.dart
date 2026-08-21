import 'package:flutter/material.dart';

class OccupancyBadge extends StatelessWidget {
  final String level;
  final double? percentage;
  final bool compact;

  const OccupancyBadge({
    Key? key,
    required this.level,
    this.percentage,
    this.compact = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Color bgColor;
    Color textColor;
    IconData icon;
    String label;

    switch (level.toLowerCase()) {
      case 'medium':
        bgColor = const Color(0xFFFFC107);
        textColor = Colors.black87;
        icon = Icons.people_outline;
        label = 'Getting Busy';
        break;
      case 'high':
        bgColor = const Color(0xFFFF6B35);
        textColor = Colors.white;
        icon = Icons.warning_amber_rounded;
        label = 'Almost Full';
        break;
      case 'full':
        bgColor = const Color(0xFFE53935);
        textColor = Colors.white;
        icon = Icons.block;
        label = 'Full';
        break;
      case 'low':
      default:
        bgColor = const Color(0xFF00A86B);
        textColor = Colors.white;
        icon = Icons.check_circle_outline;
        label = 'Seats Available';
        break;
    }

    if (compact) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: bgColor,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: bgColor,
            ),
          ),
        ],
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: textColor),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              color: textColor,
              fontWeight: FontWeight.w600,
              fontSize: 12,
            ),
          ),
          if (percentage != null) ...[
            const SizedBox(width: 6),
            Text(
              '${(percentage! * 100).toInt()}%',
              style: TextStyle(
                color: textColor.withOpacity(0.9),
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ]
        ],
      ),
    );
  }
}

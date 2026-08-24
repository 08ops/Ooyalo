import 'package:flutter/material.dart';

class EtaChip extends StatefulWidget {
  final int etaSeconds;
  final bool compact;
  final Color? color;

  const EtaChip({
    super.key,
    required this.etaSeconds,
    this.compact = false,
    this.color,
  });

  @override
  State<EtaChip> createState() => _EtaChipState();
}

class _EtaChipState extends State<EtaChip> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    _animation = Tween<double>(begin: 0.3, end: 1.0).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _formatEta(int seconds) {
    if (seconds < 60) return '< 1 min';
    final int minutes = seconds ~/ 60;
    if (minutes < 60) return '$minutes min';
    final int hours = minutes ~/ 60;
    final int remainingMinutes = minutes % 60;
    return '$hours hr $remainingMinutes min';
  }

  @override
  Widget build(BuildContext context) {
    final Color primaryColor = widget.color ?? const Color(0xFF0057B8);
    final String formattedEta = _formatEta(widget.etaSeconds);

    if (widget.compact) {
      return Text(
        formattedEta,
        style: TextStyle(
          color: primaryColor,
          fontWeight: FontWeight.bold,
          fontSize: 14,
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: primaryColor.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          FadeTransition(
            opacity: _animation,
            child: Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: primaryColor,
                shape: BoxShape.circle,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            formattedEta,
            style: TextStyle(
              color: primaryColor,
              fontWeight: FontWeight.bold,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}

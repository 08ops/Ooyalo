import 'package:flutter/material.dart';
import 'package:ooyalo_app/data/models/route_model.dart';
import 'package:ooyalo_app/ui/core/widgets/ooyalo_card.dart';

class RouteCard extends StatelessWidget {
  final ShuttleRouteModel route;
  final int activeShuttleCount;
  final VoidCallback? onTap;

  const RouteCard({
    super.key,
    required this.route,
    required this.activeShuttleCount,
    this.onTap,
  });

  Color _parseColor(String? hexColor) {
    if (hexColor == null) return const Color(0xFF0057B8);
    var hex = hexColor.replaceAll('#', '');
    if (hex.length == 6) {
      hex = 'FF$hex';
    }
    return Color(int.parse(hex, radix: 16));
  }

  @override
  Widget build(BuildContext context) {
    final Color routeColor = _parseColor(route.color);
    
    return OoyaloCard(
      onTap: onTap,
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 6,
            decoration: BoxDecoration(
              color: routeColor,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  route.name,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (route.description.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    route.description,
                    style: TextStyle(
                      color: Colors.grey.shade600,
                      fontSize: 14,
                    ),
                  ),
                ],
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _InfoItem(
                      icon: Icons.timer_outlined,
                      text: '${route.frequencyMinutes} min',
                    ),
                    _InfoItem(
                      icon: Icons.access_time,
                      text: route.operatingHours,
                    ),
                    _InfoItem(
                      icon: Icons.directions_bus,
                      text: '$activeShuttleCount active',
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                if (route.stops.isNotEmpty)
                  SizedBox(
                    height: 24,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: route.stops.length,
                      itemBuilder: (context, index) {
                        final isLast = index == route.stops.length - 1;
                        return Row(
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                color: routeColor,
                                shape: BoxShape.circle,
                              ),
                            ),
                            if (!isLast)
                              Container(
                                width: 24,
                                height: 2,
                                color: routeColor.withValues(alpha: 0.3),
                              ),
                          ],
                        );
                      },
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoItem extends StatelessWidget {
  final IconData icon;
  final String text;

  const _InfoItem({
    required this.icon,
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey.shade600),
        const SizedBox(width: 4),
        Text(
          text,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey.shade600,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}

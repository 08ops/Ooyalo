import 'package:flutter/material.dart';
import 'package:ooyalo_app/data/models/shuttle_model.dart';
import 'package:ooyalo_app/data/models/route_model.dart';
import 'package:ooyalo_app/ui/core/widgets/ooyalo_card.dart';
import 'package:ooyalo_app/ui/core/widgets/eta_chip.dart';
import 'package:ooyalo_app/ui/core/widgets/occupancy_badge.dart';

class ShuttleCard extends StatelessWidget {
  final ShuttleModel shuttle;
  final ShuttleRouteModel? route;
  final VoidCallback? onTap;

  const ShuttleCard({
    Key? key,
    required this.shuttle,
    this.route,
    this.onTap,
  }) : super(key: key);

  Color _parseColor(String? hexColor) {
    if (hexColor == null) return const Color(0xFF0057B8);
    hexColor = hexColor.replaceAll('#', '');
    if (hexColor.length == 6) {
      hexColor = 'FF' + hexColor;
    }
    return Color(int.parse(hexColor, radix: 16));
  }

  @override
  Widget build(BuildContext context) {
    final routeColor = _parseColor(route?.color);
    
    return OoyaloCard(
      padding: EdgeInsets.zero,
      onTap: onTap,
      child: IntrinsicHeight(
        child: Row(
          children: [
            Container(
              width: 4,
              decoration: BoxDecoration(
                color: routeColor,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(16),
                  bottomLeft: Radius.circular(16),
                ),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                shuttle.name,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                shuttle.plateNumber,
                                style: TextStyle(
                                  fontFamily: 'monospace',
                                  color: Colors.grey.shade600,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Icon(Icons.location_on, size: 14, color: Colors.grey.shade500),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  shuttle.nextStopId.replaceAll('stop-', '').replaceAll('-', ' ').toUpperCase(),
                                  style: TextStyle(
                                    color: Colors.grey.shade700,
                                    fontSize: 13,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: routeColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              route?.name ?? 'Unknown Route',
                              style: TextStyle(
                                color: routeColor,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        EtaChip(etaSeconds: shuttle.etaSecondsToNextStop),
                        OccupancyBadge(
                          level: shuttle.occupancyLevel,
                          compact: true,
                        ),
                        Text(
                          '${shuttle.speedKmh.toInt()} km/h',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade600,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

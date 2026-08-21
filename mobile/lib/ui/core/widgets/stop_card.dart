import 'package:flutter/material.dart';
import 'package:ooyalo_app/data/models/stop_model.dart';
import 'package:ooyalo_app/ui/core/widgets/ooyalo_card.dart';
import 'package:ooyalo_app/ui/core/widgets/eta_chip.dart';

class StopCard extends StatelessWidget {
  final StopModel stop;
  final int? distanceMeters;
  final int? nextEtaSeconds;
  final VoidCallback? onTap;
  final VoidCallback? onFavoriteToggle;

  const StopCard({
    Key? key,
    required this.stop,
    this.distanceMeters,
    this.nextEtaSeconds,
    this.onTap,
    this.onFavoriteToggle,
  }) : super(key: key);

  String _formatDistance(int meters) {
    if (meters < 1000) return '${meters}m';
    return '${(meters / 1000).toStringAsFixed(1)} km';
  }

  String _estimateWalkTime(int meters) {
    final minutes = (meters / 80).ceil(); // assuming ~80m per minute walk speed
    return '$minutes min walk';
  }

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    
    return OoyaloCard(
      onTap: onTap,
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: const Color(0xFF0057B8).withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.location_on,
                  color: Color(0xFF0057B8),
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      stop.name,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${stop.code ?? ''} • ${stop.description ?? ''}',
                      style: TextStyle(
                        color: Colors.grey.shade600,
                        fontSize: 12,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              if (distanceMeters != null)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      _formatDistance(distanceMeters!),
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                    Text(
                      _estimateWalkTime(distanceMeters!),
                      style: TextStyle(
                        color: Colors.grey.shade600,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: stop.amenities?.map((amenity) {
                  return Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: isDark ? Colors.grey.shade800 : Colors.grey.shade200,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      amenity,
                      style: TextStyle(
                        fontSize: 10,
                        color: isDark ? Colors.grey.shade300 : Colors.grey.shade700,
                      ),
                    ),
                  );
                }).toList() ?? [],
              ),
              Row(
                children: [
                  if (nextEtaSeconds != null) ...[
                    EtaChip(etaSeconds: nextEtaSeconds!),
                    const SizedBox(width: 12),
                  ],
                  IconButton(
                    icon: Icon(
                      stop.isFavorite == true ? Icons.favorite : Icons.favorite_border,
                      color: stop.isFavorite == true ? Colors.red : Colors.grey,
                      size: 20,
                    ),
                    onPressed: onFavoriteToggle,
                    constraints: const BoxConstraints(),
                    padding: EdgeInsets.zero,
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}

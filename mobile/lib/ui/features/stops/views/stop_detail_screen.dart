import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:ooyalo_app/ui/features/stops/view_models/stop_view_model.dart';
import 'package:ooyalo_app/config/colors.dart';
import 'package:ooyalo_app/ui/core/widgets/ooyalo_card.dart';
import 'package:ooyalo_app/ui/core/widgets/occupancy_badge.dart';

class StopDetailScreen extends StatefulWidget {
  final String stopId;
  const StopDetailScreen({super.key, required this.stopId});

  @override
  State<StopDetailScreen> createState() => _StopDetailScreenState();
}

class _StopDetailScreenState extends State<StopDetailScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<StopViewModel>().loadStop(widget.stopId);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<StopViewModel>(
      builder: (context, viewModel, child) {
        if (viewModel.isLoading) {
          return const Scaffold(
            backgroundColor: AppColors.backgroundLight,
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final stop = viewModel.selectedStop;
        if (stop == null) {
          return Scaffold(
            appBar: AppBar(title: const Text('Stop Not Found')),
            body: const Center(child: Text('Stop details unavailable.')),
          );
        }

        return Scaffold(
          backgroundColor: AppColors.backgroundLight,
          appBar: AppBar(
            title: Text(
              stop.name,
              style: GoogleFonts.plusJakartaSans(
                color: Colors.black87,
                fontWeight: FontWeight.bold,
              ),
            ),
            backgroundColor: AppColors.surfaceLight,
            elevation: 0,
            iconTheme: const IconThemeData(color: Colors.black87),
          ),
          body: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  height: 200,
                  child: GoogleMap(
                    initialCameraPosition: CameraPosition(
                      target: LatLng(stop.location.lat, stop.location.lng),
                      zoom: 16,
                    ),
                    zoomControlsEnabled: false,
                    markers: {
                      Marker(
                        markerId: MarkerId(stop.id),
                        position: LatLng(stop.location.lat, stop.location.lng),
                      ),
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      OoyaloCard(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: AppColors.primary,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    'Code: ${stop.code}',
                                    style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 12),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              stop.description,
                              style: GoogleFonts.plusJakartaSans(color: Colors.grey[700]),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        'Next Arrivals',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      if (viewModel.sortedArrivingShuttles.isEmpty)
                        OoyaloCard(
                          padding: const EdgeInsets.all(24),
                          child: Center(
                            child: Column(
                              children: [
                                Icon(Icons.bus_alert, size: 48, color: Colors.grey[400]),
                                const SizedBox(height: 8),
                                Text(
                                  'No shuttles approaching',
                                  style: GoogleFonts.plusJakartaSans(color: Colors.grey[600]),
                                ),
                              ],
                            ),
                          ),
                        )
                      else
                        ...viewModel.sortedArrivingShuttles.map((shuttle) => _buildArrivalCard(shuttle)),
                      
                      const SizedBox(height: 24),
                      Text(
                        'Amenities',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: stop.amenities.map((amenity) {
                          IconData icon = Icons.check_circle_outline;
                          if (amenity.toLowerCase().contains('shelter')) icon = Icons.umbrella;
                          if (amenity.toLowerCase().contains('light')) icon = Icons.lightbulb;
                          if (amenity.toLowerCase().contains('bench')) icon = Icons.chair;
                          return Chip(
                            avatar: Icon(icon, size: 16, color: AppColors.primary),
                            label: Text(amenity),
                            backgroundColor: Colors.white,
                            side: BorderSide(color: Colors.grey[300]!),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 100),
                    ],
                  ),
                ),
              ],
            ),
          ),
          bottomSheet: Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white,
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Arrival alert set for this stop!')),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                icon: const Icon(Icons.notifications_active),
                label: Text(
                  'Notify Me',
                  style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ),
        );
      }
    );
  }

  Widget _buildArrivalCard(shuttle) {
    final int etaMins = (shuttle.etaSecondsToNextStop / 60).ceil();
    final bool isUrgent = etaMins < 5;
    
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: OoyaloCard(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 12,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(6),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    shuttle.name,
                    style: GoogleFonts.plusJakartaSans(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  OccupancyBadge(level: shuttle.occupancyLevel),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '$etaMins min',
                  style: GoogleFonts.plusJakartaSans(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                    color: isUrgent ? AppColors.primary : Colors.black87,
                  ),
                ),
                Text(
                  '${shuttle.distanceToNextStopMeters}m away',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

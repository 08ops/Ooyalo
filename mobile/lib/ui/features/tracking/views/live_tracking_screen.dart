import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:ooyalo_app/ui/features/tracking/view_models/tracking_view_model.dart';
import 'package:ooyalo_app/ui/core/widgets/occupancy_badge.dart';

class LiveTrackingScreen extends StatefulWidget {
  final String? shuttleId;

  const LiveTrackingScreen({Key? key, this.shuttleId}) : super(key: key);

  @override
  State<LiveTrackingScreen> createState() => _LiveTrackingScreenState();
}

class _LiveTrackingScreenState extends State<LiveTrackingScreen> {
  GoogleMapController? _mapController;
  final LatLng _campusCenter = const LatLng(5.6514, -0.1872);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TrackingViewModel>().loadData(shuttleId: widget.shuttleId);
    });
  }

  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;
  }

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
    final viewModel = context.watch<TrackingViewModel>();

    if (viewModel.isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    Set<Marker> markers = {};
    Set<Polyline> polylines = {};

    for (var shuttle in viewModel.allShuttles) {
      if (shuttle.latitude != null && shuttle.longitude != null) {
        markers.add(
          Marker(
            markerId: MarkerId(shuttle.id),
            position: LatLng(shuttle.latitude!, shuttle.longitude!),
            infoWindow: InfoWindow(title: shuttle.name),
            onTap: () => viewModel.selectShuttle(shuttle),
            icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueBlue),
          ),
        );
      }
    }

    for (var stop in viewModel.routeStops) {
      markers.add(
        Marker(
          markerId: MarkerId(stop.id),
          position: LatLng(stop.latitude, stop.longitude),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueAzure),
          infoWindow: InfoWindow(title: stop.name),
        ),
      );
    }

    if (viewModel.selectedRoute != null && viewModel.selectedRoute!.pathCoordinates != null) {
      polylines.add(
        Polyline(
          polylineId: PolylineId(viewModel.selectedRoute!.id),
          points: viewModel.selectedRoute!.pathCoordinates!.map((e) => LatLng(e.latitude, e.longitude)).toList(),
          color: _parseColor(viewModel.selectedRoute!.color),
          width: 4,
        ),
      );
    }

    return Scaffold(
      body: Stack(
        children: [
          GoogleMap(
            initialCameraPosition: CameraPosition(
              target: _campusCenter,
              zoom: 15,
            ),
            mapType: MapType.normal,
            myLocationEnabled: true,
            markers: markers,
            polylines: polylines,
            onMapCreated: _onMapCreated,
          ),
          SafeArea(
            child: Column(
              children: [
                Container(
                  color: Colors.white.withOpacity(0.9),
                  padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
                  child: Row(
                    children: [
                      if (GoRouterState.of(context).matchedLocation.contains('home'))
                        IconButton(
                          icon: const Icon(Icons.arrow_back),
                          onPressed: () => context.pop(),
                        ),
                      const Expanded(
                        child: Text(
                          'Live Tracking',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.layers),
                        onPressed: () {},
                      ),
                    ],
                  ),
                ),
                if (viewModel.selectedShuttle == null)
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      children: viewModel.allShuttles.map((shuttle) {
                        return Padding(
                          padding: const EdgeInsets.only(right: 8.0),
                          child: ActionChip(
                            label: Text(shuttle.name),
                            onPressed: () => viewModel.selectShuttle(shuttle),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
              ],
            ),
          ),
          if (viewModel.selectedShuttle != null)
            DraggableScrollableSheet(
              initialChildSize: 0.35,
              minChildSize: 0.15,
              maxChildSize: 0.65,
              builder: (context, scrollController) {
                return Container(
                  decoration: BoxDecoration(
                    color: Theme.of(context).scaffoldBackgroundColor,
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                    boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 10, offset: Offset(0, -2))],
                  ),
                  child: SingleChildScrollView(
                    controller: scrollController,
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Center(
                          child: Container(
                            width: 40,
                            height: 5,
                            decoration: BoxDecoration(
                              color: Colors.grey.shade400,
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  viewModel.selectedShuttle!.name,
                                  style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                                ),
                                Text(
                                  viewModel.selectedShuttle!.plateNumber ?? '',
                                  style: const TextStyle(fontFamily: 'monospace', color: Colors.grey),
                                ),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.green.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                viewModel.selectedShuttle!.status.replaceAll('_', ' ').toUpperCase(),
                                style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 12),
                              ),
                            ),
                          ],
                        ),
                        const Divider(height: 32),
                        Row(
                          children: [
                            Expanded(child: _Metric(label: 'ETA', value: '${viewModel.selectedShuttle!.etaSeconds != null ? viewModel.selectedShuttle!.etaSeconds! ~/ 60 : 0} min')),
                            Expanded(child: _Metric(label: 'Speed', value: '${viewModel.selectedShuttle!.speed ?? 0} km/h')),
                            Expanded(child: _Metric(label: 'Heading', value: '${viewModel.selectedShuttle!.heading ?? 0}°')),
                          ],
                        ),
                        const SizedBox(height: 24),
                        const Text('Occupancy', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            OccupancyBadge(level: viewModel.selectedShuttle!.occupancyLevel ?? 'low', percentage: 0.45),
                            const SizedBox(width: 16),
                            Expanded(
                              child: LinearProgressIndicator(
                                value: 0.45,
                                backgroundColor: Colors.grey.shade200,
                                color: Colors.green,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        const Text('Next Stop', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: const Icon(Icons.location_on, color: Colors.blue),
                          title: Text(viewModel.selectedShuttle!.nextStopName ?? 'Unknown'),
                          subtitle: const Text('250m away'),
                          trailing: TextButton(
                            onPressed: () {},
                            child: const Text('Notify Me'),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () {},
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF0057B8),
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                                child: const Text('Track on Map', style: TextStyle(color: Colors.white)),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: OutlinedButton(
                                onPressed: viewModel.toggleFollow,
                                style: OutlinedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  side: BorderSide(color: viewModel.isFollowing ? Colors.blue : Colors.grey),
                                ),
                                child: Text(viewModel.isFollowing ? 'Following' : 'Follow Shuttle'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
        ],
      ),
    );
  }
}

class _Metric extends StatelessWidget {
  final String label;
  final String value;
  const _Metric({Key? key, required this.label, required this.value}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF0057B8))),
      ],
    );
  }
}

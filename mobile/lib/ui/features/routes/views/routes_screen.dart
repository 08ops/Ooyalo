import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:ooyalo_app/ui/features/routes/view_models/routes_view_model.dart';
import 'package:ooyalo_app/ui/core/widgets/route_card.dart';
import 'package:ooyalo_app/config/colors.dart';

class RoutesScreen extends StatefulWidget {
  const RoutesScreen({Key? key}) : super(key: key);

  @override
  State<RoutesScreen> createState() => _RoutesScreenState();
}

class _RoutesScreenState extends State<RoutesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<RoutesViewModel>().loadRoutes();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: Text(
          'Routes',
          style: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w700,
            color: Colors.black87,
          ),
        ),
        backgroundColor: AppColors.surfaceLight,
        elevation: 0,
        centerTitle: false,
      ),
      body: Consumer<RoutesViewModel>(
        builder: (context, viewModel, child) {
          if (viewModel.isLoading) {
            return const Center(child: CircularProgressIndicator(color: AppColors.primary));
          }
          
          if (viewModel.routes.isEmpty) {
            return Center(
              child: Text(
                'No routes available.',
                style: GoogleFonts.plusJakartaSans(color: Colors.grey),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            itemCount: viewModel.routes.length,
            itemBuilder: (context, index) {
              final route = viewModel.routes[index];
              final activeShuttles = viewModel.getActiveShuttleCount(route.id);
              
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: RouteCard(
                  route: route,
                  activeShuttleCount: activeShuttles,
                  onTap: () {
                    viewModel.selectRoute(route);
                    context.push('/routes/${route.id}');
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}

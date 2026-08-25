import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:ooyalo_app/ui/features/profile/view_models/profile_view_model.dart';
import 'package:ooyalo_app/config/colors.dart';
import 'package:ooyalo_app/ui/core/widgets/ooyalo_card.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: Text(
          'Profile',
          style: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        backgroundColor: AppColors.surfaceLight,
        elevation: 0,
        centerTitle: false,
      ),
      body: Consumer<ProfileViewModel>(
        builder: (context, viewModel, child) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildProfileHeader(viewModel),
                const SizedBox(height: 24),
                _buildFavoritesSection(),
                const SizedBox(height: 24),
                _buildTravelHistorySection(),
                const SizedBox(height: 24),
                _buildSettingsSection(viewModel, context),
                const SizedBox(height: 24),
                _buildAboutSection(),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () {},
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.error,
                      side: const BorderSide(color: AppColors.error),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(
                      'Log Out',
                      style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
                const SizedBox(height: 32),
              ],
            ),
          );
        }
      ),
    );
  }

  Widget _buildProfileHeader(ProfileViewModel viewModel) {
    return OoyaloCard(
      padding: const EdgeInsets.all(24),
      child: Row(
        children: [
          CircleAvatar(
            radius: 40,
            backgroundColor: AppColors.primary,
            child: Text(
              'DM',
              style: GoogleFonts.plusJakartaSans(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  viewModel.userName,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  viewModel.userEmail,
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.grey[600],
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.accent.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    viewModel.studentId,
                    style: GoogleFonts.plusJakartaSans(
                      color: Colors.orange[800],
                      fontWeight: FontWeight.w600,
                      fontSize: 12,
                    ),
                  ),
                )
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildFavoritesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Favorites',
          style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: OoyaloCard(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    const Icon(Icons.place, color: AppColors.primary, size: 32),
                    const SizedBox(height: 8),
                    Text('Saved Stops', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 4),
                    Text('0 stops', style: GoogleFonts.plusJakartaSans(fontSize: 12, color: Colors.grey)),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: OoyaloCard(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    const Icon(Icons.directions_bus, color: AppColors.secondary, size: 32),
                    const SizedBox(height: 8),
                    Text('Saved Routes', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 4),
                    Text('0 routes', style: GoogleFonts.plusJakartaSans(fontSize: 12, color: Colors.grey)),
                  ],
                ),
              ),
            )
          ],
        )
      ],
    );
  }

  Widget _buildTravelHistorySection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recent Trips',
          style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        OoyaloCard(
          padding: const EdgeInsets.all(24),
          child: Center(
            child: Text(
              'No trips recorded yet.',
              style: GoogleFonts.plusJakartaSans(color: Colors.grey[600]),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSettingsSection(ProfileViewModel viewModel, BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Settings',
          style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        OoyaloCard(
          child: Column(
            children: [
              SwitchListTile(
                value: viewModel.isDarkMode,
                onChanged: (_) => viewModel.toggleDarkMode(),
                title: Text('Dark Mode', style: GoogleFonts.plusJakartaSans()),
                secondary: const Icon(Icons.dark_mode, color: AppColors.primary),
              ),
              const Divider(height: 1),
              SwitchListTile(
                value: viewModel.notificationsEnabled,
                onChanged: (_) => viewModel.toggleNotifications(),
                title: Text('Notifications', style: GoogleFonts.plusJakartaSans()),
                secondary: const Icon(Icons.notifications, color: AppColors.primary),
              ),
              const Divider(height: 1),
              SwitchListTile(
                value: viewModel.soundEnabled,
                onChanged: (_) => viewModel.toggleSound(),
                title: Text('Sound Alerts', style: GoogleFonts.plusJakartaSans()),
                secondary: const Icon(Icons.volume_up, color: AppColors.primary),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.accessibility, color: AppColors.primary),
                title: Text('Accessibility', style: GoogleFonts.plusJakartaSans()),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  context.push('/home/accessibility');
                },
              )
            ],
          ),
        )
      ],
    );
  }

  Widget _buildAboutSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'About',
          style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        OoyaloCard(
          child: Column(
            children: [
              ListTile(
                title: Text('App Version', style: GoogleFonts.plusJakartaSans()),
                trailing: Text('1.0.0 (Build 42)', style: GoogleFonts.plusJakartaSans(color: Colors.grey)),
              ),
              const Divider(height: 1),
              ListTile(
                title: Text('Terms of Service', style: GoogleFonts.plusJakartaSans()),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {},
              ),
              const Divider(height: 1),
              ListTile(
                title: Text('Privacy Policy', style: GoogleFonts.plusJakartaSans()),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {},
              ),
            ],
          ),
        )
      ],
    );
  }
}

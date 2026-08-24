import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:ooyalo_app/config/colors.dart';
import 'package:ooyalo_app/ui/core/widgets/ooyalo_card.dart';

class AccessibilityScreen extends StatefulWidget {
  const AccessibilityScreen({super.key});

  @override
  State<AccessibilityScreen> createState() => _AccessibilityScreenState();
}

class _AccessibilityScreenState extends State<AccessibilityScreen> {
  bool wheelchairAssistance = false;
  bool visualAssistance = false;
  bool hearingAssistance = false;
  bool priorityBoarding = false;
  bool requestSent = false;

  void _sendRequest() {
    setState(() {
      requestSent = true;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Driver has been notified. Assistance is on the way.'),
        backgroundColor: AppColors.secondary,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: Text(
          'Accessibility',
          style: GoogleFonts.plusJakartaSans(color: Colors.black87, fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppColors.surfaceLight,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black87),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Center(
              child: Column(
                children: [
                  const SizedBox(height: 16),
                  const Icon(Icons.accessible_forward, size: 64, color: AppColors.primary),
                  const SizedBox(height: 16),
                  Text(
                    'Accessibility Options',
                    style: GoogleFonts.plusJakartaSans(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'We are committed to inclusive campus transport. Customize your experience below.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.plusJakartaSans(color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
            
            _buildOptionCard(
              title: 'Wheelchair Assistance',
              description: 'Request ramp deployment and assistance before shuttle arrival',
              icon: Icons.accessible,
              value: wheelchairAssistance,
              onChanged: (v) {
                setState(() => wheelchairAssistance = v);
              },
              showRequestButton: wheelchairAssistance,
            ),
            const SizedBox(height: 16),

            _buildOptionCard(
              title: 'Visual Assistance',
              description: 'Enable high contrast mode and larger text',
              icon: Icons.visibility,
              value: visualAssistance,
              onChanged: (v) {
                setState(() => visualAssistance = v);
              },
            ),
            const SizedBox(height: 16),

            _buildOptionCard(
              title: 'Hearing Assistance',
              description: 'Replace audio alerts with visual notifications and haptic feedback',
              icon: Icons.hearing_disabled,
              value: hearingAssistance,
              onChanged: (v) {
                setState(() => hearingAssistance = v);
              },
            ),
            const SizedBox(height: 16),

            _buildOptionCard(
              title: 'Priority Boarding',
              description: 'Notify driver for priority boarding before shuttle arrives',
              icon: Icons.priority_high,
              value: priorityBoarding,
              onChanged: (v) {
                setState(() => priorityBoarding = v);
              },
              showRequestButton: priorityBoarding,
            ),
            const SizedBox(height: 32),

            OoyaloCard(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.error.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.sos, color: AppColors.error, size: 28),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Campus Security',
                          style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '+233 24 123 4567',
                          style: GoogleFonts.plusJakartaSans(color: Colors.grey[600]),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.phone, color: AppColors.error),
                    onPressed: () {},
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildOptionCard({
    required String title,
    required String description,
    required IconData icon,
    required bool value,
    required ValueChanged<bool> onChanged,
    bool showRequestButton = false,
  }) {
    return OoyaloCard(
      child: Column(
        children: [
          SwitchListTile(
            value: value,
            onChanged: onChanged,
            title: Text(title, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold)),
            subtitle: Padding(
              padding: const EdgeInsets.only(top: 4.0),
              child: Text(description, style: GoogleFonts.plusJakartaSans(fontSize: 12)),
            ),
            secondary: Icon(icon, color: AppColors.primary),
            activeThumbColor: AppColors.primary,
          ),
          if (showRequestButton) ...[
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: requestSent ? null : _sendRequest,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: requestSent ? AppColors.secondary : AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: Text(
                    requestSent ? 'Request Sent' : 'Request Assistance Now',
                    style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                ),
              ),
            )
          ]
        ],
      ),
    );
  }
}

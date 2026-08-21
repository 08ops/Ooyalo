import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:ooyalo_app/ui/features/lost_found/view_models/lost_found_view_model.dart';
import 'package:ooyalo_app/config/colors.dart';
import 'package:intl/intl.dart';

class LostItemFormScreen extends StatelessWidget {
  const LostItemFormScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: Text(
          'Report Lost Item',
          style: GoogleFonts.plusJakartaSans(color: Colors.black87, fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppColors.surfaceLight,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black87),
      ),
      body: Consumer<LostFoundViewModel>(
        builder: (context, viewModel, child) {
          if (viewModel.isSubmitted) {
            return _buildSuccessState(context, viewModel);
          }
          return _buildForm(context, viewModel);
        }
      ),
    );
  }

  Widget _buildSuccessState(BuildContext context, LostFoundViewModel viewModel) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.secondary.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_circle, size: 80, color: AppColors.secondary),
            ),
            const SizedBox(height: 24),
            Text(
              'Report Submitted Successfully',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text(
              'We will notify you if an item matching this description is found.',
              style: GoogleFonts.plusJakartaSans(color: Colors.grey[700], fontSize: 16),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 48),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  viewModel.reset();
                  Navigator.of(context).pop();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(
                  'Done',
                  style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildForm(BuildContext context, LostFoundViewModel viewModel) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Form(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Column(
                children: [
                  Icon(Icons.search, size: 64, color: AppColors.primary),
                  const SizedBox(height: 16),
                  Text(
                    'Lost Something?',
                    style: GoogleFonts.plusJakartaSans(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Provide details to help us find it.',
                    style: GoogleFonts.plusJakartaSans(color: Colors.grey[600]),
                  )
                ],
              ),
            ),
            const SizedBox(height: 32),
            
            Text('Item Name', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextFormField(
              onChanged: viewModel.setItemName,
              decoration: InputDecoration(
                hintText: 'e.g. Blue Water Bottle',
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              ),
            ),
            const SizedBox(height: 20),

            Text('Description', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextFormField(
              onChanged: viewModel.setDescription,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'Describe brand, color, or distinguishing features',
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              ),
            ),
            const SizedBox(height: 20),

            Text('Last Seen Location', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              decoration: InputDecoration(
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
              hint: const Text('Select stop or bus'),
              value: viewModel.lastSeenLocation.isEmpty ? null : viewModel.lastSeenLocation,
              items: viewModel.locationOptions.map((loc) {
                return DropdownMenuItem(value: loc, child: Text(loc));
              }).toList(),
              onChanged: (val) => viewModel.setLocation(val ?? ''),
            ),
            const SizedBox(height: 20),

            Text('Date Lost', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            InkWell(
              onTap: () async {
                final date = await showDatePicker(
                  context: context,
                  initialDate: DateTime.now(),
                  firstDate: DateTime.now().subtract(const Duration(days: 30)),
                  lastDate: DateTime.now(),
                );
                if (date != null) {
                  viewModel.setDateLost(date);
                }
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      viewModel.dateLost == null 
                        ? 'Select date' 
                        : DateFormat('MMM d, yyyy').format(viewModel.dateLost!),
                      style: GoogleFonts.plusJakartaSans(
                        color: viewModel.dateLost == null ? Colors.grey[600] : Colors.black87,
                      ),
                    ),
                    const Icon(Icons.calendar_today, color: AppColors.primary),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey[300]!, style: BorderStyle.solid),
              ),
              child: Column(
                children: [
                  Icon(Icons.add_a_photo, color: Colors.grey[400], size: 32),
                  const SizedBox(height: 8),
                  Text(
                    'Add Photo (Optional)',
                    style: GoogleFonts.plusJakartaSans(color: Colors.grey[600]),
                  )
                ],
              ),
            ),
            const SizedBox(height: 32),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: viewModel.isValid && !viewModel.isSubmitting ? viewModel.submitReport : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  disabledBackgroundColor: Colors.grey[400],
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: viewModel.isSubmitting 
                  ? const SizedBox(
                      width: 24, height: 24, 
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                    )
                  : Text(
                      'Submit Report',
                      style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
              ),
            )
          ],
        ),
      ),
    );
  }
}

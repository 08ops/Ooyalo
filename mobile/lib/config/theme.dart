import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:ooyalo_app/config/colors.dart';

class OoyaloTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: OoyaloColors.primary,
        brightness: Brightness.light,
        primary: OoyaloColors.primary,
        secondary: OoyaloColors.secondary,
        error: OoyaloColors.error,
        surface: OoyaloColors.surfaceLight,
      ),
      scaffoldBackgroundColor: OoyaloColors.backgroundLight,
      textTheme: GoogleFonts.plusJakartaSansTextTheme().copyWith(
        displayLarge: GoogleFonts.plusJakartaSans(color: OoyaloColors.textPrimary),
        displayMedium: GoogleFonts.plusJakartaSans(color: OoyaloColors.textPrimary),
        displaySmall: GoogleFonts.plusJakartaSans(color: OoyaloColors.textPrimary),
        headlineLarge: GoogleFonts.plusJakartaSans(color: OoyaloColors.textPrimary),
        headlineMedium: GoogleFonts.plusJakartaSans(color: OoyaloColors.textPrimary),
        headlineSmall: GoogleFonts.plusJakartaSans(color: OoyaloColors.textPrimary),
        titleLarge: GoogleFonts.plusJakartaSans(color: OoyaloColors.textPrimary),
        titleMedium: GoogleFonts.plusJakartaSans(color: OoyaloColors.textPrimary),
        titleSmall: GoogleFonts.plusJakartaSans(color: OoyaloColors.textPrimary),
        bodyLarge: GoogleFonts.plusJakartaSans(color: OoyaloColors.textPrimary),
        bodyMedium: GoogleFonts.plusJakartaSans(color: OoyaloColors.textPrimary),
        bodySmall: GoogleFonts.plusJakartaSans(color: OoyaloColors.textPrimary),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        iconTheme: IconThemeData(color: OoyaloColors.textPrimary),
      ),
      cardTheme: CardThemeData(
        color: OoyaloColors.surfaceLight,
        elevation: 2,
        shadowColor: Colors.black.withValues(alpha: 0.05),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16.0),
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: OoyaloColors.surfaceLight,
        selectedItemColor: OoyaloColors.primary,
        unselectedItemColor: OoyaloColors.textSecondary,
        elevation: 8,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: OoyaloColors.surfaceLight,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: OoyaloColors.divider),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: OoyaloColors.divider),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: OoyaloColors.primary, width: 2),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: OoyaloColors.primary,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.0),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: OoyaloColors.primary,
          side: const BorderSide(color: OoyaloColors.primary),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.0),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: OoyaloColors.primary,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.0),
          ),
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        indicatorColor: OoyaloColors.primary.withValues(alpha: 0.1),
        backgroundColor: OoyaloColors.surfaceLight,
        elevation: 8,
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return GoogleFonts.plusJakartaSans(
              color: OoyaloColors.primary,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            );
          }
          return GoogleFonts.plusJakartaSans(
            color: OoyaloColors.textSecondary,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          );
        }),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(color: OoyaloColors.primary);
          }
          return const IconThemeData(color: OoyaloColors.textSecondary);
        }),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: OoyaloColors.primary,
        brightness: Brightness.dark,
        primary: OoyaloColors.primaryLight,
        secondary: OoyaloColors.secondaryLight,
        error: OoyaloColors.error,
        surface: OoyaloColors.surfaceDark,
      ),
      scaffoldBackgroundColor: OoyaloColors.backgroundDark,
      textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme).copyWith(
        displayLarge: GoogleFonts.plusJakartaSans(color: OoyaloColors.textLight),
        displayMedium: GoogleFonts.plusJakartaSans(color: OoyaloColors.textLight),
        displaySmall: GoogleFonts.plusJakartaSans(color: OoyaloColors.textLight),
        headlineLarge: GoogleFonts.plusJakartaSans(color: OoyaloColors.textLight),
        headlineMedium: GoogleFonts.plusJakartaSans(color: OoyaloColors.textLight),
        headlineSmall: GoogleFonts.plusJakartaSans(color: OoyaloColors.textLight),
        titleLarge: GoogleFonts.plusJakartaSans(color: OoyaloColors.textLight),
        titleMedium: GoogleFonts.plusJakartaSans(color: OoyaloColors.textLight),
        titleSmall: GoogleFonts.plusJakartaSans(color: OoyaloColors.textLight),
        bodyLarge: GoogleFonts.plusJakartaSans(color: OoyaloColors.textLight),
        bodyMedium: GoogleFonts.plusJakartaSans(color: OoyaloColors.textLight),
        bodySmall: GoogleFonts.plusJakartaSans(color: OoyaloColors.textLight),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        iconTheme: IconThemeData(color: OoyaloColors.textLight),
      ),
      cardTheme: CardThemeData(
        color: OoyaloColors.cardDark,
        elevation: 4,
        shadowColor: Colors.black.withValues(alpha: 0.2),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16.0),
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: OoyaloColors.surfaceDark,
        selectedItemColor: OoyaloColors.primaryLight,
        unselectedItemColor: OoyaloColors.textSecondary,
        elevation: 8,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: OoyaloColors.cardDark,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: OoyaloColors.dividerDark),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: OoyaloColors.dividerDark),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: OoyaloColors.primaryLight, width: 2),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: OoyaloColors.primary,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.0),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: OoyaloColors.primaryLight,
          side: const BorderSide(color: OoyaloColors.primaryLight),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.0),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: OoyaloColors.primaryLight,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.0),
          ),
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        indicatorColor: OoyaloColors.primary.withValues(alpha: 0.2),
        backgroundColor: OoyaloColors.surfaceDark,
        elevation: 8,
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return GoogleFonts.plusJakartaSans(
              color: OoyaloColors.primaryLight,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            );
          }
          return GoogleFonts.plusJakartaSans(
            color: OoyaloColors.textSecondary,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          );
        }),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(color: OoyaloColors.primaryLight);
          }
          return const IconThemeData(color: OoyaloColors.textSecondary);
        }),
      ),
    );
  }
}

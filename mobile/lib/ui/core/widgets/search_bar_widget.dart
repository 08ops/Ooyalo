import 'package:flutter/material.dart';

class OoyaloSearchBar extends StatelessWidget {
  final TextEditingController? controller;
  final String hintText;
  final VoidCallback? onTap;
  final ValueChanged<String>? onChanged;

  const OoyaloSearchBar({
    Key? key,
    this.controller,
    required this.hintText,
    this.onTap,
    this.onChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bool isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Container(
      decoration: BoxDecoration(
        color: isDark ? Colors.grey.shade800 : Colors.grey.shade100,
        borderRadius: BorderRadius.circular(28.0),
        border: Border.all(
          color: isDark ? Colors.grey.shade700 : Colors.grey.shade300,
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(28.0),
        child: InkWell(
          borderRadius: BorderRadius.circular(28.0),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
            child: Row(
              children: [
                Icon(
                  Icons.search,
                  color: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
                  size: 24,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: IgnorePointer(
                    ignoring: onTap != null,
                    child: TextField(
                      controller: controller,
                      onChanged: onChanged,
                      decoration: InputDecoration(
                        isDense: true,
                        contentPadding: EdgeInsets.zero,
                        hintText: hintText,
                        border: InputBorder.none,
                        hintStyle: TextStyle(
                          color: isDark ? Colors.grey.shade500 : Colors.grey.shade600,
                          fontSize: 16,
                        ),
                      ),
                      style: TextStyle(
                        fontSize: 16,
                        color: isDark ? Colors.white : Colors.black87,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

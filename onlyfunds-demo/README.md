# OnlyFunds browser demo

Interactive recreation of the team's Flutter app, based on the public repository at https://github.com/javieAlfaro/onlyfunds---budget-management-system.git, inspected at commit f171a1968b32488836d0008a567da92cc7948bf0.

Reference screens: lib/pages/home_page.dart, savings_page.dart, reports_page.dart, history_page.dart, settings_page.dart, and widgets/transaction_card.dart.

The phone contains working Home, Savings, Reports, History, and Settings views. Income/expense categories and buttons, balance checks, goal limits, and navigation follow the source app. The browser demo uses session-memory sample data and integer centavos for calculations. Reloading resets it.

This is not a Flutter build. Authentication, Firebase storage, external analytics predictions, notifications, and account deletion are not connected. Reports show local calculations, and settings edit only the sample profile. No real account or financial data is required.

Joalnes's role in the original project was UI/UX, Figma wireframes, and visual data in the paper. Implementing this browser recreation does not change that attribution.

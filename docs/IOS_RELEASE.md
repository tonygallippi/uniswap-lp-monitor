# LP Watcher — iOS / TestFlight

The iOS build uses Capacitor 7 to package the existing static web application into an iOS WKWebView. The existing web app continues to be built into `docs/` for GitHub Pages.

## Apple ownership
Use your **individual** Apple Developer Program team in App Store Connect and Codemagic. The App Store seller name is controlled by Apple account enrollment, not the GitHub organization. Confirm the correct team before creating the App ID.

Proposed bundle ID: `com.tonygallippi.lpwatcher`. Register this exact identifier in Apple Developer / App Store Connect before building. Bundle IDs cannot be changed for an existing App Store app.

## Codemagic setup
1. Add this GitHub repository to Codemagic.
2. In Codemagic Teams > Integrations, add an App Store Connect API key **from your individual Apple Developer team**. Name the integration `app_store_connect`, or change the YAML integration reference to match.
3. In App Store Connect, create a new iOS app named LP Watcher using the proposed bundle ID and your individual team.
4. Choose the `ios-testflight` workflow from `codemagic.yaml` and build branch `ios-preview`.
5. Codemagic generates the native project, signs it with your selected team's distribution credentials, uploads the IPA, and submits to TestFlight. TestFlight processing and tester assignment are managed in App Store Connect.

## Release notes
- Footer shows version from package.json and seven-character Git commit hash embedded during build.
- Do not commit Apple API keys, certificates, provisioning profiles, or signing passwords.
- Test on physical iPhone: launch, safe areas, add position, RPC access, claim history, privacy mode, offline behavior, swipe gestures, and external transaction links.
- Before App Store submission, supply privacy policy, support URL, screenshots, age rating, app privacy answers, and a functional review account if required.
- Apple may reject a thin website wrapper under App Review Guideline 4.2. Validate native usefulness and review readiness before submission.

# LP Watcher

LP Watcher is a Progressive Web App (PWA) for active liquidity providers. Monitor your Uniswap liquidity positions across multiple addresses and chains in one simple view.

Runs in your browser. Your watchlist, addresses and saved data stay in your browser’s local storage on this device; they are not stored on our servers. Public data providers receive the identifiers needed to fetch position data.

**[Open LP Watcher](https://tonygallippi.github.io/uniswap-lp-monitor/)**

## Screenshots

<p>
  <img src="assets/screenshots/splash-screen.png" alt="LP Watcher welcome screen for active liquidity providers" width="320">
  <img src="assets/screenshots/add-position.png" alt="Add a Uniswap position by pasting its URL into LP Watcher" width="320">
  <img src="assets/screenshots/list-view.jpg" alt="LP Watcher list view showing position values, unclaimed fees and estimated APY" width="320">
  <img src="assets/screenshots/card-view.jpg" alt="LP Watcher card view showing liquidity, token balances, fees and position range" width="320">
</p>

*Illustrative screenshots.*

## Get started

1. Open the app and tap **Get started**.
2. Tap **+** and paste a Uniswap v3 position URL.
3. Add more positions and swipe left or right to move between them.

Supported networks: **Base, Ethereum, Arbitrum, Optimism and Polygon**. Uniswap v4 positions are not currently supported.

No wallet connection, account, API key or signature is required.

## Install on your iPhone

Open the app in **Safari**, tap **Share → Add to Home Screen**, enable **Open as Web App** if shown, then tap **Add**.

Launch it from the new Home Screen icon for the full app experience.

## Install on Android

1. Open [LP Watcher](https://tonygallippi.github.io/uniswap-lp-monitor/) in **Chrome** on your Android device.
2. Tap the **three-dot menu (⋮)** beside the address bar.
3. Choose **Install and create shortcut → Install**. On some Chrome versions, this appears as **Add to Home screen → Install** or **Install app**.
4. Confirm the installation, then open **LP Watcher** from your Home Screen or app drawer.

No Play Store download is needed. See [Google’s web app installation guide](https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=en).

## Your position card

- **Deposited liquidity:** current USD value, token quantities and each token’s percentage share.
- **Unclaimed fees:** fees available to collect, shown in USD and token amounts.
- **Daily earnings and APY:** estimates based on accrued fees and recorded claim history.
- **Last claim and claim history:** dated collections with transaction links, daily estimates and calculation details.
- **Position range:** low and high prices, with a white dot marking the current price.
- **In range / Out of range:** whether the position is within its active liquidity range.

Tap **View on Uniswap** to open the position there. LP Watcher does not claim fees, reinvest funds or submit transactions.

## Refresh and manage positions

Pull down from the top or tap **↻** to refresh. The app also checks for updates approximately every minute while open.

Use **+** to watch another position. Tap the **trash icon** on a card to stop watching it; this does not close your Uniswap position.

## Privacy and saved data

Tap the **eye icon** to hide balances, token quantities and earnings amounts. Position percentages, range prices and APY percentages remain visible.

Your watchlist, history snapshots and preferences are saved only in the browser or app on your device. They do not sync between devices, browsers or website addresses. Clearing browser data or removing the installed app may remove your watchlist.

Live reads go directly to public blockchain, explorer and price providers. Those providers receive the public identifiers needed for each request and may retain operational logs.

## Understanding earnings estimates

Estimated daily earnings equal the current unclaimed fee value divided by the days since the latest recorded claim. Estimated APY assumes that daily amount is reinvested against the current deposited-liquidity value for a year.

Thirty-day estimates spread collected fees across the intervals between claims and show the available history coverage. Partial days are identified in the daily estimates.

These calculations use current token prices and assume full claims and constant principal. Deposits, withdrawals, partial claims and changing prices can affect accuracy. Gas costs are excluded. Estimates are not guaranteed future returns, and this app does not automatically compound fees.

When collected amounts may include withdrawn principal, earnings estimates are withheld.

## If something is unavailable

- **Stale amounts:** check your connection, then pull down to refresh.
- **Saved snapshot:** the latest live read failed; the card shows previously saved data.
- **Claim history or APY unavailable:** public data providers may be rate-limited, blocked or incomplete. Unavailable does not mean zero claims or zero earnings.
- **Empty watchlist on another device or address:** add your position links again; saved data does not transfer automatically.
- **Older screen after an update:** close and reopen the app.

Live updates require internet access. Previously cached app files and saved position snapshots may remain available offline.

---

LP Watcher is an independent monitoring tool and is **not affiliated with Uniswap.org or Uniswap Labs**. See [artwork attribution](THIRD_PARTY_NOTICES.md).

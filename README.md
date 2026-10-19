# LP Monitor

A public, iPhone-first progressive web app for monitoring Uniswap v3 liquidity positions. Add a position URL, swipe between cards, and track deposited liquidity, unclaimed fees, position range, claim history, estimated daily earnings and APY. No wallet connection, signatures, trading permissions or backend account are required.

**Intended GitHub Pages address:** https://tonygallippi.github.io/uniswap-lp-monitor/ (available after enabling Pages below).

This independent app is not affiliated with Uniswap.org or Uniswap Labs.

## Finish the migration to GitHub Pages

The application source and ready-to-publish files are included in this repository. You do not need to copy the old Cloudflare Worker, configure a server, create API secrets, or provide a GitHub API key to run the app.

1. Open **[Settings → Pages](https://github.com/tonygallippi/uniswap-lp-monitor/settings/pages)**.
2. Under **Build and deployment → Source**, select **Deploy from a branch**.
3. Select branch **main** and folder **/docs**, then click **Save**.
4. Wait for the Pages deployment to finish. Check the **[Actions](https://github.com/tonygallippi/uniswap-lp-monitor/actions)** tab if the site is not ready yet.
5. Open **https://tonygallippi.github.io/uniswap-lp-monitor/** in a private/incognito window. Confirm that it loads without ChatGPT sign-in and starts with an empty watchlist.
6. Add a Uniswap v3 position link on a supported chain. Confirm that liquidity, token shares, fees and range load. Open claim history and check the availability/coverage labels for estimates.
7. On your iPhone, open the new URL in **Safari → Share → Add to Home Screen**. Enable **Open as Web App**, if shown, then tap **Add**.
8. Re-add the positions you want to watch at the new address. Confirm the new app works before removing the old Home Screen app or taking the old ChatGPT Site offline.
9. Update any bookmarks/shared links to the new GitHub Pages URL. The old ChatGPT Site is separate and has not been shut down or redirected by this repository migration.

GitHub documents branch/folder publication here: [Configure a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Pages settings require repository administration access. This migration does not require a custom GitHub Actions workflow.

### Important: existing device data does not move automatically

The old Site and GitHub Pages use different browser origins. Browser localStorage, cached snapshots, installed-PWA identity and service workers do **not** transfer between them. This repository also uses a dedicated `lp-monitor:` storage prefix.

- Open the old app and copy each position's **View on Uniswap** link, then add that link in the new app.
- Install the new URL separately; the old installed app will keep opening the old address.
- Privacy mode must be set again on the new origin.
- Old cached claim history is not imported. The new app attempts to obtain history from public explorers. If a provider is unavailable, it displays that status instead of inventing a last-claim time or APY.
- Keep the old app available until you have confirmed the new watchlist. Clearing browser data or removing an installed web app can delete local data.

## What is included

| Path | Purpose |
| --- | --- |
| `src/app.html` | UI, device-local watchlist, privacy, swipe navigation and pull-to-refresh |
| `src/rpc.mjs` | Browser-side read-only Uniswap contract calls and token prices |
| `src/history.mjs` | Public claim-history reads and earnings/yield calculations |
| `assets/` | Unicorn LP artwork and ready-made PNG installation icons |
| `scripts/build.mjs` | Dependency-free static build for project paths and custom domains |
| `tests/` | Migration-path, PWA, privacy/data-boundary and yield checks |
| `docs/` | Ready-to-publish GitHub Pages application; commit this directory |

The old Sites hosting configuration, source history, runtime credentials, owner-specific position, and private dashboard integrations are not copied into this repository. The code has no preloaded personal wallet or pool.

## Development and future updates

Use Node.js 20 or newer. There are no npm package dependencies to install.

```bash
git clone https://github.com/tonygallippi/uniswap-lp-monitor.git
cd uniswap-lp-monitor
npm run build
npm test
```

To preview locally, serve the `docs` directory over HTTP, for example:

```bash
python3 -m http.server 8000 --directory docs
```

Open http://localhost:8000/. Do not open `index.html` as a `file://` URL: module imports and service workers require HTTP/HTTPS. Live data requires internet access.

Edit `src/` and run `npm run build` again. Commit both source changes and regenerated `docs/`:

```bash
git add src assets scripts tests docs README.md package.json
git commit -m "Update LP Monitor"
git push origin main
```

Once Pages is enabled for `main` + `/docs`, pushes affecting `docs/` publish automatically. Editing only `src/` does not change the live site until you rebuild and commit `docs/`.

ChatGPT can continue making changes through the connected GitHub repository. No personal access token needs to be pasted into chat or included in the code.

### PWA updates and paths

All application URLs are relative. The manifest uses `./` for its ID, scope and start URL, and the service worker computes its base from its own URL. This supports the `/uniswap-lp-monitor/` project path and a future custom domain without hardcoded root paths.

The service-worker cache name changes when UI/data-client code changes. Cached resources contain application files, not blockchain API responses. Updates load through network-first requests while saved position data remains in localStorage. Close/reopen the app if an older UI is still open. iOS may retain the installed icon; installing from the new URL provides the new icon and app identity.

## Data, providers and privacy

Supported Uniswap **v3** networks: Base, Ethereum, Arbitrum, Optimism and Polygon. v4 position URLs are not supported by this version.

- Watchlists, position snapshots, claim history and preferences are stored only in that browser/device's localStorage.
- Blockchain, explorer and price reads go directly from the visitor's browser to public data providers. Those providers necessarily receive the public contract, token and position identifiers requested.
- GitHub Pages hosts static files. It does not receive the watchlist as an application API request, and there is no app database or server-side portfolio API.
- Hosting and data providers can retain their own operational logs. Device-only app storage does not mean anonymous network access.
- No secret/API key, wallet connection or authentication is needed. No transaction is submitted. Fee `collect` is simulated using read-only `eth_call`.
- Privacy mode hides money/token quantities. Position percentages, range prices and APY percentages stay visible.

Public RPCs/explorers can rate-limit requests, block browser CORS, return incomplete history, or become unavailable. The app shows errors/saved snapshots rather than representing failed reads as current data. Claim history and APY may be unavailable even while current balances load. A dedicated provider or additional history sources can be added later if public endpoints are insufficient; never place a privileged provider secret in this public browser bundle.

## Earnings estimates

Daily earnings are estimated as current unclaimed fees divided by elapsed days since the latest verified claim. APY assumes daily reinvestment against the current deposited-liquidity value:

```text
daily earnings = unclaimed fee value / elapsed days since last claim
estimated APY = (1 + daily earnings / deposited liquidity value)^365 - 1
```

Thirty-day estimates allocate claimed fees evenly over intervals between consecutive claims, add the current unclaimed interval, and prorate to the window. The first claim is only an anchor and its amount is excluded. The daily sheet identifies partial UTC days and the available coverage.

Calculations use current token prices and assume full claims and constant principal. Partial claims, deposits, withdrawals and changing prices can distort estimates. Collect events can include withdrawn principal: when withdrawal events are detected, this version withholds earnings estimates instead of counting withdrawn liquidity as profit. Estimates exclude gas and are not guaranteed future returns. The app does not claim or reinvest fees.

## Troubleshooting

- **404 after enabling Pages:** choose `main` + `/docs`, use the exact project URL above, and check Actions.
- **Icons, modules or manifest fail:** keep relative paths; do not replace them with `/data.js` or `/icon-192.png`, which point outside the project on GitHub Pages.
- **Amounts stay stale:** check connectivity, pull down at the top or tap refresh. A saved snapshot is marked as saved.
- **Claim history/estimates unavailable:** a public explorer may be blocked or incomplete. Do not treat unavailable history as zero claims or zero earnings.
- **Blank watchlist after changing domains:** expected; browser storage is origin-specific. Re-add your position links.
- **Old icon opens ChatGPT:** it is the previous installed PWA. Install the GitHub Pages address in Safari.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for artwork attribution.

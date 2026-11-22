# Peakcut Community client

Maintained fork of stoatchat/for-web, based on upstream 7e46da7.

Branding is loaded at runtime from `/brand/config.js`; edit the public settings
in `peakcut-branding/brand.json`. Logos and privacy-conscious community analytics
are in the same directory. Community page analytics use G-WPZJCG70TH, with generic
screen paths instead of chat IDs or verification/reset tokens. Do Not Track is
respected. Analytics loads only after optional browser consent; choices are available
on the community-specific privacy page. Do not enable enhanced measurement/history, form, or outbound-link
capture for the community client.

Deployment/build/backup scripts live in PeakCut-AI/peakcut under infra/stoat.
Backend remains upstream v0.16.5; mail is branded by a private SMTP adapter.
Secrets and user data never belong in this repository.

Modified by Peakcut contributors on 22 November 2026. The client remains licensed under AGPL-3.0-or-later. Original copyright notices are retained. The Software & licences page provides attribution, warranty and licence notices, and a download of the exact deployed source.

## Build this version

Use Node 24, pnpm 11.3.0, Python 3 and Pillow (`python3 -m pip install pillow`).
For a Git checkout, first run `git submodule update --init` for the SDK and
LiveKit components; the downloadable source archive already contains them.
From the repository root run `bash peakcut-branding/build-client.sh`.
The output is `packages/client/dist`. Set VITE_HOST, VITE_API_URL and
VITE_DEV_GIFBOX_URL to your own service endpoints before building a separate
deployment. No Peakcut server credentials or database are included.

See TRADEMARKS.md for the separate Peakcut brand notice.

## Public community entry

Verified users are joined as ordinary members of the configured public community
after login/onboarding. This uses the upstream discoverable-server join route.
No paid roles are granted by joining. Existing members keep their current roles;
backend bans and private-channel ACLs remain authoritative. The client routes a
newly joined member straight to start-here, without an invite prompt.

An incoming server invitation is preserved across first login: joining the main
community does not override the regional invitation route.

Explicit public-region invitations are preserved for up to one hour across
registration/email verification tabs. Only region IDs in the public runtime
allowlist are considered. Native joins enforce bans and permissions and grant
ordinary membership only. Generic entry still opens the main community.

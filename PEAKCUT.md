# Peakcut Community client

Maintained fork of stoatchat/for-web, based on upstream 7e46da7.

Branding is loaded at runtime from `/brand/config.js`; edit the public settings
in `peakcut-branding/brand.json`. Logos and privacy-conscious community analytics
are in the same directory. Community page analytics use G-WPZJCG70TH, with generic
screen paths instead of chat IDs or verification/reset tokens. Do Not Track is
respected. Do not enable enhanced measurement/history, form, or outbound-link
capture for the community client.

Deployment/build/backup scripts live in PeakCut-AI/peakcut under infra/stoat.
Backend remains upstream v0.16.5; mail is branded by a private SMTP adapter.
Secrets and user data never belong in this repository.

The original project licence and Powered by Stoat source attribution are retained.

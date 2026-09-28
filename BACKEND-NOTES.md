# The backend behind the unlock code

This is the only server-side piece the "no login" version needs. It's small —
one table, one function — and it can be the same project you'll later use for
push notifications, so it's not really a second system.

## The flow, end to end

1. Someone donates on your existing donation page (Stripe, Donorbox, etc.)
2. That platform fires a webhook — an automatic "a payment happened" ping
3. A small function catches the webhook, generates a code like `WRITE-7F2K`,
   saves it to a table, and emails it to the donor
4. The donor opens the app, types the code into `UnlockScreen.js`
5. The app calls `verify-code`, the function checks the table, says yes or no
6. The app stores `unlocked: true` locally and never asks again on that phone

Nobody creates an account anywhere in this. The table just holds codes, not
people.

## What to actually build it with

**Supabase** is the easiest fit — free tier, a Postgres table, and "Edge
Functions" which are just small pieces of code that run when called, no
server to patch or restart.

The table:

| column | type | notes |
|---|---|---|
| `code` | text | e.g. `WRITE-7F2K` |
| `redeemed` | boolean | flip to true on first use, if you want single-use codes |
| `created_at` | timestamp | |

The verify function is genuinely about ten lines: look up the code, return
`{ valid: true }` or `{ valid: false }`.

Generating the code on donation can skip custom code entirely at first —
**Zapier** or **Make** can watch your donation platform's webhook, generate a
random code, write it into the Supabase table, and send the email, all
without you writing the automation by hand. Swap that piece for real code
later if volume grows.

## Design choices worth deciding with the director

- **Single-use or shared?** A single-use code means one donor, one device. A
  reusable code (e.g., a household or family) is one row with `redeemed`
  never set — simpler, but can't detect real limits.
- **Expiring or forever?** Codes with no expiry are friendlier for a
  "gift" framing. Skip expiry logic entirely unless there's a reason.
- **What if someone loses the code?** The email is the recovery path — no
  password reset flow needed. Worth having a small "resend my code" link on
  your donation confirmation page.

## If you'd rather skip the backend for launch

Ship the honor-system version first (no code, no check, the app is just
public) and add the unlock code in a later update once the donation platform
and email automation are actually in place. The `UnlockScreen.js` file is
ready either way — it just won't be shown until you wire the check into
`App.js`.

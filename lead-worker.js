/**
 * Airmatix lead endpoint — OPTIONAL. Not a static asset; this is Worker code.
 * All forms already fall back to a mailto: compose if this isn't deployed,
 * so the site works without it. Deploy it to get real form submits + /thanks/
 * redirects (which is what lets conversion tags count leads).
 *
 * Wire-up:
 *   1. Merge this fetch handler into your existing Worker (or deploy as its
 *      own Worker on route airmatix.ca/api/lead*).
 *   2. Create a Resend account (resend.com), verify the airmatix.ca sending
 *      domain, then: wrangler secret put RESEND_API_KEY
 *   3. Redeploy. Any provider works — swap the fetch() below if you prefer.
 */
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === "/api/lead" && req.method === "POST") {
      let d;
      try { d = await req.json(); } catch { return new Response("bad json", { status: 400 }); }
      if (d.company) return Response.json({ ok: true }); // honeypot filled = bot; pretend success
      if (!d.name || !d.email) return new Response("missing fields", { status: 400 });
      if (!env.RESEND_API_KEY) return new Response("not configured", { status: 501 }); // client falls back to mailto
      const text = `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone || "—"}\nSite: ${d.location || "—"}\nService: ${d.service || "general"}${d.lp ? " (LP)" : ""}\nPage: ${d.page || "—"}\n\n${d.message || ""}`;
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "leads@airmatix.ca",
          to: ["info@airmatix.ca"],
          reply_to: d.email,
          subject: `Quote request — ${d.location || "new site"} (${d.service || "general"})`,
          text
        })
      });
      if (!r.ok) return new Response("send failed", { status: 502 });
      return Response.json({ ok: true });
    }
    // your existing static asset serving continues below
    return env.ASSETS ? env.ASSETS.fetch(req) : new Response("not found", { status: 404 });
  }
};
